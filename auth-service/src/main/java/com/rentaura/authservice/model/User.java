package com.rentaura.authservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔹 Basic
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    private LocalDateTime createdAt;

    // ================= PROFILE =================

    private String phone;

    private String city;

    // Cloudinary image
    private String avatar;

    @Column(length = 1000)
    private String bio;

    // roommate preferences
    private String preferences;

    private boolean lookingForRoommate = false;

    // ================= TIMESTAMP =================

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    private Boolean darkMode = true;

    private Boolean emailNotifications = true;

    private Boolean pushNotifications = false;

    private Boolean roommateSuggestions = true;

    private String profileVisibility = "public";

    private Boolean twoFactorAuth = false;


    // ================= OWNER SETTINGS =================

    private Boolean bookingNotifications = true;

    private Boolean maintenanceAlerts = true;

    private Boolean marketingEmails = false;

    private Boolean instantBooking = true;

    private Boolean autoApproveTenants = false;

    private Boolean showContactPublicly = true;

    private String propertyVisibility = "public";

    private String payoutMethod = "bank";

// ================= OWNER PROFILE =================

    private String companyName;

    private Boolean verified = false;

    private Double rating = 0.0;
}