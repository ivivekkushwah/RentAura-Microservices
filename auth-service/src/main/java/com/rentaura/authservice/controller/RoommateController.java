package com.rentaura.authservice.controller;


import com.rentaura.authservice.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth/users/roommates")
@RequiredArgsConstructor
public class RoommateController {

    private final UserService service;

    // ✅ Toggle
    @PostMapping("/toggle")
    public ResponseEntity<?> toggle(HttpServletRequest request) {
        String email = (String) request.getAttribute("userEmail");

        return ResponseEntity.ok(service.toggleRoommate(email));
    }

    // ✅ Get all
    @GetMapping
    public ResponseEntity<?> getRoommates() {
        return ResponseEntity.ok(service.getRoommates());
    }
}