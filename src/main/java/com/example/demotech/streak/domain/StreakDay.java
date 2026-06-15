package com.example.demotech.streak.domain;

import com.example.demotech.base.domain.BaseObject;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "tbl_streak_days",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "study_date"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class StreakDay extends BaseObject {

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "study_date", nullable = false)
    private LocalDate date;

    @Column(name = "minutes_studied")
    private Integer minutesStudied = 0;

    @Column(name = "activities_count")
    private Integer activitiesCount = 0;
}
