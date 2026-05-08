package com.rentaura.authservice.controller;

import com.rentaura.authservice.dto.RegisterRequest;
import com.rentaura.authservice.dto.UpdateOwnerSettingsRequest;
import com.rentaura.authservice.dto.UpdateProfileRequest;
import com.rentaura.authservice.dto.UpdateSettingsRequest;
import com.rentaura.authservice.model.User;
import com.rentaura.authservice.security.JwtUtil;
import com.rentaura.authservice.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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
    private final JwtUtil jwtUtil;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {

        String email = (String) request.getAttribute("userEmail");

        if (email == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        return ResponseEntity.ok(authService.getCurrentUser(email));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request,
                                   HttpServletResponse response) {

        String email = request.get("email");
        String password = request.get("password");

        String token = authService.login(email, password);

        // ✅ CREATE COOKIE
        Cookie cookie = new Cookie("token", token);
        cookie.setHttpOnly(true); // 🔥 prevent JS access
        cookie.setSecure(false);  // true in production (HTTPS)
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60); // 1 hour

        response.addCookie(cookie);

        // ❌ don't send token
        return ResponseEntity.ok(Map.of(
                "message", "Login successful"
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {

        Cookie cookie = new Cookie("token", null);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0); // delete

        response.addCookie(cookie);

        return ResponseEntity.ok(Map.of(
                "message", "Logged out successfully"
        ));
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(
            @RequestBody UpdateProfileRequest request,
            HttpServletRequest httpRequest
    ) {
        System.out.println(request.toString());
        String email =
                jwtUtil.extractEmailFromRequest(httpRequest);

        User updatedUser =
                authService.updateProfile(email, request);

        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/test")
    public String test() {
        return "Secure API working!";
    }

    @GetMapping("/owners")
    public ResponseEntity<?> getAllOwners() {
        return ResponseEntity.ok(authService.getAllOwners());
    }

    @GetMapping("/settings")
    public ResponseEntity<?> getSettings(HttpServletRequest request) {

        String email = (String) request.getAttribute("userEmail");

        if (email == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        return ResponseEntity.ok(authService.getSettings(email));
    }

    @PutMapping("/settings")
    public ResponseEntity<?> updateSettings(
            HttpServletRequest request,
            @RequestBody UpdateSettingsRequest dto
    ) {

        String email = (String) request.getAttribute("userEmail");

        if (email == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        authService.updateSettings(email, dto);

        return ResponseEntity.ok("Settings updated successfully");
    }

    @GetMapping("/owner/settings")
    public ResponseEntity<?> getOwnerSettings(
            HttpServletRequest request
    ) {

        String email =
                (String) request.getAttribute("userEmail");

        if (email == null) {
            return ResponseEntity
                    .status(401)
                    .body("Unauthorized");
        }

        return ResponseEntity.ok(
                authService.getOwnerSettings(email)
        );
    }

    @PutMapping("/owner/settings")
    public ResponseEntity<?> updateOwnerSettings(
            HttpServletRequest request,
            @RequestBody UpdateOwnerSettingsRequest dto
    ) {

        String email =
                (String) request.getAttribute("userEmail");

        if (email == null) {
            return ResponseEntity
                    .status(401)
                    .body("Unauthorized");
        }

        authService.updateOwnerSettings(email, dto);

        return ResponseEntity.ok(
                "Owner settings updated successfully"
        );
    }
}
