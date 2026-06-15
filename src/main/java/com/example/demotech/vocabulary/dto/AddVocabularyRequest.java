package com.example.demotech.vocabulary.dto;

public record AddVocabularyRequest(
        String word,
        String definition,
        String translation,
        String example,
        String sourceLessonId
) {}
