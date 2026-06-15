package com.example.demotech.module.dto;

import lombok.Data;

@Data
public class CreateModuleRequest {
    private String type;        // exam_9to10, exam_university, communication, toeic...
    private String title;
    private String description;
    private String targetGrades; // "9,10" or "12" or ""
    private String color;        // hex color e.g. "#4361EE"
    private Integer sortOrder;
}
