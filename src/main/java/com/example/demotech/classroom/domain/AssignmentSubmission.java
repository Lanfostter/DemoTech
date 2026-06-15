package com.example.demotech.classroom.domain;

import com.example.demotech.base.domain.BaseObject;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tbl_assignment_submissions",
        uniqueConstraints = @UniqueConstraint(columnNames = {"assignment_id", "user_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class AssignmentSubmission extends BaseObject {

    @Column(name = "assignment_id", nullable = false)
    private UUID assignmentId;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "status", length = 20)
    private String status = "pending"; // pending, submitted, graded

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "score")
    private Integer score;
}
