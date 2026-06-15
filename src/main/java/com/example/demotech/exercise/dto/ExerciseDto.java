package com.example.demotech.exercise.dto;

import java.util.UUID;

public record ExerciseDto(
        UUID id,
        String exerciseType,
        int sortOrder,
        int totalPoints,
        String questionJson,
        String difficulty
) {}
