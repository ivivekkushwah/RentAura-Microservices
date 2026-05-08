package com.rentaura.bookingservice.dto;

import lombok.Data;

@Data
public class PropertyResponse {

    private Long id;
    private String title;
    private String location;
    private Integer price;
}