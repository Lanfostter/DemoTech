package com.example.demotech.vocabulary.service;

import com.example.demotech.vocabulary.domain.FlashcardReview;
import com.example.demotech.vocabulary.domain.Vocabulary;
import com.example.demotech.vocabulary.dto.*;
import com.example.demotech.vocabulary.repository.FlashcardReviewRepository;
import com.example.demotech.vocabulary.repository.VocabularyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class VocabularyService {

    private static final int MASTERY_THRESHOLD = 3; // repetitions >= 3 = mastered

    private final VocabularyRepository vocabRepo;
    private final FlashcardReviewRepository reviewRepo;

    public VocabularyService(VocabularyRepository vocabRepo, FlashcardReviewRepository reviewRepo) {
        this.vocabRepo = vocabRepo;
        this.reviewRepo = reviewRepo;
    }

    public List<VocabularyDto> getVocabulary(UUID userId, boolean dueToday) {
        LocalDate today = LocalDate.now();
        List<Vocabulary> words = vocabRepo.findByUserIdAndVoidedFalse(userId);
        return words.stream()
                .map(v -> {
                    FlashcardReview review = reviewRepo.findByUserIdAndVocabularyId(userId, v.getId()).orElse(null);
                    String nextReview = review != null && review.getNextReviewAt() != null
                            ? review.getNextReviewAt().toString() : null;
                    int masteryLevel = review != null ? Math.min(review.getRepetitions(), 5) : 0;

                    if (dueToday && review != null && review.getNextReviewAt() != null
                            && review.getNextReviewAt().isAfter(today)) {
                        return null; // skip
                    }
                    return new VocabularyDto(v.getId(), v.getWord(), v.getDefinition(),
                            v.getTranslation(), v.getAudioUrl(), v.getExample(), nextReview, masteryLevel);
                })
                .filter(v -> v != null)
                .toList();
    }

    @Transactional
    public VocabularyDto addVocabulary(UUID userId, AddVocabularyRequest request) {
        UUID sourceLessonId = null;
        if (request.sourceLessonId() != null && !request.sourceLessonId().isBlank()) {
            try {
                sourceLessonId = UUID.fromString(request.sourceLessonId());
            } catch (IllegalArgumentException ignored) {}
        }

        Vocabulary vocab = new Vocabulary();
        vocab.setUserId(userId);
        vocab.setWord(request.word());
        vocab.setDefinition(request.definition());
        vocab.setTranslation(request.translation());
        vocab.setExample(request.example());
        vocab.setSourceLessonId(sourceLessonId);
        vocabRepo.save(vocab);

        // Initialize SRS flashcard review
        FlashcardReview review = new FlashcardReview();
        review.setUserId(userId);
        review.setVocabularyId(vocab.getId());
        review.setEaseFactor(2.5);
        review.setIntervalDays(1);
        review.setRepetitions(0);
        review.setNextReviewAt(LocalDate.now());
        reviewRepo.save(review);

        return new VocabularyDto(vocab.getId(), vocab.getWord(), vocab.getDefinition(),
                vocab.getTranslation(), vocab.getAudioUrl(), vocab.getExample(),
                review.getNextReviewAt().toString(), 0);
    }

    @Transactional
    public ReviewResultDto review(UUID userId, UUID vocabularyId, String result) {
        FlashcardReview review = reviewRepo.findByUserIdAndVocabularyId(userId, vocabularyId)
                .orElseGet(() -> {
                    FlashcardReview r = new FlashcardReview();
                    r.setUserId(userId);
                    r.setVocabularyId(vocabularyId);
                    r.setEaseFactor(2.5);
                    r.setIntervalDays(1);
                    r.setRepetitions(0);
                    return r;
                });

        int quality = qualityFromResult(result);
        applySM2(review, quality);
        review.setLastResult(result);
        review.setLastReviewedAt(LocalDateTime.now());
        reviewRepo.save(review);

        int masteryLevel = Math.min(review.getRepetitions(), 5);
        return new ReviewResultDto(review.getNextReviewAt().toString(), review.getIntervalDays(), masteryLevel);
    }

    public VocabularyStatsDto getStats(UUID userId) {
        LocalDate today = LocalDate.now();
        long totalWords = vocabRepo.countByUserIdAndVoidedFalse(userId);
        long wordsDueToday = reviewRepo.countDueToday(userId, today);
        long masteredWords = reviewRepo.countMastered(userId);
        return new VocabularyStatsDto(totalWords, wordsDueToday, masteredWords);
    }

    // SM-2 Algorithm
    private void applySM2(FlashcardReview review, int quality) {
        double oldEF = review.getEaseFactor();
        double newEF = Math.max(1.3, oldEF + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
        review.setEaseFactor(newEF);

        int newInterval;
        int newReps;
        if (quality < 3) {
            newInterval = 1;
            newReps = 0;
        } else {
            int reps = review.getRepetitions();
            if (reps == 0) {
                newInterval = 1;
                newReps = 1;
            } else if (reps == 1) {
                newInterval = 6;
                newReps = 2;
            } else {
                newInterval = (int) Math.round(review.getIntervalDays() * newEF);
                newReps = reps + 1;
            }
        }

        review.setIntervalDays(newInterval);
        review.setRepetitions(newReps);
        review.setNextReviewAt(LocalDate.now().plusDays(newInterval));
    }

    private int qualityFromResult(String result) {
        return switch (result) {
            case "again" -> 0;
            case "hard"  -> 2;
            case "good"  -> 4;
            case "easy"  -> 5;
            default      -> 4;
        };
    }
}
