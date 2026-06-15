package com.example.demotech.classroom.repository;

import com.example.demotech.classroom.domain.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface AssignmentRepository extends JpaRepository<Assignment, UUID> {

    @Query("""
        SELECT a FROM Assignment a
        WHERE a.classroomId IN (
            SELECT cs.classroomId FROM ClassroomStudent cs WHERE cs.userId = :userId AND cs.voided = false
        )
        AND a.voided = false
        ORDER BY a.deadline ASC
    """)
    List<Assignment> findByStudentId(UUID userId);

    List<Assignment> findByClassroomIdAndVoidedFalse(UUID classroomId);
}
