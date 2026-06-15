package com.example.demotech.classroom.repository;

import com.example.demotech.classroom.domain.AssignmentSubmission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AssignmentSubmissionRepository extends JpaRepository<AssignmentSubmission, UUID> {
    Optional<AssignmentSubmission> findByAssignmentIdAndUserId(UUID assignmentId, UUID userId);
    List<AssignmentSubmission> findByUserIdAndAssignmentIdIn(UUID userId, List<UUID> assignmentIds);
}
