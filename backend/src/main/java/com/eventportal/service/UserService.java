package com.eventportal.service;

import com.eventportal.dto.UserProfileDto;
import com.eventportal.entity.User;
import com.eventportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User updateProfile(UserProfileDto request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPhoneNumber(request.getPhoneNumber());
        user.setCollegeName(request.getCollegeName());
        user.setDepartment(request.getDepartment());
        user.setYear(request.getYear());

        return userRepository.save(user);
    }
}
