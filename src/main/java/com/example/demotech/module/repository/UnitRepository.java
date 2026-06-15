package com.example.demotech.module.repository;

import com.example.demotech.module.domain.Unit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface UnitRepository extends JpaRepository<Unit, UUID> {
    List<Unit> findByModuleIdAndVoidedFalseOrderBySortOrderAsc(UUID moduleId);
    long countByModuleIdAndVoidedFalse(UUID moduleId);
}
