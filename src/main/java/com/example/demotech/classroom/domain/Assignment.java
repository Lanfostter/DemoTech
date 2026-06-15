package com.example.demotech.classroom.domain;

import com.example.demotech.base.domain.BaseObject;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tbl_assignments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Assignment extends BaseObject {

    @Column(name = "classroom_id", nullable = false)
    private UUID classroomId;

    @Column(name = "lesson_id", nullable = false)
    private UUID lessonId;

    @Column(name = "deadline")
    private LocalDateTime deadline;

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;
}
