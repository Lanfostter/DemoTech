package com.example.demotech.dashboard.dto;

public record DailyTaskDto(
        String id,
        String type,           // vocabulary, grammar, reading, flashcard_review
        String title,
        int durationMinutes,
        String sourceId,
        String reason,
        boolean isCompleted
) {}
