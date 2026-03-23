package com.example.user_service.controller;


import com.example.user_service.dto.AuthResponse;
import com.example.user_service.dto.LoginRequest;
import com.example.user_service.dto.RegisterRequest;
import com.example.user_service.entity.User;
import com.example.user_service.security.JwtUtil;
import com.example.user_service.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/me")
    public User getMe(@RequestHeader("Authorization") String token) {
        String email = jwtUtil.extractEmail(token.substring(7));
        return authService.getMe(email);
    }

    @GetMapping("/users/{id}")
    public User getUserById(@PathVariable Long id) {
        return authService.getUserById(id);
    }
}