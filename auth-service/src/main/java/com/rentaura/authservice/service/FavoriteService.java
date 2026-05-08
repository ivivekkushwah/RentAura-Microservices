package com.rentaura.authservice.service;

import java.util.List;

public interface FavoriteService {

    void addFavorite(String email, Long propertyId);

    List<Long> getFavorites(String email);

    void removeFavorite(String email, Long propertyId);
}