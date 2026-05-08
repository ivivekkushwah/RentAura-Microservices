package com.rentaura.bookingservice.service;

import com.rentaura.bookingservice.model.Favorite;

import java.util.List;

public interface FavoriteService {

    Favorite addFavorite(String userEmail, Long roomId);

    void removeFavorite(String userEmail, Long roomId);

    List<Favorite> getUserFavorites(String userEmail);

    boolean isFavorite(String userEmail, Long roomId);
}