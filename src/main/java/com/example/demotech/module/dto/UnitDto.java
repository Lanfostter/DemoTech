package com.example.demotech.module.dto;

import java.util.List;
import java.util.UUID;

public record UnitDto(
        UUID id,
        String title,
        int sortOrder,
        int lessonCount,
        int completedLessons,
        boolean isLocked,
        List<LessonDto> lessons
) {}
