package com.rentaura.propertyservice.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private static final String TOKEN_COOKIE = "token";

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        try {

            if (!HttpMethod.OPTIONS.matches(request.getMethod())) {

                String token = extractToken(request);

                if (token != null && jwtUtil.validateToken(token)) {

                    if (SecurityContextHolder.getContext().getAuthentication() == null) {

                        String email = jwtUtil.extractEmail(token);
                        String role = jwtUtil.extractRole(token);

                        log.info("JWT parsed → Email: {}, Role: {}", email, role);

                        // ✅ FIX: Proper authority
                        List<SimpleGrantedAuthority> authorities = List.of(
                                new SimpleGrantedAuthority("ROLE_" + role)
                        );

                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(
                                        email,
                                        null,
                                        authorities
                                );

                        authentication.setDetails(
                                new WebAuthenticationDetailsSource().buildDetails(request)
                        );

                        // 🔥 CRITICAL LINE
                        SecurityContextHolder.getContext().setAuthentication(authentication);

                        // ✅ Proper debug
                        System.out.println("✅ AUTH SET: " + authentication);
                    }
                } else {
                    System.out.println("❌ TOKEN INVALID OR NULL");
                }
            }

            filterChain.doFilter(request, response);

        } catch (Exception e) {
            log.error("JWT processing error: {}", e.getMessage());
            throw e; // 🔥 IMPORTANT: don't silently continue
        }
    }

    private String extractToken(HttpServletRequest request) {

        String authHeader = request.getHeader("Authorization");
        System.out.println("🔥 PROPERTY SERVICE HEADER: " + authHeader);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }

        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (TOKEN_COOKIE.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }

        return null;
    }
}