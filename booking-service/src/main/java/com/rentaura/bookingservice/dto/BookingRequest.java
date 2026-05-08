package com.rentaura.bookingservice.dto;

import lombok.Data;

@Data
public class BookingRequest {
    private Long roomId;
    private String startDate;
    private String endDate;
    private Integer amount; // ✅ added
}
