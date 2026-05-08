package com.rentaura.bookingservice.controller;


import com.rentaura.bookingservice.model.Favorite;
import com.rentaura.bookingservice.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    // ✅ Add favorite
    @PostMapping("/{roomId}")
    public Favorite addFavorite(
            @PathVariable Long roomId,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();

        return favoriteService.addFavorite(userEmail, roomId);
    }

    // ✅ Remove favorite
    @DeleteMapping("/{roomId}")
    public void removeFavorite(
            @PathVariable Long roomId,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();

        favoriteService.removeFavorite(userEmail, roomId);
    }

    // ✅ Get logged-in user favorites
    @GetMapping
    public List<Favorite> getUserFavorites(
            Authentication authentication
    ) {
        String userEmail = authentication.getName();

        return favoriteService.getUserFavorites(userEmail);
    }

    // ✅ Check favorite
    @GetMapping("/check/{roomId}")
    public boolean isFavorite(
            @PathVariable Long roomId,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();

        return favoriteService.isFavorite(userEmail, roomId);
    }
}