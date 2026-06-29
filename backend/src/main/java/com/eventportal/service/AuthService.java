package com.eventportal.service;

import com.eventportal.dto.AuthResponse;
import com.eventportal.dto.LoginRequest;
import com.eventportal.dto.RegisterRequest;
import com.eventportal.entity.User;
import com.eventportal.repository.UserRepository;
import com.eventportal.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("ROLE_USER") // Default role is USER
                .build();

        userRepository.save(user);

        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("role", user.getRole());
        extraClaims.put("name", user.getName());
        extraClaims.put("userId", user.getId());

        String jwtToken = jwtService.generateToken(user.getEmail(), extraClaims);

        return AuthResponse.builder()
                .token(jwtToken)
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .phoneNumber(user.getPhoneNumber())
                .collegeName(user.getCollegeName())
                .department(user.getDepartment())
                .year(user.getYear())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
    try {
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
        )
    );
} catch (Exception e) {
    e.printStackTrace();
    throw new RuntimeException(e.getMessage());
}

    User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("role", user.getRole());
        extraClaims.put("name", user.getName());
        extraClaims.put("userId", user.getId());

        String jwtToken = jwtService.generateToken(user.getEmail(), extraClaims);

        return AuthResponse.builder()
                .token(jwtToken)
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .phoneNumber(user.getPhoneNumber())
                .collegeName(user.getCollegeName())
                .department(user.getDepartment())
                .year(user.getYear())
                .build();
    }
}
