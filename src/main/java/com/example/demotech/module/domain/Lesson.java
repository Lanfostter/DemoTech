package com.example.demotech.module.domain;

import com.example.demotech.base.domain.BaseObject;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "tbl_lessons")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Lesson extends BaseObject {

    @Column(name = "unit_id", nullable = false)
    private UUID unitId;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "lesson_type", nullable = false, length = 20)
    private String lessonType; // grammar, reading, listening, writing, speaking, vocabulary, exam

    @Column(name = "duration_minutes")
    private Integer durationMinutes = 15;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder;

    @Column(name = "difficulty")
    private Integer difficulty = 3; // 1-5
}
