package com.example.demotech.base.service;

import com.example.demotech.base.dto.LoginDto;
import com.example.demotech.base.dto.ResponseObject;
import org.springframework.http.ResponseEntity;

public interface AuthService {
    ResponseEntity<?> login(LoginDto loginDto);
}
