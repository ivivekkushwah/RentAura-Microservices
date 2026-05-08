package com.rentaura.authservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_email", "property_id"})
)
public class Favorite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_email", nullable = false)
    private String userEmail;

    @Column(name = "property_id", nullable = false)
    private Long propertyId;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public Favorite(String userEmail, Long propertyId) {
        this.userEmail = userEmail;
        this.propertyId = propertyId;
        this.createdAt = LocalDateTime.now();
    }
}