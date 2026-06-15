package com.example.demotech.streak.repository;

import com.example.demotech.streak.domain.StreakDay;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface StreakDayRepository extends JpaRepository<StreakDay, UUID> {
    Optional<StreakDay> findByUserIdAndDate(UUID userId, LocalDate date);
    List<StreakDay> findByUserIdAndDateBetweenOrderByDateAsc(UUID userId, LocalDate from, LocalDate to);
}
