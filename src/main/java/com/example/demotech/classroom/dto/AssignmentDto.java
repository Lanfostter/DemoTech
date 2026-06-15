package com.example.demotech.classroom.dto;

import java.util.UUID;

public record AssignmentDto(
        UUID id,
        UUID lessonId,
        String lessonTitle,
        String lessonType,
        String moduleTitle,
        String teacherName,
        String deadline,    // ISO string
        String status,      // todo, in_progress, submitted, graded
        Integer score,      // nullable
        long daysLeft
) {}
