package com.example.demotech.module.rest;

import com.example.demotech.base.domain.User;
import com.example.demotech.base.dto.ApiResponse;
import com.example.demotech.base.repository.UserRepository;
import com.example.demotech.module.domain.LearningModule;
import com.example.demotech.module.domain.Lesson;
import com.example.demotech.module.domain.LessonContent;
import com.example.demotech.module.domain.Unit;
import com.example.demotech.module.dto.*;
import com.example.demotech.module.repository.LearningModuleRepository;
import com.example.demotech.module.repository.LessonContentRepository;
import com.example.demotech.module.repository.LessonRepository;
import com.example.demotech.module.repository.UnitRepository;
import com.example.demotech.module.service.LearningModuleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/modules")
public class ModuleController {

    private final LearningModuleService moduleService;
    private final LearningModuleRepository moduleRepo;
    private final UnitRepository unitRepo;
    private final LessonRepository lessonRepo;
    private final LessonContentRepository contentRepo;
    private final UserRepository userRepo;

    public ModuleController(LearningModuleService moduleService,
                            LearningModuleRepository moduleRepo,
                            UnitRepository unitRepo,
                            LessonRepository lessonRepo,
                            LessonContentRepository contentRepo,
                            UserRepository userRepo) {
        this.moduleService = moduleService;
        this.moduleRepo = moduleRepo;
        this.unitRepo = unitRepo;
        this.lessonRepo = lessonRepo;
        this.contentRepo = contentRepo;
        this.userRepo = userRepo;
    }

    // ── Modules ─────────────────────────────────────────────────────

    @GetMapping
    public ResponseEntity<ApiResponse<List<ModuleDto>>> getModules() {
        List<ModuleDto> modules = moduleService.getModules(currentUser().getId());
        return ResponseEntity.ok(ApiResponse.success("OK", modules));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ModuleDto>> createModule(@RequestBody CreateModuleRequest req) {
        LearningModule m = new LearningModule();
        m.setType(req.getType() != null ? req.getType() : "custom");
        m.setTitle(req.getTitle());
        m.setDescription(req.getDescription());
        m.setTargetGrades(req.getTargetGrades() != null ? req.getTargetGrades() : "");
        m.setColor(req.getColor() != null ? req.getColor() : "#4361EE");
        m.setIsPublished(true);
        m.setSortOrder(req.getSortOrder() != null ? req.getSortOrder() : 99);
        moduleRepo.save(m);
        return ResponseEntity.ok(ApiResponse.success("Created", toModuleDto(m)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ModuleDto>> updateModule(
            @PathVariable UUID id, @RequestBody CreateModuleRequest req) {
        LearningModule m = moduleRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Module not found"));
        if (req.getTitle() != null) m.setTitle(req.getTitle());
        if (req.getDescription() != null) m.setDescription(req.getDescription());
        if (req.getType() != null) m.setType(req.getType());
        if (req.getColor() != null) m.setColor(req.getColor());
        if (req.getTargetGrades() != null) m.setTargetGrades(req.getTargetGrades());
        if (req.getSortOrder() != null) m.setSortOrder(req.getSortOrder());
        moduleRepo.save(m);
        return ResponseEntity.ok(ApiResponse.success("Updated", toModuleDto(m)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> deleteModule(@PathVariable UUID id) {
        moduleRepo.findById(id).ifPresent(m -> { m.setVoided(true); moduleRepo.save(m); });
        return ResponseEntity.ok(ApiResponse.success("Deleted", null));
    }

    // ── Units ────────────────────────────────────────────────────────

    @GetMapping("/{moduleId}/units")
    public ResponseEntity<ApiResponse<List<UnitDto>>> getUnits(@PathVariable UUID moduleId) {
        List<UnitDto> units = moduleService.getUnits(moduleId, currentUser().getId());
        return ResponseEntity.ok(ApiResponse.success("OK", units));
    }

    @PostMapping("/{moduleId}/units")
    public ResponseEntity<ApiResponse<UnitSimpleDto>> createUnit(
            @PathVariable UUID moduleId, @RequestBody CreateUnitRequest req) {
        if (!moduleRepo.existsById(moduleId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Module not found"));
        }
        Unit u = new Unit();
        u.setModuleId(moduleId);
        u.setTitle(req.getTitle());
        u.setSortOrder(req.getSortOrder() != null ? req.getSortOrder() : 99);
        u.setUnlockThreshold(req.getUnlockThreshold() != null ? req.getUnlockThreshold() : 0);
        unitRepo.save(u);
        return ResponseEntity.ok(ApiResponse.success("Created", new UnitSimpleDto(u.getId(), u.getTitle(), u.getSortOrder(), u.getUnlockThreshold())));
    }

    @PutMapping("/units/{unitId}")
    public ResponseEntity<ApiResponse<UnitSimpleDto>> updateUnit(
            @PathVariable UUID unitId, @RequestBody CreateUnitRequest req) {
        Unit u = unitRepo.findById(unitId)
                .orElseThrow(() -> new RuntimeException("Unit not found"));
        if (req.getTitle() != null) u.setTitle(req.getTitle());
        if (req.getSortOrder() != null) u.setSortOrder(req.getSortOrder());
        if (req.getUnlockThreshold() != null) u.setUnlockThreshold(req.getUnlockThreshold());
        unitRepo.save(u);
        return ResponseEntity.ok(ApiResponse.success("Updated", new UnitSimpleDto(u.getId(), u.getTitle(), u.getSortOrder(), u.getUnlockThreshold())));
    }

    @DeleteMapping("/units/{unitId}")
    public ResponseEntity<ApiResponse<?>> deleteUnit(@PathVariable UUID unitId) {
        unitRepo.findById(unitId).ifPresent(u -> { u.setVoided(true); unitRepo.save(u); });
        return ResponseEntity.ok(ApiResponse.success("Deleted", null));
    }

    // ── Lessons ──────────────────────────────────────────────────────

    @GetMapping("/units/{unitId}/lessons")
    public ResponseEntity<ApiResponse<List<LessonSimpleDto>>> getLessons(@PathVariable UUID unitId) {
        List<LessonSimpleDto> lessons = lessonRepo
                .findByUnitIdAndVoidedFalseOrderBySortOrderAsc(unitId)
                .stream()
                .map(l -> new LessonSimpleDto(l.getId(), l.getTitle(), l.getLessonType(),
                        l.getDurationMinutes(), l.getSortOrder(), l.getDifficulty()))
                .toList();
        return ResponseEntity.ok(ApiResponse.success("OK", lessons));
    }

    @PostMapping("/units/{unitId}/lessons")
    public ResponseEntity<ApiResponse<LessonSimpleDto>> createLesson(
            @PathVariable UUID unitId, @RequestBody CreateLessonRequest req) {
        if (!unitRepo.existsById(unitId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Unit not found"));
        }
        Lesson l = new Lesson();
        l.setUnitId(unitId);
        l.setTitle(req.getTitle());
        l.setLessonType(req.getLessonType() != null ? req.getLessonType() : "grammar");
        l.setDurationMinutes(req.getDurationMinutes() != null ? req.getDurationMinutes() : 15);
        l.setSortOrder(req.getSortOrder() != null ? req.getSortOrder() : 99);
        l.setDifficulty(req.getDifficulty() != null ? req.getDifficulty() : 3);
        lessonRepo.save(l);

        if (req.getContentJson() != null && !req.getContentJson().isBlank()) {
            LessonContent lc = new LessonContent();
            lc.setLessonId(l.getId());
            lc.setContentType(l.getLessonType());
            lc.setContentJson(req.getContentJson());
            contentRepo.save(lc);
        }

        return ResponseEntity.ok(ApiResponse.success("Created",
                new LessonSimpleDto(l.getId(), l.getTitle(), l.getLessonType(),
                        l.getDurationMinutes(), l.getSortOrder(), l.getDifficulty())));
    }

    @PutMapping("/units/lessons/{lessonId}")
    public ResponseEntity<ApiResponse<LessonSimpleDto>> updateLesson(
            @PathVariable UUID lessonId, @RequestBody CreateLessonRequest req) {
        Lesson l = lessonRepo.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));
        if (req.getTitle() != null) l.setTitle(req.getTitle());
        if (req.getLessonType() != null) l.setLessonType(req.getLessonType());
        if (req.getDurationMinutes() != null) l.setDurationMinutes(req.getDurationMinutes());
        if (req.getSortOrder() != null) l.setSortOrder(req.getSortOrder());
        if (req.getDifficulty() != null) l.setDifficulty(req.getDifficulty());
        lessonRepo.save(l);

        if (req.getContentJson() != null && !req.getContentJson().isBlank()) {
            LessonContent lc = contentRepo.findByLessonId(lessonId)
                    .orElseGet(() -> { LessonContent c = new LessonContent(); c.setLessonId(lessonId); return c; });
            lc.setContentType(l.getLessonType());
            lc.setContentJson(req.getContentJson());
            contentRepo.save(lc);
        }

        return ResponseEntity.ok(ApiResponse.success("Updated",
                new LessonSimpleDto(l.getId(), l.getTitle(), l.getLessonType(),
                        l.getDurationMinutes(), l.getSortOrder(), l.getDifficulty())));
    }

    @DeleteMapping("/units/lessons/{lessonId}")
    public ResponseEntity<ApiResponse<?>> deleteLesson(@PathVariable UUID lessonId) {
        lessonRepo.findById(lessonId).ifPresent(l -> { l.setVoided(true); lessonRepo.save(l); });
        return ResponseEntity.ok(ApiResponse.success("Deleted", null));
    }

    @GetMapping("/lessons/{lessonId}/content")
    public ResponseEntity<ApiResponse<LessonContentDto>> getLessonContent(@PathVariable UUID lessonId) {
        return moduleService.getLessonContent(lessonId)
                .map(c -> ResponseEntity.ok(ApiResponse.success("OK", c)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Content not found")));
    }

    // ── Helpers ──────────────────────────────────────────────────────

    private ModuleDto toModuleDto(LearningModule m) {
        long unitCount = unitRepo.findByModuleIdAndVoidedFalseOrderBySortOrderAsc(m.getId()).size();
        return new ModuleDto(m.getId(), m.getType(), m.getTitle(), m.getDescription(),
                m.getTargetGrades(), (int) unitCount, 0, 0,
                m.getColor() != null ? m.getColor() : "#4361EE");
    }

    private User currentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }
}
