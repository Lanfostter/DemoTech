package com.example.demotech.vocabulary.dto;

import java.util.UUID;

public record VocabularyDto(
        UUID id,
        String word,
        String definition,
        String translation,
        String audioUrl,
        String example,
        String nextReviewAt,
        int masteryLevel
) {}
