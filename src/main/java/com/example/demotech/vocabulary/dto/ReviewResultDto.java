package com.example.demotech.vocabulary.dto;

public record ReviewResultDto(
        String nextReviewAt,
        int newIntervalDays,
        int masteryLevel
) {}
