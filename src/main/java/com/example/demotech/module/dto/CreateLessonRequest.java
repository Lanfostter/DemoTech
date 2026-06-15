package com.example.demotech.module.dto;

import lombok.Data;

@Data
public class CreateLessonRequest {
    private String title;
    private String lessonType; // grammar, reading, listening, writing, speaking, vocabulary, exam
    private Integer durationMinutes;
    private Integer sortOrder;
    private Integer difficulty;
    private String contentJson; // optional — for reading/listening content
}
