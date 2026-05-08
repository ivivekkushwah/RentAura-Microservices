package com.rentaura.propertyservice.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"propertyId", "roomNumber"})
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // ✅ roomId

    private Long propertyId;

    @Column(nullable = false)
    private String roomNumber;

    @Column(nullable = false)
    private Double price;

    private Integer capacity;

    // ✅ ENUM instead of String
    @Enumerated(EnumType.STRING)
    private RoomStatus status;
    // 🔹 Room Images
    @ElementCollection
    @CollectionTable(name = "room_images", joinColumns = @JoinColumn(name = "room_id"))
    @Column(name = "image_url")
    private List<String> images = new ArrayList<>();

    // ✅ timestamps (good practice)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // 🔥 auto timestamps
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = RoomStatus.AVAILABLE;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}