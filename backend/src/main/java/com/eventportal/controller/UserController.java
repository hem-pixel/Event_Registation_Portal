package com.eventportal.controller;

import com.eventportal.dto.AuthResponse;
import com.eventportal.dto.UserProfileDto;
import com.eventportal.entity.User;
import com.eventportal.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PutMapping("/profile")
    public ResponseEntity<AuthResponse> updateProfile(@Valid @RequestBody UserProfileDto request) {
        User updatedUser = userService.updateProfile(request);
        
        AuthResponse response = AuthResponse.builder()
                .id(updatedUser.getId())
                .name(updatedUser.getName())
                .email(updatedUser.getEmail())
                .role(updatedUser.getRole())
                .phoneNumber(updatedUser.getPhoneNumber())
                .collegeName(updatedUser.getCollegeName())
                .department(updatedUser.getDepartment())
                .year(updatedUser.getYear())
                .build();
                
        return ResponseEntity.ok(response);
    }
}
