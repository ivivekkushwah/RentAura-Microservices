package com.rentaura.maintenanceservice.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        try {
            // 🔥 GET TOKEN FROM COOKIE
            String token = getTokenFromCookies(request);

            if (token != null) {
                String email = jwtUtil.extractEmail(token);
                String role = jwtUtil.extractRole(token);

                request.setAttribute("userEmail", email);
                request.setAttribute("userRole", role);
            }

        } catch (Exception e) {
            // 🔥 DO NOT BLOCK — just log
            System.out.println("JWT ERROR: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    // 🔥 HELPER
    private String getTokenFromCookies(HttpServletRequest request) {
        if (request.getCookies() == null) return null;

        for (Cookie cookie : request.getCookies()) {
            if ("token".equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }
}