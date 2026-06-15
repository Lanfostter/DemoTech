package com.example.demotech.streak.service;

import com.example.demotech.streak.domain.Streak;
import com.example.demotech.streak.domain.StreakDay;
import com.example.demotech.streak.dto.StreakDayDto;
import com.example.demotech.streak.dto.StreakMilestoneDto;
import com.example.demotech.streak.dto.StreakResponse;
import com.example.demotech.streak.repository.StreakDayRepository;
import com.example.demotech.streak.repository.StreakRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class StreakService {

    private static final ZoneId VN_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");
    private static final List<Integer> MILESTONE_DAYS = List.of(7, 30, 100);
    private static final int CALENDAR_DAYS = 90;

    private final StreakRepository streakRepo;
    private final StreakDayRepository streakDayRepo;

    public StreakService(StreakRepository streakRepo, StreakDayRepository streakDayRepo) {
        this.streakRepo = streakRepo;
        this.streakDayRepo = streakDayRepo;
    }

    public StreakResponse getStreak(UUID userId) {
        LocalDate today = LocalDate.now(VN_ZONE);
        Streak streak = streakRepo.findByUserId(userId)
                .orElse(new Streak(userId, 0, 0, null));

        boolean todayCompleted = streak.getLastActivityDate() != null
                && streak.getLastActivityDate().equals(today);

        // Build 90-day calendar
        LocalDate from = today.minusDays(CALENDAR_DAYS - 1);
        List<StreakDay> days = streakDayRepo.findByUserIdAndDateBetweenOrderByDateAsc(userId, from, today);
        Map<LocalDate, StreakDay> dayMap = days.stream()
                .collect(Collectors.toMap(StreakDay::getDate, d -> d));

        List<StreakDayDto> calendar = new ArrayList<>();
        for (int i = CALENDAR_DAYS - 1; i >= 0; i--) {
            LocalDate d = today.minusDays(i);
            StreakDay sd = dayMap.get(d);
            if (sd != null) {
                calendar.add(new StreakDayDto(d.toString(), sd.getMinutesStudied(), sd.getMinutesStudied() > 0));
            } else {
                calendar.add(StreakDayDto.empty(d));
            }
        }

        List<StreakMilestoneDto> milestones = MILESTONE_DAYS.stream()
                .map(m -> new StreakMilestoneDto(m, streak.getLongestStreak() >= m))
                .toList();

        return new StreakResponse(
                streak.getCurrentStreak(),
                streak.getLongestStreak(),
                streak.getLastActivityDate() != null ? streak.getLastActivityDate().toString() : null,
                todayCompleted,
                milestones,
                calendar
        );
    }

    @Transactional
    public void recordActivity(UUID userId, int durationMinutes) {
        LocalDate today = LocalDate.now(VN_ZONE);

        // Upsert streak_day
        StreakDay day = streakDayRepo.findByUserIdAndDate(userId, today)
                .orElse(new StreakDay(userId, today, 0, 0));
        day.setMinutesStudied(day.getMinutesStudied() + durationMinutes);
        day.setActivitiesCount(day.getActivitiesCount() + 1);
        streakDayRepo.save(day);

        // Update streak record
        Streak streak = streakRepo.findByUserId(userId)
                .orElse(new Streak(userId, 0, 0, null));

        LocalDate lastActivity = streak.getLastActivityDate();
        if (lastActivity == null || lastActivity.isBefore(today)) {
            // First activity today
            if (lastActivity != null && lastActivity.equals(today.minusDays(1))) {
                streak.setCurrentStreak(streak.getCurrentStreak() + 1);
            } else if (lastActivity == null || lastActivity.isBefore(today.minusDays(1))) {
                streak.setCurrentStreak(1); // reset or start
            }
            streak.setLastActivityDate(today);
            if (streak.getCurrentStreak() > streak.getLongestStreak()) {
                streak.setLongestStreak(streak.getCurrentStreak());
            }
            streakRepo.save(streak);
        }
    }
}
