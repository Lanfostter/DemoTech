package com.example.demotech.vocabulary.domain;

import com.example.demotech.base.domain.BaseObject;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "tbl_vocabulary",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "word"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Vocabulary extends BaseObject {

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "word", nullable = false, length = 100)
    private String word;

    @Column(name = "definition", columnDefinition = "TEXT")
    private String definition;

    @Column(name = "translation", length = 200)
    private String translation;

    @Column(name = "audio_url", columnDefinition = "TEXT")
    private String audioUrl;

    @Column(name = "example", columnDefinition = "TEXT")
    private String example;

    @Column(name = "source_lesson_id")
    private UUID sourceLessonId;
}
