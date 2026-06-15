package com.example.demotech.progress.service;

import com.example.demotech.progress.domain.LessonProgress;
import com.example.demotech.progress.repository.LessonProgressRepository;
import com.example.demotech.streak.service.StreakService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class LessonProgressService {

    private final LessonProgressRepository lessonProgressRepo;
    private final StreakService streakService;

    public LessonProgressService(LessonProgressRepository lessonProgressRepo,
                                  StreakService streakService) {
        this.lessonProgressRepo = lessonProgressRepo;
        this.streakService = streakService;
    }

    @Transactional
    public void updateProgress(UUID userId, UUID lessonId, int score) {
        LessonProgress progress = lessonProgressRepo
                .findByUserIdAndLessonId(userId, lessonId)
                .orElseGet(() -> {
                    LessonProgress p = new LessonProgress();
                    p.setUserId(userId);
                    p.setLessonId(lessonId);
                    p.setStatus("not_started");
                    return p;
                });

        // Keep highest score
        if (progress.getScore() == null || score > progress.getScore()) {
            progress.setScore(score);
        }

        // Update status
        if (score >= 50) {
            progress.setStatus("completed");
            if (progress.getCompletedAt() == null) {
                progress.setCompletedAt(LocalDateTime.now());
            }
        } else {
            if (!"completed".equals(progress.getStatus())) {
                progress.setStatus("in_progress");
            }
        }

        lessonProgressRepo.save(progress);

        // Record streak activity (15 minutes per lesson)
        streakService.recordActivity(userId, 15);
    }
}
