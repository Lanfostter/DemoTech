package com.example.demotech.module.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LessonContentDto {
    private UUID lessonId;
    private String contentType;
    private String contentJson;
}
