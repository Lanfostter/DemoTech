package com.example.demotech.module.repository;

import com.example.demotech.module.domain.LearningModule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface LearningModuleRepository extends JpaRepository<LearningModule, UUID> {
    List<LearningModule> findByIsPublishedTrueAndVoidedFalseOrderBySortOrderAsc();
}
