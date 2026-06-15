package com.example.demotech.classroom.rest;

import com.example.demotech.base.domain.User;
import com.example.demotech.base.dto.ApiResponse;
import com.example.demotech.base.repository.UserRepository;
import com.example.demotech.classroom.dto.*;
import com.example.demotech.classroom.service.ClassroomService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/classrooms")
public class ClassroomController {

    private final ClassroomService classroomService;
    private final UserRepository userRepo;

    public ClassroomController(ClassroomService classroomService, UserRepository userRepo) {
        this.classroomService = classroomService;
        this.userRepo = userRepo;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ClassroomDto>> createClassroom(
            @RequestBody CreateClassroomRequest request) {
        User user = currentUser();
        ClassroomDto dto = classroomService.createClassroom(user.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("OK", dto));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ClassroomDto>>> getMyClassrooms() {
        User user = currentUser();
        List<ClassroomDto> list = classroomService.getTeacherClassrooms(user.getId());
        return ResponseEntity.ok(ApiResponse.success("OK", list));
    }

    @PostMapping("/join")
    public ResponseEntity<ApiResponse<ClassroomDto>> joinClassroom(
            @RequestBody JoinClassroomRequest request) {
        User user = currentUser();
        ClassroomDto dto = classroomService.joinClassroom(user.getId(), request.inviteCode());
        return ResponseEntity.ok(ApiResponse.success("OK", dto));
    }

    @GetMapping("/{id}/students")
    public ResponseEntity<ApiResponse<List<StudentDto>>> getStudents(@PathVariable UUID id) {
        List<StudentDto> students = classroomService.getStudents(id);
        return ResponseEntity.ok(ApiResponse.success("OK", students));
    }

    @PostMapping("/{classroomId}/assignments")
    public ResponseEntity<ApiResponse<AssignmentDto>> createAssignment(
            @PathVariable UUID classroomId,
            @RequestBody CreateAssignmentRequest request) {
        AssignmentDto dto = classroomService.createAssignment(classroomId, request);
        return ResponseEntity.ok(ApiResponse.success("OK", dto));
    }

    private User currentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }
}
