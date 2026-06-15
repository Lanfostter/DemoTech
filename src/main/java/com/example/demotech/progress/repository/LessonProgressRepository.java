package com.example.demotech.progress.repository;

import com.example.demotech.progress.domain.LessonProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface LessonProgressRepository extends JpaRepository<LessonProgress, UUID> {
    Optional<LessonProgress> findByUserIdAndLessonId(UUID userId, UUID lessonId);
    List<LessonProgress> findByUserIdAndLessonIdIn(UUID userId, List<UUID> lessonIds);

    @Query("SELECT COUNT(lp) FROM LessonProgress lp WHERE lp.userId = :userId AND lp.lessonId IN :lessonIds AND lp.status = 'completed'")
    long countCompletedByUserIdAndLessonIds(UUID userId, List<UUID> lessonIds);

    @Query("SELECT COUNT(lp) FROM LessonProgress lp WHERE lp.userId = :userId AND lp.status = 'completed'")
    long countCompletedByUserId(UUID userId);
}
