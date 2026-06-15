package com.example.demotech.streak.dto;

import java.time.LocalDate;

public record StreakDayDto(
        String date,          // YYYY-MM-DD
        int minutesStudied,
        boolean isActive
) {
    public static StreakDayDto empty(LocalDate date) {
        return new StreakDayDto(date.toString(), 0, false);
    }
}
