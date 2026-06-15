package com.example.demotech.module.domain;

import com.example.demotech.base.domain.BaseObject;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_learning_modules")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class LearningModule extends BaseObject {

    @Column(name = "type", nullable = false, length = 30)
    private String type; // exam_9to10, exam_university, communication, toeic, grade6-11

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "target_grades", length = 50)
    private String targetGrades; // "9,10" comma-separated

    @Column(name = "color", length = 7)
    private String color; // hex #4361EE

    @Column(name = "icon_name", length = 50)
    private String iconName;

    @Column(name = "is_published")
    private Boolean isPublished = false;

    @Column(name = "sort_order")
    private Integer sortOrder = 0;
}
