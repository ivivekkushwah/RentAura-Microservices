package com.rentaura.authservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class OwnerSettingsResponse {

    private Boolean bookingNotifications;

    private Boolean maintenanceAlerts;

    private Boolean marketingEmails;

    private Boolean instantBooking;

    private Boolean autoApproveTenants;

    private Boolean showContactPublicly;

    private Boolean twoFactorAuth;

    private String propertyVisibility;

    private String payoutMethod;
}