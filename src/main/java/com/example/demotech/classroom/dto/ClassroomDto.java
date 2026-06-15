package com.example.demotech.classroom.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record ClassroomDto(
        UUID id,
        String name,
        String inviteCode,
        int studentCount,
        LocalDateTime createdAt
) {}
