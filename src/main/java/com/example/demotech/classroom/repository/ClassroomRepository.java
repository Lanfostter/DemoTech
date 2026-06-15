package com.example.demotech.classroom.repository;

import com.example.demotech.classroom.domain.Classroom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ClassroomRepository extends JpaRepository<Classroom, UUID> {
    List<Classroom> findByTeacherIdAndVoidedFalse(UUID teacherId);
    Optional<Classroom> findByInviteCodeAndVoidedFalse(String inviteCode);
    boolean existsByInviteCode(String inviteCode);
}
