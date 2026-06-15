package com.example.demotech.vocabulary.rest;

import com.example.demotech.base.domain.User;
import com.example.demotech.base.dto.ApiResponse;
import com.example.demotech.base.repository.UserRepository;
import com.example.demotech.vocabulary.dto.*;
import com.example.demotech.vocabulary.service.VocabularyService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/vocabulary")
public class VocabularyController {

    private final VocabularyService vocabService;
    private final UserRepository userRepo;

    public VocabularyController(VocabularyService vocabService, UserRepository userRepo) {
        this.vocabService = vocabService;
        this.userRepo = userRepo;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<VocabularyDto>>> getVocabulary(
            @RequestParam(defaultValue = "false") boolean dueToday) {
        User user = currentUser();
        List<VocabularyDto> list = vocabService.getVocabulary(user.getId(), dueToday);
        return ResponseEntity.ok(ApiResponse.success("OK", list));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<VocabularyDto>> addVocabulary(
            @RequestBody AddVocabularyRequest request) {
        User user = currentUser();
        VocabularyDto dto = vocabService.addVocabulary(user.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("OK", dto));
    }

    @PostMapping("/{id}/review")
    public ResponseEntity<ApiResponse<ReviewResultDto>> review(
            @PathVariable UUID id,
            @RequestBody ReviewRequest request) {
        User user = currentUser();
        ReviewResultDto result = vocabService.review(user.getId(), id, request.result());
        return ResponseEntity.ok(ApiResponse.success("OK", result));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<VocabularyStatsDto>> getStats() {
        User user = currentUser();
        VocabularyStatsDto stats = vocabService.getStats(user.getId());
        return ResponseEntity.ok(ApiResponse.success("OK", stats));
    }

    private User currentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }
}
