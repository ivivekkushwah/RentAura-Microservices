package com.rentaura.authservice.dto;

import lombok.Data;

@Data
public class UpdateOwnerSettingsRequest {

    private Boolean bookingNotifications;

    private Boolean maintenanceAlerts;

    private Boolean marketingEmails;

    private Boolean instantBooking;

    private Boolean autoApproveTenants;

    private Boolean showContactPublicly;

    private Boolean twoFactorAuth;

    private String propertyVisibility;

    private String payoutMethod;

    private String currentPassword;

    private String newPassword;
}