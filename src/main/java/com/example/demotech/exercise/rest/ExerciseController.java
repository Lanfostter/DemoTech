package com.example.demotech.exercise.rest;

import com.example.demotech.base.domain.User;
import com.example.demotech.base.dto.ApiResponse;
import com.example.demotech.base.repository.UserRepository;
import com.example.demotech.exercise.domain.Exercise;
import com.example.demotech.exercise.dto.CreateExerciseRequest;
import com.example.demotech.exercise.dto.ExerciseDto;
import com.example.demotech.exercise.dto.SubmitAnswerRequest;
import com.example.demotech.exercise.dto.SubmissionResultDto;
import com.example.demotech.exercise.repository.ExerciseRepository;
import com.example.demotech.exercise.service.ExerciseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/exercises")
public class ExerciseController {

    private final ExerciseService exerciseService;
    private final ExerciseRepository exerciseRepo;
    private final UserRepository userRepo;

    public ExerciseController(ExerciseService exerciseService,
                              ExerciseRepository exerciseRepo,
                              UserRepository userRepo) {
        this.exerciseService = exerciseService;
        this.exerciseRepo = exerciseRepo;
        this.userRepo = userRepo;
    }

    @GetMapping("/lesson/{lessonId}")
    public ResponseEntity<ApiResponse<List<ExerciseDto>>> getByLesson(@PathVariable UUID lessonId) {
        return ResponseEntity.ok(ApiResponse.success("OK", exerciseService.getByLessonId(lessonId)));
    }

    @PostMapping("/{exerciseId}/submit")
    public ResponseEntity<ApiResponse<SubmissionResultDto>> submit(
            @PathVariable UUID exerciseId,
            @RequestBody SubmitAnswerRequest request) {
        User user = currentUser();
        SubmissionResultDto result = exerciseService.submit(user.getId(), exerciseId, request.answer());
        return ResponseEntity.ok(ApiResponse.success("OK", result));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ExerciseDto>> create(@RequestBody CreateExerciseRequest req) {
        Exercise e = new Exercise();
        e.setLessonId(req.getLessonId());
        e.setExerciseType(req.getExerciseType());
        e.setSortOrder(req.getSortOrder());
        e.setTotalPoints(req.getTotalPoints() > 0 ? req.getTotalPoints() : 10);
        e.setQuestionJson(req.getQuestionJson());
        e.setCorrectAnswerJson(req.getCorrectAnswerJson());
        e.setExplanation(req.getExplanation());
        e.setDifficulty(req.getDifficulty() > 0 ? req.getDifficulty() : 3);
        exerciseRepo.save(e);
        ExerciseDto dto = new ExerciseDto(e.getId(), e.getExerciseType(), e.getSortOrder(),
                e.getTotalPoints(), e.getQuestionJson(), String.valueOf(e.getDifficulty()));
        return ResponseEntity.ok(ApiResponse.success("Created", dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ExerciseDto>> update(
            @PathVariable UUID id, @RequestBody CreateExerciseRequest req) {
        Exercise e = exerciseRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Exercise not found"));
        if (req.getExerciseType() != null) e.setExerciseType(req.getExerciseType());
        if (req.getQuestionJson() != null) e.setQuestionJson(req.getQuestionJson());
        if (req.getCorrectAnswerJson() != null) e.setCorrectAnswerJson(req.getCorrectAnswerJson());
        if (req.getExplanation() != null) e.setExplanation(req.getExplanation());
        if (req.getSortOrder() > 0) e.setSortOrder(req.getSortOrder());
        if (req.getTotalPoints() > 0) e.setTotalPoints(req.getTotalPoints());
        if (req.getDifficulty() > 0) e.setDifficulty(req.getDifficulty());
        exerciseRepo.save(e);
        ExerciseDto dto = new ExerciseDto(e.getId(), e.getExerciseType(), e.getSortOrder(),
                e.getTotalPoints(), e.getQuestionJson(), String.valueOf(e.getDifficulty()));
        return ResponseEntity.ok(ApiResponse.success("Updated", dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> delete(@PathVariable UUID id) {
        Exercise e = exerciseRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Exercise not found"));
        e.setVoided(true);
        exerciseRepo.save(e);
        return ResponseEntity.ok(ApiResponse.success("Deleted", null));
    }

    private User currentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }
}
