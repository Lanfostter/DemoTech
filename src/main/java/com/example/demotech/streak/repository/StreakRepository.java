package com.example.demotech.streak.repository;

import com.example.demotech.streak.domain.Streak;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface StreakRepository extends JpaRepository<Streak, UUID> {
    Optional<Streak> findByUserId(UUID userId);
}
