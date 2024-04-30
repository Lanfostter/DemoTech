package com.example.demotech.base.rest;

import com.example.demotech.base.dto.LoginDto;
import com.example.demotech.base.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/oauth/token")
public class RestLoginController {
    private final AuthService authService;

    public RestLoginController(AuthService service) {
        this.authService = service;
    }

    @PostMapping()
    public ResponseEntity<?> login(@RequestBody LoginDto login) {
        return authService.login(login);
    }
}
