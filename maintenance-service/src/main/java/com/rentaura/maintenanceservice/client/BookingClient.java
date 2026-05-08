package com.rentaura.maintenanceservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "booking-service", url = "http://localhost:8083")
public interface BookingClient {

    @GetMapping("/bookings/check")
    boolean hasBooking(
            @RequestParam String userEmail,
            @RequestParam Long propertyId
    );
}