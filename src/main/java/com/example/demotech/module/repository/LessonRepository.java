package com.example.demotech.module.repository;

import com.example.demotech.module.domain.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface LessonRepository extends JpaRepository<Lesson, UUID> {
    List<Lesson> findByUnitIdAndVoidedFalseOrderBySortOrderAsc(UUID unitId);
    long countByUnitIdAndVoidedFalse(UUID unitId);
}
