package com.rentaura.authservice.security;

import com.rentaura.authservice.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private Key signingKey;

    // 🔥 Initialize key once
    @PostConstruct
    public void init() {
        String SECRET_KEY = "mysecretkeymysecretkeymysecretkey123456";
        this.signingKey = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    // ✅ Generate Token
    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("role", user.getRole().name())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1 hour
                .signWith(signingKey)
                .compact();
    }

    // ✅ Extract All Claims
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // ✅ Extract Email
    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    // ✅ Extract Role
    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }

    // ✅ Extract Expiration
    public Date extractExpiration(String token) {
        return extractAllClaims(token).getExpiration();
    }

    // ✅ Check Expiry
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // ✅ Validate Token
    public boolean validateToken(String token, String email) {
        try {
            final String extractedEmail = extractEmail(token);
            return extractedEmail.equals(email) && !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    public String extractEmailFromRequest(
            HttpServletRequest request
    ) {

        String token = null;

        // ✅ FIRST: Try Authorization header
        String authHeader =
                request.getHeader("Authorization");

        if (
                authHeader != null &&
                        authHeader.startsWith("Bearer ")
        ) {

            token = authHeader.substring(7);
        }

        // ✅ SECOND: Try cookies
        if (token == null) {

            if (request.getCookies() != null) {

                for (var cookie : request.getCookies()) {

                    if ("token".equals(cookie.getName())) {

                        token = cookie.getValue();
                        break;
                    }
                }
            }
        }

        // ❌ No token found
        if (token == null || token.isBlank()) {

            throw new RuntimeException(
                    "Invalid token"
            );
        }

        // ✅ Extract email
        return extractEmail(token);
    }
}