package com.example.demotech.dashboard.dto;

import java.util.List;

public record DailySessionDto(
        int estimatedMinutes,
        int completedMinutes,
        List<DailyTaskDto> tasks
) {}
