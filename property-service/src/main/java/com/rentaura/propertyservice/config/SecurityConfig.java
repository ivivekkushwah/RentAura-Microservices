package com.rentaura.propertyservice.config;

import com.rentaura.propertyservice.security.JwtFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod; // ✅ FIXED IMPORT
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

                        .requestMatchers(HttpMethod.POST, "/properties").hasRole("OWNER")
                        .requestMatchers(HttpMethod.PUT, "/properties/**").hasRole("OWNER")
                        .requestMatchers(HttpMethod.GET, "/properties/owner").hasRole("OWNER")

                        .requestMatchers(HttpMethod.POST, "/rooms").hasRole("OWNER")
                        .requestMatchers(HttpMethod.PUT, "/rooms/**").hasRole("OWNER")

                        .requestMatchers(HttpMethod.DELETE, "/properties/**")
                        .hasAnyRole("OWNER", "ADMIN")

                        .requestMatchers(HttpMethod.DELETE, "/rooms/**")
                        .hasAnyRole("OWNER", "ADMIN")

                        // 🔒 everything else
                        .anyRequest().authenticated()
                )

                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}