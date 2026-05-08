package com.rentaura.authservice.security;

import com.rentaura.authservice.model.User;
import com.rentaura.authservice.repo.UserRepo;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserRepo userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        // ✅ Allow preflight
        if (HttpMethod.OPTIONS.matches(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String token = getTokenFromCookies(request);

            if (token != null) {
                System.out.println("TOKEN RECEIVED: " + token);

                String email = jwtUtil.extractEmail(token);  // 🔥 focus here
                String role = jwtUtil.extractRole(token);

                System.out.println("EMAIL: " + email);
                System.out.println("ROLE: " + role);

                request.setAttribute("userEmail", email);
                request.setAttribute("userRole", role);
            }

        } catch (Exception e) {
            System.out.println("JWT ERROR: " + e.getClass().getName());
            System.out.println("JWT MESSAGE: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    // 🔥 HELPER METHOD
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