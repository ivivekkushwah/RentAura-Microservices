package com.rentaura.authservice.service;

import com.rentaura.authservice.dto.*;
import com.rentaura.authservice.model.User;
import com.rentaura.authservice.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public interface AuthService {

    String register(RegisterRequest request);

    String login(String email, String password);

    Object getAllOwners();

    User updateProfile(String email, UpdateProfileRequest request);

    Object getCurrentUser(String email);

    void updateSettings(String email, UpdateSettingsRequest dto);

    UserSettingsResponse getSettings(String email);

    void updateOwnerSettings(String email, UpdateOwnerSettingsRequest dto);

    Object getOwnerSettings(String email);
}
