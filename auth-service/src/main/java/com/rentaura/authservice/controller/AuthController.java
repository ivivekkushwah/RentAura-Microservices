package com.rentaura.authservice.controller;

import com.rentaura.authservice.model.User;
import com.rentaura.authservice.service.AuthService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@Data
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        return ResponseEntity.ok(authService.register(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {

        String email = request.get("email");
        String password = request.get("password");

        String token = authService.login(email, password);

        return ResponseEntity.ok(token);
    }

    @GetMapping("/test")
    public String test() {
        return "Secure API working!";
    }
}
