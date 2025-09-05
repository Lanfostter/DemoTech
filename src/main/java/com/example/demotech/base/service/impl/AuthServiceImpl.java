package com.example.demotech.base.service.impl;

import com.example.demotech.base.dto.ApiResponse;
import com.example.demotech.base.dto.LoginDto;
import com.example.demotech.base.dto.UserInfoResponse;
import com.example.demotech.base.service.AuthService;
import com.example.demotech.base.service.JWTService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class AuthServiceImpl implements AuthService {
    private final AuthenticationManager authenticationManager;
    private final JWTService jwtUtils;

    public AuthServiceImpl(AuthenticationManager authenticationManager, JWTService jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
    }

    @Override
    public ResponseEntity<ApiResponse<UserInfoResponse>> login(LoginDto loginDto) {
        try {
            Authentication authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(loginDto.getUsername(), loginDto.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            String jwtAccessToken = jwtUtils.generateAccessToken(userDetails);
            String jwtRefreshToken = jwtUtils.generateRefreshToken(userDetails);

            List<String> roles = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .toList();

            UserInfoResponse userInfo = new UserInfoResponse(userDetails.getUsername(), null, roles, jwtAccessToken, jwtRefreshToken);

            return ResponseEntity.ok()
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtAccessToken)
                    .body(ApiResponse.success("Login successful", userInfo));

        } catch (Exception e) {
            return ResponseEntity.ok().body(
                    ApiResponse.custom("Invalid username or password", null, HttpStatus.FORBIDDEN)
            );
        }
    }

    @Override
    public ResponseEntity<ApiResponse<?>> refresh(String refreshToken) {
        try {
            String username = jwtUtils.extractUserName(refreshToken);
            UserDetails userDetails = User
                    .withUsername(username)
                    .password("")
                    .authorities(new ArrayList<>())
                    .build();

            if (!jwtUtils.isTokenValid(refreshToken, userDetails)) {
                return ResponseEntity.ok().body(ApiResponse.error("Invalid refresh token"));
            }

            String newAccessToken = jwtUtils.generateAccessToken(userDetails);
            String newRefreshToken = jwtUtils.generateRefreshToken(userDetails);

            return ResponseEntity.ok(ApiResponse.success("Success", Map.of(
                    "accessToken", newAccessToken,
                    "refreshToken", newRefreshToken
            )));
        } catch (Exception e) {
            return ResponseEntity.ok().body(ApiResponse.error("Invalid refresh token"));
        }
    }
}

