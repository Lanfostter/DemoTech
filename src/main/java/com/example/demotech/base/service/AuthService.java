package com.example.demotech.base.service;

import com.example.demotech.base.dto.ApiResponse;
import com.example.demotech.base.dto.LoginDto;
import com.example.demotech.base.dto.ResponseObject;
import com.example.demotech.base.dto.UserInfoResponse;
import org.springframework.http.ResponseEntity;

public interface AuthService {
    ResponseEntity<ApiResponse<UserInfoResponse>> login(LoginDto loginDto);
    ResponseEntity<ApiResponse<?>> refresh(String refreshToken);
}
