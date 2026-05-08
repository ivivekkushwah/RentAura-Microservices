package com.rentaura.bookingservice.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

public enum BookingStatus {
    PENDING,
    APPROVED,
    REJECTED
}