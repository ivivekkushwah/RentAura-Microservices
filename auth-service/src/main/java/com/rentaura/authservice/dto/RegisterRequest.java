package com.rentaura.authservice.dto;

import com.rentaura.authservice.model.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private Role role;
}