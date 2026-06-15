package com.example.demotech.classroom.service;

import com.example.demotech.base.repository.UserRepository;
import com.example.demotech.classroom.domain.Assignment;
import com.example.demotech.classroom.domain.Classroom;
import com.example.demotech.classroom.domain.ClassroomStudent;
import com.example.demotech.classroom.dto.*;
import com.example.demotech.classroom.repository.AssignmentRepository;

import com.example.demotech.classroom.repository.ClassroomRepository;
import com.example.demotech.classroom.repository.ClassroomStudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
public class ClassroomService {

    private static final String INVITE_CODE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int INVITE_CODE_LENGTH = 6;

    private final ClassroomRepository classroomRepo;
    private final ClassroomStudentRepository studentRepo;
    private final AssignmentRepository assignmentRepo;
    private final UserRepository userRepo;

    public ClassroomService(ClassroomRepository classroomRepo,
                            ClassroomStudentRepository studentRepo,
                            AssignmentRepository assignmentRepo,
                            UserRepository userRepo) {
        this.classroomRepo = classroomRepo;
        this.studentRepo = studentRepo;
        this.assignmentRepo = assignmentRepo;
        this.userRepo = userRepo;
    }

    @Transactional
    public ClassroomDto createClassroom(UUID teacherId, CreateClassroomRequest request) {
        String inviteCode = generateUniqueInviteCode();
        Classroom classroom = new Classroom();
        classroom.setTeacherId(teacherId);
        classroom.setName(request.name());
        classroom.setDescription(request.description());
        classroom.setInviteCode(inviteCode);
        classroom.setIsActive(true);
        classroomRepo.save(classroom);

        return toDto(classroom, 0);
    }

    public List<ClassroomDto> getTeacherClassrooms(UUID teacherId) {
        return classroomRepo.findByTeacherIdAndVoidedFalse(teacherId).stream()
                .map(c -> {
                    int count = studentRepo.findByClassroomIdAndVoidedFalse(c.getId()).size();
                    return toDto(c, count);
                })
                .toList();
    }

    @Transactional
    public ClassroomDto joinClassroom(UUID studentId, String inviteCode) {
        Classroom classroom = classroomRepo.findByInviteCodeAndVoidedFalse(inviteCode)
                .orElseThrow(() -> new RuntimeException("Classroom not found with invite code: " + inviteCode));

        // Check if already joined
        List<ClassroomStudent> existing = studentRepo.findByClassroomIdAndVoidedFalse(classroom.getId());
        boolean alreadyJoined = existing.stream().anyMatch(s -> s.getUserId().equals(studentId));
        if (!alreadyJoined) {
            ClassroomStudent cs = new ClassroomStudent();
            cs.setClassroomId(classroom.getId());
            cs.setUserId(studentId);
            studentRepo.save(cs);
        }

        int count = studentRepo.findByClassroomIdAndVoidedFalse(classroom.getId()).size();
        return toDto(classroom, count);
    }

    public List<StudentDto> getStudents(UUID classroomId) {
        return studentRepo.findByClassroomIdAndVoidedFalse(classroomId).stream()
                .map(cs -> userRepo.findById(cs.getUserId()).orElse(null))
                .filter(u -> u != null)
                .map(u -> new StudentDto(u.getId(), u.getName(), u.getEmail(), u.getUsername()))
                .toList();
    }

    @Transactional
    public AssignmentDto createAssignment(UUID classroomId, CreateAssignmentRequest request) {
        UUID lessonId = UUID.fromString(request.lessonId());
        LocalDateTime deadline = request.deadline() != null && !request.deadline().isBlank()
                ? LocalDateTime.parse(request.deadline()) : null;

        Assignment assignment = new Assignment();
        assignment.setClassroomId(classroomId);
        assignment.setLessonId(lessonId);
        assignment.setDeadline(deadline);
        assignment.setNote(request.note());
        assignmentRepo.save(assignment);

        return new AssignmentDto(
                assignment.getId(),
                assignment.getLessonId(),
                null, null, null, null,
                deadline != null ? deadline.toString() : null,
                "todo", null, 0
        );
    }

    private ClassroomDto toDto(Classroom c, int studentCount) {
        return new ClassroomDto(c.getId(), c.getName(), c.getInviteCode(), studentCount, c.getCreateDate());
    }

    private String generateUniqueInviteCode() {
        Random random = new Random();
        String code;
        do {
            StringBuilder sb = new StringBuilder(INVITE_CODE_LENGTH);
            for (int i = 0; i < INVITE_CODE_LENGTH; i++) {
                sb.append(INVITE_CODE_CHARS.charAt(random.nextInt(INVITE_CODE_CHARS.length())));
            }
            code = sb.toString();
        } while (classroomRepo.existsByInviteCode(code));
        return code;
    }
}
