package com.example.demotech.exercise.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class CreateExerciseRequest {
    private UUID lessonId;
    private String exerciseType; // multiple_choice, fill_in_the_blank, rewrite, ordering
    private int sortOrder;
    private int totalPoints;
    private String questionJson;
    private String correctAnswerJson;
    private String explanation;
    private int difficulty;
}
