package com.example.demotech.module.dto;

import java.util.UUID;

public record LessonSimpleDto(UUID id, String title, String lessonType,
                               int durationMinutes, int sortOrder, int difficulty) {}
