package com.example.demotech.streak.dto;

import java.util.List;

public record StreakResponse(
        int currentStreak,
        int longestStreak,
        String lastActivityDate,   // nullable
        boolean todayCompleted,
        List<StreakMilestoneDto> milestones,
        List<StreakDayDto> calendar // 90 days
) {}
