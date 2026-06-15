package com.example.demotech.module.dto;

import java.util.UUID;

public record ModuleDto(
        UUID id,
        String type,
        String title,
        String description,
        String targetGrades,
        int unitCount,
        int lessonCount,
        int completionPercent,
        String color
) {}
