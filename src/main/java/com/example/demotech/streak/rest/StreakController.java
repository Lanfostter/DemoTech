package com.example.demotech.streak.rest;

import com.example.demotech.base.domain.User;
import com.example.demotech.base.dto.ApiResponse;
import com.example.demotech.base.repository.UserRepository;
import com.example.demotech.streak.dto.StreakResponse;
import com.example.demotech.streak.service.StreakService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/streak")
public class StreakController {

    private final StreakService streakService;
    private final UserRepository userRepo;

    public StreakController(StreakService streakService, UserRepository userRepo) {
        this.streakService = streakService;
        this.userRepo = userRepo;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<StreakResponse>> getStreak() {
        User user = currentUser();
        StreakResponse response = streakService.getStreak(user.getId());
        return ResponseEntity.ok(ApiResponse.success("OK", response));
    }

    private User currentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }
}
