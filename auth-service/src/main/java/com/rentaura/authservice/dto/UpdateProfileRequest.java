package com.rentaura.authservice.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {

    private String name;

    private String phone;

    private String city;

    private String avatar;

    private String bio;

    private String preferences;

    private boolean lookingForRoommate;
}