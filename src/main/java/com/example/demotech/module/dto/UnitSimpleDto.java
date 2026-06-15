package com.example.demotech.module.dto;

import java.util.UUID;

public record UnitSimpleDto(UUID id, String title, int sortOrder, int unlockThreshold) {}
