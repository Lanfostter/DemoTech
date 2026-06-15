package com.example.demotech.report;

import com.example.demotech.base.domain.User;
import com.example.demotech.base.dto.ApiResponse;
import com.example.demotech.base.repository.UserRepository;
import com.example.demotech.exercise.domain.ExerciseSubmission;
import com.example.demotech.exercise.repository.ExerciseSubmissionRepository;
import com.example.demotech.progress.repository.LessonProgressRepository;
import com.example.demotech.vocabulary.repository.VocabularyRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ExerciseSubmissionRepository submissionRepo;
    private final LessonProgressRepository progressRepo;
    private final VocabularyRepository vocabRepo;
    private final UserRepository userRepo;

    public ReportController(ExerciseSubmissionRepository submissionRepo,
                            LessonProgressRepository progressRepo,
                            VocabularyRepository vocabRepo,
                            UserRepository userRepo) {
        this.submissionRepo = submissionRepo;
        this.progressRepo = progressRepo;
        this.vocabRepo = vocabRepo;
        this.userRepo = userRepo;
    }

    @GetMapping("/student")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStudentReport() {
        User user = currentUser();
        UUID userId = user.getId();

        long totalExercises = submissionRepo.countTotalByUserId(userId);
        Double avgScore = submissionRepo.avgScoreByUserId(userId);
        long totalLessonsCompleted = progressRepo.countCompletedByUserId(userId);
        long totalVocab = vocabRepo.countByUserId(userId);

        // Last 30 days daily activity
        LocalDateTime since = LocalDateTime.now().minusDays(30);
        List<ExerciseSubmission> recent = submissionRepo
                .findByUserIdAndSubmittedAtAfterOrderBySubmittedAtAsc(userId, since);

        // Group by date
        Map<LocalDate, Long> dailyCounts = recent.stream()
                .filter(s -> s.getSubmittedAt() != null)
                .collect(Collectors.groupingBy(
                        s -> s.getSubmittedAt().toLocalDate(),
                        Collectors.counting()
                ));

        // Build 30-day series
        List<Map<String, Object>> dailySeries = new ArrayList<>();
        for (int i = 29; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusDays(i);
            Map<String, Object> point = new LinkedHashMap<>();
            point.put("date", date.toString());
            point.put("count", dailyCounts.getOrDefault(date, 0L));
            dailySeries.add(point);
        }

        // Weekly average score (last 7 weeks)
        List<Map<String, Object>> weeklySeries = new ArrayList<>();
        for (int w = 6; w >= 0; w--) {
            LocalDate weekStart = LocalDate.now().with(DayOfWeek.MONDAY).minusWeeks(w);
            LocalDate weekEnd = weekStart.plusDays(6);
            List<ExerciseSubmission> weekSubs = recent.stream()
                    .filter(s -> s.getSubmittedAt() != null)
                    .filter(s -> {
                        LocalDate d = s.getSubmittedAt().toLocalDate();
                        return !d.isBefore(weekStart) && !d.isAfter(weekEnd);
                    })
                    .toList();
            double wAvg = weekSubs.isEmpty() ? 0
                    : weekSubs.stream().mapToInt(ExerciseSubmission::getScore).average().orElse(0);
            Map<String, Object> week = new LinkedHashMap<>();
            week.put("week", "T" + weekStart.getDayOfMonth() + "/" + weekStart.getMonthValue());
            week.put("avgScore", Math.round(wAvg));
            week.put("count", weekSubs.size());
            weeklySeries.add(week);
        }

        // Score distribution
        long perfect = recent.stream().filter(s -> s.getScore() == 100).count();
        long good = recent.stream().filter(s -> s.getScore() >= 70 && s.getScore() < 100).count();
        long fair = recent.stream().filter(s -> s.getScore() >= 40 && s.getScore() < 70).count();
        long poor = recent.stream().filter(s -> s.getScore() < 40).count();

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalExercises", totalExercises);
        result.put("avgScore", avgScore != null ? Math.round(avgScore) : 0);
        result.put("totalLessonsCompleted", totalLessonsCompleted);
        result.put("totalVocab", totalVocab);
        result.put("dailySeries", dailySeries);
        result.put("weeklySeries", weeklySeries);
        result.put("scoreDistribution", Map.of(
                "perfect", perfect, "good", good, "fair", fair, "poor", poor
        ));

        return ResponseEntity.ok(ApiResponse.success("OK", result));
    }

    private User currentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }
}
