package com.example.demotech.vocabulary.repository;

import com.example.demotech.vocabulary.domain.FlashcardReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FlashcardReviewRepository extends JpaRepository<FlashcardReview, UUID> {
    Optional<FlashcardReview> findByUserIdAndVocabularyId(UUID userId, UUID vocabularyId);
    List<FlashcardReview> findByUserIdAndVoidedFalse(UUID userId);

    @Query("SELECT fr FROM FlashcardReview fr WHERE fr.userId = :userId AND fr.voided = false AND fr.nextReviewAt <= :today")
    List<FlashcardReview> findDueToday(UUID userId, LocalDate today);

    @Query("SELECT COUNT(fr) FROM FlashcardReview fr WHERE fr.userId = :userId AND fr.voided = false AND fr.repetitions >= 3")
    long countMastered(UUID userId);

    @Query("SELECT COUNT(fr) FROM FlashcardReview fr WHERE fr.userId = :userId AND fr.voided = false AND fr.nextReviewAt <= :today")
    long countDueToday(UUID userId, LocalDate today);
}
