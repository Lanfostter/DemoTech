package com.example.demotech.module.domain;

import com.example.demotech.base.domain.BaseObject;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "tbl_units")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Unit extends BaseObject {

    @Column(name = "module_id", nullable = false)
    private UUID moduleId;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder;

    @Column(name = "unlock_threshold")
    private Integer unlockThreshold = 0; // % of previous unit needed (0 = no lock)
}
