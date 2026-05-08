package com.rentaura.maintenanceservice.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import java.security.Key;

@Component
public class JwtUtil {

    private final String SECRET_KEY = "mysecretkeymysecretkeymysecretkey123456";

    private Key signingKey;

    // 🔥 initialize once
    @PostConstruct
    public void init() {
        this.signingKey = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    // ✅ central claims extraction
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // ✅ extract email
    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    // ✅ extract role
    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }
}