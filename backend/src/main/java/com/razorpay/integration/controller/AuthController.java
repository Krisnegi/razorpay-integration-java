package com.razorpay.integration.controller;

import com.razorpay.integration.dto.AuthResponse;
import com.razorpay.integration.dto.LoginRequest;
import com.razorpay.integration.dto.RegisterRequest;
import com.razorpay.integration.dto.UserDto;
import com.razorpay.integration.security.UserPrincipal;
import com.razorpay.integration.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getProfile(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        UserDto userDto = authService.getProfile(userPrincipal.getId());
        return ResponseEntity.ok(userDto);
    }
}
