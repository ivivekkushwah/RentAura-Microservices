package com.rentaura.bookingservice.dto;

import com.rentaura.bookingservice.model.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponse {

    private Long id;

    private Long roomId;

    private String userEmail;

    private String ownerEmail; // 🔥 for chat + owner dashboard

    private Integer amount; // 🔥 fixed booking price

    private LocalDate startDate;
    private LocalDate endDate;

    private BookingStatus status;

    private LocalDateTime createdAt;
}