package com.rentaura.authservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class UserSettingsResponse {

    private Boolean darkMode;

    private Boolean emailNotifications;

    private Boolean pushNotifications;

    private Boolean roommateSuggestions;

    private String profileVisibility;

    private Boolean twoFactorAuth;
}