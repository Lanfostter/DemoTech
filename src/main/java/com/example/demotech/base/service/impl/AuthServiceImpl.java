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
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;

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

            String jwtToken = jwtUtils.generateToken(userDetails);

            List<String> roles = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .toList();

            UserInfoResponse userInfo = new UserInfoResponse(null, userDetails.getUsername(), null, roles, jwtToken);

            return ResponseEntity.ok()
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken)
                    .body(ApiResponse.success("Login successful", userInfo));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK.value()).body(
                    ApiResponse.custom("Invalid username or password", null, HttpStatus.FORBIDDEN)
            );
        }
    }


}
