package com.example.demotech.module.repository;

import com.example.demotech.module.domain.LessonContent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface LessonContentRepository extends JpaRepository<LessonContent, UUID> {
    Optional<LessonContent> findByLessonId(UUID lessonId);
}
