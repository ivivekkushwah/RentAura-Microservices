package com.rentaura.authservice.service;

import com.rentaura.authservice.dto.*;
import com.rentaura.authservice.model.Role;
import com.rentaura.authservice.model.User;
import com.rentaura.authservice.repo.UserRepo;
import com.rentaura.authservice.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepo userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public String register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return "User already exists";
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        userRepository.save(user);

        return "User registered successfully";
    }

    @Override
    public String login(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials")
                );

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return jwtUtil.generateToken(user);
    }

    @Override
    public Object getAllOwners() {
        return userRepository.findByRole(Role.valueOf("OWNER"));
    }

    @Override
    public User updateProfile(
            String email,
            UpdateProfileRequest request
    ) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(
                        () -> new RuntimeException("User not found")
                );

        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setCity(request.getCity());
        user.setAvatar(request.getAvatar());
        user.setBio(request.getBio());
        user.setPreferences(request.getPreferences());
        user.setLookingForRoommate(
                request.isLookingForRoommate()
        );

        return userRepository.save(user);
    }

    @Override
    public Map<String, Object> getCurrentUser(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> response = new HashMap<>();

        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("phone", user.getPhone() != null ? user.getPhone() : "");
        response.put("city", user.getCity() != null ? user.getCity() : "");
        response.put("bio", user.getBio() != null ? user.getBio() : "");
        response.put("avatar", user.getAvatar() != null ? user.getAvatar() : "");
        response.put("role", user.getRole());

        return response;
    }

    @Override
    public void updateSettings(String email, UpdateSettingsRequest dto) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (dto.getDarkMode() != null) {
            user.setDarkMode(dto.getDarkMode());
        }

        if (dto.getEmailNotifications() != null) {
            user.setEmailNotifications(dto.getEmailNotifications());
        }

        if (dto.getPushNotifications() != null) {
            user.setPushNotifications(dto.getPushNotifications());
        }

        if (dto.getRoommateSuggestions() != null) {
            user.setRoommateSuggestions(dto.getRoommateSuggestions());
        }

        if (dto.getProfileVisibility() != null) {
            user.setProfileVisibility(dto.getProfileVisibility());
        }

        if (dto.getTwoFactorAuth() != null) {
            user.setTwoFactorAuth(dto.getTwoFactorAuth());
        }

        // PASSWORD UPDATE
        if (
                dto.getCurrentPassword() != null &&
                        dto.getNewPassword() != null &&
                        !dto.getNewPassword().isBlank()
        ) {

            if (!passwordEncoder.matches(
                    dto.getCurrentPassword(),
                    user.getPassword()
            )) {
                throw new RuntimeException("Current password is incorrect");
            }

            user.setPassword(
                    passwordEncoder.encode(dto.getNewPassword())
            );
        }

        userRepository.save(user);
    }

    @Override
    public UserSettingsResponse getSettings(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return UserSettingsResponse.builder()
                .darkMode(user.getDarkMode())
                .emailNotifications(user.getEmailNotifications())
                .pushNotifications(user.getPushNotifications())
                .roommateSuggestions(user.getRoommateSuggestions())
                .profileVisibility(user.getProfileVisibility())
                .twoFactorAuth(user.getTwoFactorAuth())
                .build();
    }

    @Override
    public void updateOwnerSettings(
            String email,
            UpdateOwnerSettingsRequest dto
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (dto.getBookingNotifications() != null) {
            user.setBookingNotifications(
                    dto.getBookingNotifications()
            );
        }

        if (dto.getMaintenanceAlerts() != null) {
            user.setMaintenanceAlerts(
                    dto.getMaintenanceAlerts()
            );
        }

        if (dto.getMarketingEmails() != null) {
            user.setMarketingEmails(
                    dto.getMarketingEmails()
            );
        }

        if (dto.getInstantBooking() != null) {
            user.setInstantBooking(
                    dto.getInstantBooking()
            );
        }

        if (dto.getAutoApproveTenants() != null) {
            user.setAutoApproveTenants(
                    dto.getAutoApproveTenants()
            );
        }

        if (dto.getShowContactPublicly() != null) {
            user.setShowContactPublicly(
                    dto.getShowContactPublicly()
            );
        }

        if (dto.getTwoFactorAuth() != null) {
            user.setTwoFactorAuth(
                    dto.getTwoFactorAuth()
            );
        }

        if (dto.getPropertyVisibility() != null) {
            user.setPropertyVisibility(
                    dto.getPropertyVisibility()
            );
        }

        if (dto.getPayoutMethod() != null) {
            user.setPayoutMethod(
                    dto.getPayoutMethod()
            );
        }

        // PASSWORD UPDATE

        if (
                dto.getCurrentPassword() != null &&
                        dto.getNewPassword() != null &&
                        !dto.getNewPassword().isBlank()
        ) {

            if (
                    !passwordEncoder.matches(
                            dto.getCurrentPassword(),
                            user.getPassword()
                    )
            ) {
                throw new RuntimeException(
                        "Current password is incorrect"
                );
            }

            user.setPassword(
                    passwordEncoder.encode(
                            dto.getNewPassword()
                    )
            );
        }

        userRepository.save(user);
    }

    @Override
    public OwnerSettingsResponse getOwnerSettings(
            String email
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return OwnerSettingsResponse.builder()
                .bookingNotifications(
                        user.getBookingNotifications()
                )
                .maintenanceAlerts(
                        user.getMaintenanceAlerts()
                )
                .marketingEmails(
                        user.getMarketingEmails()
                )
                .instantBooking(
                        user.getInstantBooking()
                )
                .autoApproveTenants(
                        user.getAutoApproveTenants()
                )
                .showContactPublicly(
                        user.getShowContactPublicly()
                )
                .twoFactorAuth(
                        user.getTwoFactorAuth()
                )
                .propertyVisibility(
                        user.getPropertyVisibility() != null
                                ? user.getPropertyVisibility()
                                : "public"
                )
                .payoutMethod(
                        user.getPayoutMethod() != null
                                ? user.getPayoutMethod()
                                : "bank"
                )
                .build();
    }
}