package com.razorpay.integration.service;

import com.razorpay.integration.dto.AuthResponse;
import com.razorpay.integration.dto.LoginRequest;
import com.razorpay.integration.dto.RegisterRequest;
import com.razorpay.integration.dto.UserDto;
import com.razorpay.integration.exception.AppException;
import com.razorpay.integration.model.Role;
import com.razorpay.integration.model.User;
import com.razorpay.integration.repository.UserRepository;
import com.razorpay.integration.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException("Email address is already registered", HttpStatus.BAD_REQUEST);
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .countryCode(request.getCountryCode() != null ? request.getCountryCode() : "+91")
                .phone(request.getPhone())
                .role(Role.CUSTOMER)
                .build();

        user = userRepository.save(user);
        String token = tokenProvider.generateToken(user);

        return AuthResponse.builder()
                .user(UserDto.fromEntity(user))
                .token(token)
                .build();
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException("Invalid email or password", HttpStatus.UNAUTHORIZED));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AppException("Invalid email or password", HttpStatus.UNAUTHORIZED);
        }

        String token = tokenProvider.generateToken(user);

        return AuthResponse.builder()
                .user(UserDto.fromEntity(user))
                .token(token)
                .build();
    }

    @Transactional(readOnly = true)
    public UserDto getProfile(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));

        return UserDto.fromEntity(user);
    }
}
