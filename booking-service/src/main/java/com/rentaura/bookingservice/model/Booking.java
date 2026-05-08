package com.rentaura.bookingservice.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔥 NEW: room reference
    @Column(nullable = false)
    private Long roomId;

    // 👤 User who booked
    @Column(nullable = false)
    private String userEmail;

    // 🏠 Owner (for dashboard)
    @Column(nullable = false)
    private String ownerEmail;

    // 💰 Amount (copied from room at booking time)
    @Column(nullable = false)
    private Integer amount;

    // 📅 Booking date
    private LocalDate startDate;
    private LocalDate endDate;

    // 📊 Status
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status;

    // 🕒 Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // 🔥 Auto timestamps
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();

        if (this.status == null) {
            this.status = BookingStatus.PENDING;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}