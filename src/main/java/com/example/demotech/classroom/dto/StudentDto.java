package com.example.demotech.classroom.dto;

import java.util.UUID;

public record StudentDto(UUID id, String name, String email, String username) {}
