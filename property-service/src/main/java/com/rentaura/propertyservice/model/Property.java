package com.rentaura.propertyservice.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔹 Basic Info
    private String title;
    private String description;

    // 🔹 Location
    private String location;
    private String address;

    // 🔹 Owner
    private String ownerEmail;

    // 🔹 Property Type
    private String propertyType; // PG / Hostel / Apartment

    // 🔹 Features
    private Boolean instantBook = false;
    private Boolean selfCheckIn = false;

    // 🔹 Amenities
    @ElementCollection
    @CollectionTable(name = "property_amenities", joinColumns = @JoinColumn(name = "property_id"))
    @Column(name = "amenity")
    private List<String> amenities = new ArrayList<>();

    // 🔹 Images
    @ElementCollection
    @CollectionTable(name = "property_images", joinColumns = @JoinColumn(name = "property_id"))
    @Column(name = "image_url")
    private List<String> images = new ArrayList<>();

    // 🔹 Availability (optional high-level)
    private String availableFrom;
    private String availableTo;

    // 🔥 Derived info (optional but useful)
    private Integer totalRooms;

    // 🔥 TIMESTAMPS
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
