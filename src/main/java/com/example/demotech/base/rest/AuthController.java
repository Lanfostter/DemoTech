package com.example.demotech.base.rest;

import com.example.demotech.base.dto.ApiResponse;
import com.example.demotech.base.dto.LoginDto;
import com.example.demotech.base.dto.UserInfoResponse;
import com.example.demotech.base.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserInfoResponse>> login(@RequestBody LoginDto login) {
        return authService.login(login);
    }
}
