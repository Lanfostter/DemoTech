package com.example.demotech.classroom.domain;

import com.example.demotech.base.domain.BaseObject;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "tbl_classrooms")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Classroom extends BaseObject {

    @Column(name = "teacher_id", nullable = false)
    private UUID teacherId;

    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "invite_code", length = 6, unique = true)
    private String inviteCode;

    @Column(name = "is_active")
    private Boolean isActive = true;
}
