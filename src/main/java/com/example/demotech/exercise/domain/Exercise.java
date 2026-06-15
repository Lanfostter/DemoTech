package com.example.demotech.exercise.domain;

import com.example.demotech.base.domain.BaseObject;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "tbl_exercises")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Exercise extends BaseObject {

    @Column(name = "lesson_id", nullable = false)
    private UUID lessonId;

    @Column(name = "exercise_type", nullable = false, length = 50)
    private String exerciseType; // fill_in_the_blank, multiple_choice, rewrite, ordering

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    @Column(name = "total_points")
    private int totalPoints = 10;

    @Column(name = "question_json", columnDefinition = "TEXT")
    private String questionJson;

    @Column(name = "correct_answer_json", columnDefinition = "TEXT")
    private String correctAnswerJson;

    @Column(name = "explanation", columnDefinition = "TEXT")
    private String explanation;

    @Column(name = "difficulty")
    private int difficulty = 3;
}
