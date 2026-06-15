package com.example.demotech.exercise.domain;

import com.example.demotech.base.domain.BaseObject;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tbl_exercise_submissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class ExerciseSubmission extends BaseObject {

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "lesson_id", nullable = false)
    private UUID lessonId;

    @Column(name = "exercise_id", nullable = false)
    private UUID exerciseId;

    @Column(name = "answer_json", columnDefinition = "TEXT")
    private String answerJson;

    @Column(name = "score")
    private int score; // 0-100

    @Column(name = "errors", columnDefinition = "TEXT")
    private String errors; // comma-separated

    @Column(name = "ai_explanation", columnDefinition = "TEXT")
    private String aiExplanation;

    @Column(name = "points_earned")
    private int pointsEarned;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;
}
