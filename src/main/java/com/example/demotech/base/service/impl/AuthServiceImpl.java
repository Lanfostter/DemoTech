package com.example.demotech.base.service.impl;

import com.example.demotech.base.domain.Role;
import com.example.demotech.base.domain.User;
import com.example.demotech.base.dto.ApiResponse;
import com.example.demotech.base.dto.LoginDto;
import com.example.demotech.base.dto.RegisterRequest;
import com.example.demotech.base.dto.UserInfoResponse;
import com.example.demotech.base.helper.Enum;
import com.example.demotech.base.repository.RoleRepository;
import com.example.demotech.base.repository.UserRepository;
import com.example.demotech.base.service.AuthService;
import com.example.demotech.base.service.JWTService;
import com.example.demotech.base.service.MailService;
import com.example.demotech.base.service.RedisService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {
    private final AuthenticationManager authenticationManager;
    private final JWTService jwtUtils;
    private final UserRepository userRepo;
    private final RoleRepository roleRepo;
    private final RedisService redisService;
    private final MailService mailService;

    public AuthServiceImpl(AuthenticationManager authenticationManager, JWTService jwtUtils,
                           UserRepository userRepo, RoleRepository roleRepo,
                           RedisService redisService, MailService mailService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
        this.redisService = redisService;
        this.mailService = mailService;
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
                    .map(GrantedAuthority::getAuthority).toList();

            UserInfoResponse userInfo = new UserInfoResponse(userDetails.getUsername(), null, roles, jwtAccessToken, jwtRefreshToken);
            return ResponseEntity.ok()
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtAccessToken)
                    .body(ApiResponse.success("Login successful", userInfo));
        } catch (Exception e) {
            return ResponseEntity.ok().body(ApiResponse.custom("Invalid username or password", null, HttpStatus.FORBIDDEN));
        }
    }

    @Override
    public ResponseEntity<ApiResponse<?>> refresh(String refreshToken) {
        try {
            String username = jwtUtils.extractUserName(refreshToken);
            UserDetails userDetails = org.springframework.security.core.userdetails.User
                    .withUsername(username).password("").authorities(new ArrayList<>()).build();
            if (!jwtUtils.isTokenValid(refreshToken, userDetails)) {
                return ResponseEntity.ok().body(ApiResponse.error("Invalid refresh token"));
            }
            String newAccessToken = jwtUtils.generateAccessToken(userDetails);
            String newRefreshToken = jwtUtils.generateRefreshToken(userDetails);
            return ResponseEntity.ok(ApiResponse.success("Success", Map.of(
                    "accessToken", newAccessToken, "refreshToken", newRefreshToken)));
        } catch (Exception e) {
            return ResponseEntity.ok().body(ApiResponse.error("Invalid refresh token"));
        }
    }

    @Override
    public ResponseEntity<ApiResponse<?>> register(RegisterRequest request) {
        if (userRepo.existsByUsername(request.getUsername())) {
            return ResponseEntity.ok().body(ApiResponse.custom("Tên đăng nhập đã tồn tại", null, HttpStatus.CONFLICT));
        }
        if (userRepo.existsByEmail(request.getEmail())) {
            return ResponseEntity.ok().body(ApiResponse.custom("Email đã được sử dụng", null, HttpStatus.CONFLICT));
        }
        Role userRole = roleRepo.findByName(Enum.ROLE.USER)
                .orElseThrow(() -> new RuntimeException("Role USER not found"));
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setPassword(new BCryptPasswordEncoder().encode(request.getPassword()));
        user.setRoles(Set.of(userRole));
        userRepo.save(user);
        return ResponseEntity.ok(ApiResponse.success("Đăng ký thành công", null));
    }

    @Override
    public ResponseEntity<ApiResponse<?>> forgotPassword(String email) {
        String msg = "Email đặt lại mật khẩu đã được gửi (nếu email tồn tại)";
        userRepo.findByEmail(email).ifPresent(user -> {
            String token = UUID.randomUUID().toString();
            redisService.setValueWithExpiry("pwd_reset:" + token, user.getUsername(), 900);
            try {
                mailService.sendPasswordResetEmail(user.getEmail(), user.getName(), token);
            } catch (Exception ignored) {}
        });
        return ResponseEntity.ok(ApiResponse.success(msg, null));
    }

    @Override
    public ResponseEntity<ApiResponse<?>> resetPassword(String token, String newPassword) {
        String username = redisService.getValue("pwd_reset:" + token);
        if (username == null) {
            return ResponseEntity.ok().body(ApiResponse.custom("Token không hợp lệ hoặc đã hết hạn", null, HttpStatus.BAD_REQUEST));
        }
        userRepo.findByUsername(username).ifPresent(user -> {
            user.setPassword(new BCryptPasswordEncoder().encode(newPassword));
            userRepo.save(user);
            redisService.deleteKey("pwd_reset:" + token);
        });
        return ResponseEntity.ok(ApiResponse.success("Đặt lại mật khẩu thành công", null));
    }
}
