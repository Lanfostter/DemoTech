package com.example.demotech.vocabulary.dto;

public record VocabularyStatsDto(
        long totalWords,
        long wordsDueToday,
        long masteredWords
) {}
