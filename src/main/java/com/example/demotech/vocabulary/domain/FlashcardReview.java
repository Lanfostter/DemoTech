package com.example.demotech.vocabulary.domain;

import com.example.demotech.base.domain.BaseObject;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tbl_flashcard_reviews",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "vocabulary_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class FlashcardReview extends BaseObject {

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "vocabulary_id", nullable = false)
    private UUID vocabularyId;

    @Column(name = "ease_factor")
    private double easeFactor = 2.5;

    @Column(name = "interval_days")
    private int intervalDays = 1;

    @Column(name = "repetitions")
    private int repetitions = 0;

    @Column(name = "next_review_at")
    private LocalDate nextReviewAt;

    @Column(name = "last_result", length = 10)
    private String lastResult;

    @Column(name = "last_reviewed_at")
    private LocalDateTime lastReviewedAt;
}
