package com.example.demotech.module.service;

import com.example.demotech.module.domain.Lesson;
import com.example.demotech.module.domain.LearningModule;
import com.example.demotech.module.domain.LessonContent;
import com.example.demotech.module.domain.Unit;
import com.example.demotech.module.dto.LessonContentDto;
import com.example.demotech.module.dto.LessonDto;
import com.example.demotech.module.dto.ModuleDto;
import com.example.demotech.module.dto.UnitDto;
import com.example.demotech.module.repository.LearningModuleRepository;
import com.example.demotech.module.repository.LessonContentRepository;
import com.example.demotech.module.repository.LessonRepository;
import com.example.demotech.module.repository.UnitRepository;
import com.example.demotech.progress.domain.LessonProgress;
import com.example.demotech.progress.repository.LessonProgressRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class LearningModuleService {

    private final LearningModuleRepository moduleRepo;
    private final UnitRepository unitRepo;
    private final LessonRepository lessonRepo;
    private final LessonProgressRepository progressRepo;
    private final LessonContentRepository lessonContentRepo;

    public LearningModuleService(LearningModuleRepository moduleRepo,
                                  UnitRepository unitRepo,
                                  LessonRepository lessonRepo,
                                  LessonProgressRepository progressRepo,
                                  LessonContentRepository lessonContentRepo) {
        this.moduleRepo = moduleRepo;
        this.unitRepo = unitRepo;
        this.lessonRepo = lessonRepo;
        this.progressRepo = progressRepo;
        this.lessonContentRepo = lessonContentRepo;
    }

    public List<ModuleDto> getModules(UUID userId) {
        List<LearningModule> modules = moduleRepo.findByIsPublishedTrueAndVoidedFalseOrderBySortOrderAsc();
        return modules.stream().map(m -> buildModuleDto(m, userId)).toList();
    }

    public List<UnitDto> getUnits(UUID moduleId, UUID userId) {
        List<Unit> units = unitRepo.findByModuleIdAndVoidedFalseOrderBySortOrderAsc(moduleId);
        List<UnitDto> result = new ArrayList<>();
        int prevCompletionPct = 100; // first unit is always unlocked

        for (int i = 0; i < units.size(); i++) {
            Unit unit = units.get(i);
            List<Lesson> lessons = lessonRepo.findByUnitIdAndVoidedFalseOrderBySortOrderAsc(unit.getId());
            List<UUID> lessonIds = lessons.stream().map(Lesson::getId).toList();

            long completed = lessonIds.isEmpty() ? 0
                    : progressRepo.countCompletedByUserIdAndLessonIds(userId, lessonIds);
            int completionPct = lessons.isEmpty() ? 0 : (int) (completed * 100 / lessons.size());

            boolean isLocked = i > 0 && prevCompletionPct < (units.get(i - 1).getUnlockThreshold() != null
                    ? units.get(i - 1).getUnlockThreshold() : 0);

            List<LessonDto> lessonDtos = buildLessonDtos(lessons, userId, isLocked);
            result.add(new UnitDto(unit.getId(), unit.getTitle(), unit.getSortOrder(),
                    lessons.size(), (int) completed, isLocked, lessonDtos));

            prevCompletionPct = completionPct;
        }
        return result;
    }

    private ModuleDto buildModuleDto(LearningModule m, UUID userId) {
        List<Unit> units = unitRepo.findByModuleIdAndVoidedFalseOrderBySortOrderAsc(m.getId());
        int totalLessons = 0;
        int completedLessons = 0;

        for (Unit u : units) {
            List<Lesson> lessons = lessonRepo.findByUnitIdAndVoidedFalseOrderBySortOrderAsc(u.getId());
            List<UUID> ids = lessons.stream().map(Lesson::getId).toList();
            totalLessons += lessons.size();
            if (!ids.isEmpty()) {
                completedLessons += progressRepo.countCompletedByUserIdAndLessonIds(userId, ids);
            }
        }

        int pct = totalLessons == 0 ? 0 : (int) (completedLessons * 100 / totalLessons);
        return new ModuleDto(m.getId(), m.getType(), m.getTitle(), m.getDescription(),
                m.getTargetGrades(), units.size(), totalLessons, pct,
                m.getColor() != null ? m.getColor() : "#4361EE");
    }

    public Optional<LessonContentDto> getLessonContent(UUID lessonId) {
        return lessonContentRepo.findByLessonId(lessonId)
                .map(c -> new LessonContentDto(c.getLessonId(), c.getContentType(), c.getContentJson()));
    }

    private List<LessonDto> buildLessonDtos(List<Lesson> lessons, UUID userId, boolean unitLocked) {
        if (lessons.isEmpty()) return List.of();

        List<UUID> ids = lessons.stream().map(Lesson::getId).toList();
        List<LessonProgress> progresses = progressRepo.findByUserIdAndLessonIdIn(userId, ids);
        Map<UUID, LessonProgress> progressMap = progresses.stream()
                .collect(Collectors.toMap(LessonProgress::getLessonId, p -> p));

        List<LessonDto> result = new ArrayList<>();
        boolean prevCompleted = true;

        for (Lesson l : lessons) {
            LessonProgress p = progressMap.get(l.getId());
            boolean completed = p != null && "completed".equals(p.getStatus());
            boolean locked = unitLocked || (!prevCompleted && result.size() > 0);
            Integer score = p != null ? p.getScore() : null;

            result.add(new LessonDto(l.getId(), l.getTitle(), l.getLessonType(),
                    l.getDurationMinutes(), l.getSortOrder(), completed, locked, score));
            prevCompleted = completed;
        }
        return result;
    }
}
