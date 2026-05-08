package com.rentaura.propertyservice.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import java.security.Key;

@Component
public class JwtUtil {

    private Key signingKey;

    // 🔥 Initialize key once
    @PostConstruct
    public void init() {
        String SECRET_KEY = "mysecretkeymysecretkeymysecretkey123456";
        this.signingKey = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    // ✅ Central claim extraction
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // ✅ Extract email
    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    // ✅ Extract role
    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(signingKey) // ✅ FIXED
                    .build()
                    .parseClaimsJws(token);

            return true;

        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            System.out.println("JWT expired");
        } catch (io.jsonwebtoken.MalformedJwtException e) {
            System.out.println("Invalid JWT format");
        } catch (io.jsonwebtoken.security.SignatureException e) {
            System.out.println("Invalid signature");
        } catch (Exception e) {
            System.out.println("JWT validation error");
        }

        return false;
    }
}