package com.example.demotech.classroom.repository;

import com.example.demotech.classroom.domain.ClassroomStudent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ClassroomStudentRepository extends JpaRepository<ClassroomStudent, UUID> {
    List<ClassroomStudent> findByUserIdAndVoidedFalse(UUID userId);
    List<ClassroomStudent> findByClassroomIdAndVoidedFalse(UUID classroomId);
}
