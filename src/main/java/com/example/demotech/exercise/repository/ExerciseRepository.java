package com.example.demotech.exercise.repository;

import com.example.demotech.exercise.domain.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ExerciseRepository extends JpaRepository<Exercise, UUID> {
    List<Exercise> findByLessonIdAndVoidedFalseOrderBySortOrderAsc(UUID lessonId);
    long countByLessonIdAndVoidedFalse(UUID lessonId);
}
