package com.example.demotech.exercise.service;

import com.example.demotech.exercise.domain.Exercise;
import com.example.demotech.exercise.domain.ExerciseSubmission;
import com.example.demotech.exercise.dto.ExerciseDto;
import com.example.demotech.exercise.dto.SubmissionResultDto;
import com.example.demotech.exercise.repository.ExerciseRepository;
import com.example.demotech.exercise.repository.ExerciseSubmissionRepository;
import com.example.demotech.module.repository.LessonRepository;
import com.example.demotech.progress.service.LessonProgressService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ExerciseService {

    private final ExerciseRepository exerciseRepo;
    private final ExerciseSubmissionRepository submissionRepo;
    private final LessonRepository lessonRepo;
    private final LessonProgressService lessonProgressService;

    public ExerciseService(ExerciseRepository exerciseRepo,
                           ExerciseSubmissionRepository submissionRepo,
                           LessonRepository lessonRepo,
                           LessonProgressService lessonProgressService) {
        this.exerciseRepo = exerciseRepo;
        this.submissionRepo = submissionRepo;
        this.lessonRepo = lessonRepo;
        this.lessonProgressService = lessonProgressService;
    }

    public List<ExerciseDto> getByLessonId(UUID lessonId) {
        return exerciseRepo.findByLessonIdAndVoidedFalseOrderBySortOrderAsc(lessonId)
                .stream()
                .map(e -> new ExerciseDto(
                        e.getId(),
                        e.getExerciseType(),
                        e.getSortOrder(),
                        e.getTotalPoints(),
                        e.getQuestionJson(),
                        String.valueOf(e.getDifficulty())
                ))
                .toList();
    }

    @Transactional
    public SubmissionResultDto submit(UUID userId, UUID exerciseId, String answerJson) {
        Exercise exercise = exerciseRepo.findById(exerciseId)
                .orElseThrow(() -> new RuntimeException("Exercise not found: " + exerciseId));

        String correctAnswerJson = exercise.getCorrectAnswerJson();
        String exerciseType = exercise.getExerciseType();

        int score;
        List<String> errors = new ArrayList<>();
        String submittedAnswer = answerJson != null ? answerJson.trim() : "";

        if ("multiple_choice".equals(exerciseType)) {
            // Extract optionId from correctAnswer JSON: {"optionId": "b"}
            String correctOptionId = extractJsonStringField(correctAnswerJson, "optionId");
            // Extract answer from submitted JSON: may be raw option id or {"optionId": "b"}
            String submittedOptionId = extractJsonStringField(submittedAnswer, "optionId");
            if (submittedOptionId == null) {
                submittedOptionId = submittedAnswer.replaceAll("[\"{}]", "").trim();
            }
            if (correctOptionId != null && correctOptionId.equalsIgnoreCase(submittedOptionId)) {
                score = 100;
            } else {
                score = 0;
                errors.add("Expected: " + correctOptionId + ", got: " + submittedOptionId);
            }
        } else if ("fill_in_the_blank".equals(exerciseType)) {
            // correctAnswer: {"answers": ["goes", "has"]}
            List<String> correctAnswers = extractJsonStringArray(correctAnswerJson, "answers");
            List<String> submittedAnswers = extractJsonStringArray(submittedAnswer, "answers");
            if (submittedAnswers.isEmpty()) {
                // treat raw string as single answer
                submittedAnswers = List.of(submittedAnswer.replaceAll("[\"\\[\\]]", "").trim());
            }
            int correct = 0;
            int total = correctAnswers.size();
            for (int i = 0; i < total; i++) {
                String expected = correctAnswers.get(i).trim().toLowerCase();
                String submitted = i < submittedAnswers.size()
                        ? submittedAnswers.get(i).trim().toLowerCase()
                        : "";
                if (expected.equals(submitted)) {
                    correct++;
                } else {
                    errors.add("Blank " + (i + 1) + ": expected '" + correctAnswers.get(i) + "', got '" + (i < submittedAnswers.size() ? submittedAnswers.get(i) : "") + "'");
                }
            }
            score = total > 0 ? (correct * 100 / total) : 0;
        } else {
            // rewrite / ordering: simple case-insensitive trim compare
            String correctText = extractJsonStringField(correctAnswerJson, "text");
            if (correctText == null) correctText = correctAnswerJson;
            String submittedText = extractJsonStringField(submittedAnswer, "text");
            if (submittedText == null) submittedText = submittedAnswer;
            if (correctText != null && correctText.trim().equalsIgnoreCase(submittedText.trim())) {
                score = 100;
            } else {
                score = 0;
                errors.add("Expected: " + correctText);
            }
        }

        boolean isCorrect = score >= 100;
        int pointsEarned = (int) Math.round(exercise.getTotalPoints() * (score / 100.0));

        // Upsert submission
        ExerciseSubmission submission = submissionRepo.findByUserIdAndExerciseId(userId, exerciseId)
                .orElseGet(() -> {
                    ExerciseSubmission s = new ExerciseSubmission();
                    s.setUserId(userId);
                    s.setLessonId(exercise.getLessonId());
                    s.setExerciseId(exerciseId);
                    return s;
                });
        submission.setAnswerJson(answerJson);
        submission.setScore(score);
        submission.setErrors(String.join(",", errors));
        submission.setAiExplanation(exercise.getExplanation());
        submission.setPointsEarned(pointsEarned);
        submission.setSubmittedAt(LocalDateTime.now());
        submissionRepo.save(submission);

        // Check if all exercises for this lesson are done
        long totalExercises = exerciseRepo.countByLessonIdAndVoidedFalse(exercise.getLessonId());
        long submittedCount = submissionRepo.countByUserIdAndLessonId(userId, exercise.getLessonId());
        if (submittedCount >= totalExercises && totalExercises > 0) {
            // Calculate average score across all submissions
            List<ExerciseSubmission> allSubs = submissionRepo.findByUserIdAndLessonId(userId, exercise.getLessonId());
            int avgScore = (int) allSubs.stream().mapToInt(ExerciseSubmission::getScore).average().orElse(score);
            lessonProgressService.updateProgress(userId, exercise.getLessonId(), avgScore);
        }

        return new SubmissionResultDto(
                submission.getId(),
                score,
                isCorrect,
                errors,
                exercise.getExplanation(),
                correctAnswerJson,
                pointsEarned
        );
    }

    // Minimal JSON field extractor (avoids external dependency)
    private String extractJsonStringField(String json, String field) {
        if (json == null) return null;
        Pattern p = Pattern.compile("\"" + field + "\"\\s*:\\s*\"([^\"]+)\"");
        Matcher m = p.matcher(json);
        return m.find() ? m.group(1) : null;
    }

    private List<String> extractJsonStringArray(String json, String field) {
        if (json == null) return new ArrayList<>();
        // Match "field": ["val1", "val2", ...]
        Pattern outer = Pattern.compile("\"" + field + "\"\\s*:\\s*\\[([^\\]]+)\\]");
        Matcher outerM = outer.matcher(json);
        if (!outerM.find()) return new ArrayList<>();
        String arrayContent = outerM.group(1);
        Pattern inner = Pattern.compile("\"([^\"]+)\"");
        Matcher innerM = inner.matcher(arrayContent);
        List<String> result = new ArrayList<>();
        while (innerM.find()) {
            result.add(innerM.group(1));
        }
        return result;
    }
}
