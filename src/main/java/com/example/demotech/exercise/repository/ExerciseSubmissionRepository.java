package com.example.demotech.exercise.repository;

import com.example.demotech.exercise.domain.ExerciseSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ExerciseSubmissionRepository extends JpaRepository<ExerciseSubmission, UUID> {
    Optional<ExerciseSubmission> findByUserIdAndExerciseId(UUID userId, UUID exerciseId);
    List<ExerciseSubmission> findByUserIdAndLessonId(UUID userId, UUID lessonId);
    long countByUserIdAndLessonId(UUID userId, UUID lessonId);
    List<ExerciseSubmission> findByUserIdAndSubmittedAtAfterOrderBySubmittedAtAsc(UUID userId, LocalDateTime after);

    @Query("SELECT COUNT(s) FROM ExerciseSubmission s WHERE s.userId = :userId AND s.voided = false")
    long countTotalByUserId(UUID userId);

    @Query("SELECT AVG(s.score) FROM ExerciseSubmission s WHERE s.userId = :userId AND s.voided = false")
    Double avgScoreByUserId(UUID userId);
}
