package com.rentaura.maintenanceservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String description;

    @Enumerated(EnumType.STRING)
    private Status status;
    private Long propertyId;
    private String userEmail;
    private String ownerEmail;
    private String issue;

    private LocalDateTime createdAt;

    // ✅ AUTO SET createdAt
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }


}
