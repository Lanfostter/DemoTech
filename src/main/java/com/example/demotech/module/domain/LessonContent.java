package com.example.demotech.module.domain;

import com.example.demotech.base.domain.BaseObject;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;

import java.sql.Types;
import java.util.UUID;

@Entity
@Table(name = "tbl_lesson_content")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class LessonContent extends BaseObject {

    @Column(name = "lesson_id", nullable = false, unique = true)
    @JdbcTypeCode(Types.VARCHAR)
    private UUID lessonId;

    @Column(name = "content_type", nullable = false, length = 20)
    private String contentType; // reading, listening

    @Column(name = "content_json", columnDefinition = "TEXT", nullable = false)
    private String contentJson;
}