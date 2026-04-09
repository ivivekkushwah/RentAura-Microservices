package com.rentaura.authservice.repo;


import com.fasterxml.jackson.databind.introspect.AnnotationCollector;
import com.rentaura.authservice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepo  extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
}
