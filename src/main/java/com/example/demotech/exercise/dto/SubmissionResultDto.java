package com.example.demotech.exercise.dto;

import java.util.List;
import java.util.UUID;

public record SubmissionResultDto(
        UUID id,
        int score,
        boolean isCorrect,
        List<String> errors,
        String aiExplanation,
        String correctAnswer,
        int pointsEarned
) {}
