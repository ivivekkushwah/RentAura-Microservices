package com.rentaura.bookingservice.repo;

import com.rentaura.bookingservice.model.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import jakarta.transaction.Transactional;

import java.util.List;

public interface FavoriteRepository
        extends JpaRepository<Favorite, Long> {

    List<Favorite> findByUserEmail(
            String userEmail
    );

    boolean existsByUserEmailAndRoomId(
            String userEmail,
            Long roomId
    );

    @Transactional
    @Modifying
    void deleteByUserEmailAndRoomId(
            String userEmail,
            Long roomId
    );
}