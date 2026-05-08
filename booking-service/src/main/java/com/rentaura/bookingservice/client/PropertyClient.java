package com.rentaura.bookingservice.client;

import com.rentaura.bookingservice.config.FeignConfig;
import com.rentaura.bookingservice.dto.PropertyResponse;
import com.rentaura.bookingservice.dto.RoomResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "property-service", configuration = FeignConfig.class)
public interface PropertyClient {

    @GetMapping("/rooms/{id}")
    RoomResponse getRoomById(@PathVariable Long id);

    @GetMapping("/properties/{id}/owner")
    String getOwnerEmail(@PathVariable Long id);

    @PutMapping("/rooms/{id}/status")
    void updateRoomStatus(
            @PathVariable Long id,
            @RequestParam String status
    );
}