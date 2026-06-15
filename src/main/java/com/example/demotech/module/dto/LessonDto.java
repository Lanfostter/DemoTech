package com.example.demotech.module.dto;

import java.util.UUID;

public record LessonDto(
        UUID id,
        String title,
        String lessonType,
        int durationMinutes,
        int sortOrder,
        boolean isCompleted,
        boolean isLocked,
        Integer score
) {}
