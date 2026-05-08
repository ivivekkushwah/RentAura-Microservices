package com.rentaura.authservice.service;

import com.rentaura.authservice.model.Favorite;
import com.rentaura.authservice.repo.FavoriteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteServiceImpl implements FavoriteService {

    private final FavoriteRepository repo;

    @Override
    public void addFavorite(String email, Long propertyId) {

        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("User email is required");
        }

        if (propertyId == null) {
            throw new IllegalArgumentException("Property ID is required");
        }

        // ✅ Prevent duplicate favorites
        boolean exists = repo
                .findByUserEmailAndPropertyId(email, propertyId)
                .isPresent();

        if (!exists) {
            repo.save(new Favorite(email, propertyId));
        }
    }

    @Override
    public List<Long> getFavorites(String email) {

        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("User email is required");
        }

        return repo.findByUserEmail(email)
                .stream()
                .map(Favorite::getPropertyId)
                .toList();
    }

    @Override
    public void removeFavorite(String email, Long propertyId) {

        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("User email is required");
        }

        if (propertyId == null) {
            throw new IllegalArgumentException("Property ID is required");
        }

        repo.deleteByUserEmailAndPropertyId(email, propertyId);
    }
}