package com.example.demotech.classroom.rest;

import com.example.demotech.base.domain.User;
import com.example.demotech.base.dto.ApiResponse;
import com.example.demotech.base.repository.UserRepository;
import com.example.demotech.classroom.dto.AssignmentDto;
import com.example.demotech.classroom.service.AssignmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    private final AssignmentService assignmentService;
    private final UserRepository userRepo;

    public AssignmentController(AssignmentService assignmentService, UserRepository userRepo) {
        this.assignmentService = assignmentService;
        this.userRepo = userRepo;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AssignmentDto>>> getMyAssignments() {
        User user = currentUser();
        List<AssignmentDto> assignments = assignmentService.getStudentAssignments(user.getId());
        return ResponseEntity.ok(ApiResponse.success("OK", assignments));
    }

    private User currentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }
}
