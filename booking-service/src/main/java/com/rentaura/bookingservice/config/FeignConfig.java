package com.rentaura.bookingservice.config;

import feign.RequestInterceptor;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Configuration
public class FeignConfig {

    @Bean
    public RequestInterceptor requestInterceptor() {
        return requestTemplate -> {

            ServletRequestAttributes attrs =
                    (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

            if (attrs == null) return;

            HttpServletRequest request = attrs.getRequest();

            if (request.getCookies() == null) return;

            for (Cookie cookie : request.getCookies()) {
                if ("token".equals(cookie.getName())) {

                    String token = cookie.getValue();

                    System.out.println("FORWARDING TOKEN: " + token);

                    requestTemplate.header("Authorization", "Bearer " + token);
                }
            }
        };
    }
}