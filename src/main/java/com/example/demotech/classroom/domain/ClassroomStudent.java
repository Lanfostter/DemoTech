package com.example.demotech.classroom.domain;

import com.example.demotech.base.domain.BaseObject;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "tbl_classroom_students",
        uniqueConstraints = @UniqueConstraint(columnNames = {"classroom_id", "user_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class ClassroomStudent extends BaseObject {

    @Column(name = "classroom_id", nullable = false)
    private UUID classroomId;

    @Column(name = "user_id", nullable = false)
    private UUID userId;
}
