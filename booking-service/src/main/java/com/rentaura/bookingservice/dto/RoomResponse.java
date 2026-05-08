package com.rentaura.bookingservice.dto;

import lombok.Data;

@Data
public class RoomResponse {
    private Long id;
    private Long propertyId;
    private Double price;
    private String status;
}
