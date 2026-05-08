package com.rentaura.authservice.repo;

import com.rentaura.authservice.model.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    List<Favorite> findByUserEmail(String userEmail);

    Optional<Favorite> findByUserEmailAndPropertyId(String userEmail, Long propertyId);

    void deleteByUserEmailAndPropertyId(String userEmail, Long propertyId);
}