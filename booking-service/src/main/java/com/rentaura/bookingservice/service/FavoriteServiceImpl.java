package com.rentaura.bookingservice.service;

import com.rentaura.bookingservice.model.Favorite;

import com.rentaura.bookingservice.repo.FavoriteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteServiceImpl implements FavoriteService {

    private final FavoriteRepository favoriteRepository;

    @Override
    public Favorite addFavorite(String userEmail, Long roomId) {

        boolean exists =
                favoriteRepository.existsByUserEmailAndRoomId(
                        userEmail,
                        roomId
                );

        if (exists) {
            throw new RuntimeException("Already favorite");
        }

        Favorite favorite = Favorite.builder()
                .userEmail(userEmail)
                .roomId(roomId)
                .build();

        return favoriteRepository.save(favorite);
    }

    @Override
    public void removeFavorite(String userEmail, Long roomId) {

        favoriteRepository.deleteByUserEmailAndRoomId(
                userEmail,
                roomId
        );
    }

    @Override
    public List<Favorite> getUserFavorites(String userEmail) {

        return favoriteRepository.findByUserEmail(userEmail);
    }

    @Override
    public boolean isFavorite(String userEmail, Long roomId) {

        return favoriteRepository
                .existsByUserEmailAndRoomId(
                        userEmail,
                        roomId
                );
    }
}