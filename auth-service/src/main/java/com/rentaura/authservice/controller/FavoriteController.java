package com.rentaura.authservice.controller;

import com.rentaura.authservice.service.FavoriteService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService service;

    @PostMapping("/{propertyId}")
    public ResponseEntity<?> addFavorite(
            @PathVariable Long propertyId,
            HttpServletRequest request) {

        String email = (String) request.getAttribute("userEmail");

        service.addFavorite(email, propertyId);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<?> getFavorites(HttpServletRequest request) {

        String email = (String) request.getAttribute("userEmail");

        return ResponseEntity.ok(service.getFavorites(email));
    }

    @DeleteMapping("/{propertyId}")
    public ResponseEntity<?> removeFavorite(
            @PathVariable Long propertyId,
            HttpServletRequest request) {

        String email = (String) request.getAttribute("userEmail");

        service.removeFavorite(email, propertyId);
        return ResponseEntity.ok().build();
    }
}