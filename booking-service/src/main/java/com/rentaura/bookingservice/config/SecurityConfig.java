package com.rentaura.bookingservice.config;

import com.rentaura.bookingservice.security.JwtFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf(AbstractHttpConfigurer::disable)

                .authorizeHttpRequests(auth -> auth

                        // ================= USER APIs =================

                        .requestMatchers(HttpMethod.POST, "/bookings")
                        .hasRole("USER")

                        .requestMatchers(HttpMethod.GET, "/bookings/user")
                        .hasRole("USER")

                        .requestMatchers(HttpMethod.GET, "/bookings/check")
                        .hasRole("USER")

                        // ================= FAVORITES =================

                        .requestMatchers(HttpMethod.GET, "/favorites/**")
                        .hasRole("USER")

                        .requestMatchers(HttpMethod.POST, "/favorites/**")
                        .hasRole("USER")

                        .requestMatchers(HttpMethod.DELETE, "/favorites/**")
                        .hasRole("USER")

                        // ================= OWNER APIs =================

                        .requestMatchers(HttpMethod.GET, "/bookings/owner")
                        .hasRole("OWNER")

                        .requestMatchers(HttpMethod.PUT, "/bookings/**")
                        .hasRole("OWNER")

                        // ================= ADMIN =================

                        .requestMatchers("/bookings/**")
                        .hasRole("ADMIN")

                        // 🔒 EVERYTHING ELSE
                        .anyRequest().authenticated()
                )

                .addFilterBefore(
                        jwtFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}