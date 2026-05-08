package com.rentaura.authservice.dto;

import lombok.Data;

@Data
public class UpdateSettingsRequest {

    private Boolean darkMode;

    private Boolean emailNotifications;

    private Boolean pushNotifications;

    private Boolean roommateSuggestions;

    private String profileVisibility;

    private Boolean twoFactorAuth;

    private String currentPassword;

    private String newPassword;
}