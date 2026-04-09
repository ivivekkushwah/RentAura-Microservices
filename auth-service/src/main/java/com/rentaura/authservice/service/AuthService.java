package com.rentaura.authservice.service;

import com.rentaura.authservice.model.User;
import com.rentaura.authservice.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public interface AuthService {

    String register(User user);

    String login(String email, String password);
}
