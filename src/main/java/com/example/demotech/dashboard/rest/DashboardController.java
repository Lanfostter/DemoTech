package com.example.demotech.dashboard.rest;

import com.example.demotech.base.domain.User;
import com.example.demotech.base.dto.ApiResponse;
import com.example.demotech.base.repository.UserRepository;
import com.example.demotech.dashboard.dto.DailySessionDto;
import com.example.demotech.dashboard.dto.DailyTaskDto;
import com.example.demotech.module.domain.Lesson;
import com.example.demotech.module.domain.LearningModule;
import com.example.demotech.module.domain.Unit;
import com.example.demotech.module.repository.LearningModuleRepository;
import com.example.demotech.module.repository.LessonRepository;
import com.example.demotech.module.repository.UnitRepository;
import com.example.demotech.progress.repository.LessonProgressRepository;
import com.example.demotech.streak.service.StreakService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final LearningModuleRepository moduleRepo;
    private final UnitRepository unitRepo;
    private final LessonRepository lessonRepo;
    private final LessonProgressRepository progressRepo;
    private final StreakService streakService;
    private final UserRepository userRepo;

    public DashboardController(LearningModuleRepository moduleRepo,
                                UnitRepository unitRepo,
                                LessonRepository lessonRepo,
                                LessonProgressRepository progressRepo,
                                StreakService streakService,
                                UserRepository userRepo) {
        this.moduleRepo = moduleRepo;
        this.unitRepo = unitRepo;
        this.lessonRepo = lessonRepo;
        this.progressRepo = progressRepo;
        this.streakService = streakService;
        this.userRepo = userRepo;
    }

    @GetMapping("/daily-session")
    public ResponseEntity<ApiResponse<DailySessionDto>> getDailySession() {
        User user = currentUser();
        List<DailyTaskDto> tasks = buildDailyTasks(user.getId());
        int completed = (int) tasks.stream().filter(DailyTaskDto::isCompleted).count();
        DailySessionDto session = new DailySessionDto(15, completed * 5, tasks);
        return ResponseEntity.ok(ApiResponse.success("OK", session));
    }

    private List<DailyTaskDto> buildDailyTasks(UUID userId) {
        List<DailyTaskDto> tasks = new ArrayList<>();
        List<LearningModule> modules = moduleRepo.findByIsPublishedTrueAndVoidedFalseOrderBySortOrderAsc();

        // Pick up to 3 next-uncompleted lessons across modules
        for (LearningModule module : modules) {
            if (tasks.size() >= 3) break;
            List<Unit> units = unitRepo.findByModuleIdAndVoidedFalseOrderBySortOrderAsc(module.getId());
            for (Unit unit : units) {
                if (tasks.size() >= 3) break;
                List<Lesson> lessons = lessonRepo.findByUnitIdAndVoidedFalseOrderBySortOrderAsc(unit.getId());
                for (Lesson lesson : lessons) {
                    if (tasks.size() >= 3) break;
                    boolean completed = progressRepo
                            .findByUserIdAndLessonId(userId, lesson.getId())
                            .map(p -> "completed".equals(p.getStatus()))
                            .orElse(false);

                    String type = mapLessonType(lesson.getLessonType());
                    String reason = reasonFor(lesson.getLessonType(), completed);

                    tasks.add(new DailyTaskDto(
                            lesson.getId().toString(), type,
                            lesson.getTitle(), lesson.getDurationMinutes(),
                            lesson.getId().toString(), reason, completed
                    ));
                }
            }
        }

        // Pad with flashcard review if < 3 tasks
        if (tasks.size() < 3) {
            tasks.add(new DailyTaskDto(
                    "flashcard-daily", "flashcard_review",
                    "Ôn flashcard hôm nay", 5,
                    "flashcard", "Ôn lại từ vựng đến hạn", false
            ));
        }

        return tasks;
    }

    private String mapLessonType(String lessonType) {
        return switch (lessonType) {
            case "grammar", "reading", "listening", "writing" -> lessonType;
            case "vocabulary" -> "vocabulary";
            default -> "grammar";
        };
    }

    private String reasonFor(String type, boolean completed) {
        if (completed) return "Đã hoàn thành";
        return switch (type) {
            case "grammar"    -> "Luyện ngữ pháp theo lộ trình";
            case "reading"    -> "Cải thiện kỹ năng đọc hiểu";
            case "listening"  -> "Luyện nghe hàng ngày";
            case "vocabulary" -> "Học từ vựng mới hôm nay";
            default           -> "Tiếp tục lộ trình học";
        };
    }

    private User currentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
