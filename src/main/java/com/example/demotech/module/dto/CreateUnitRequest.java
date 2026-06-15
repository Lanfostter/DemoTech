package com.example.demotech.module.dto;

import lombok.Data;

@Data
public class CreateUnitRequest {
    private String title;
    private Integer sortOrder;
    private Integer unlockThreshold; // default 80
}
