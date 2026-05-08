package com.rentaura.bookingservice.controller;

import com.rentaura.bookingservice.dto.BookingRequest;
import com.rentaura.bookingservice.dto.BookingResponse;
import com.rentaura.bookingservice.model.Booking;
import com.rentaura.bookingservice.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    // CREATE BOOKING
    @PostMapping
    public ResponseEntity<Booking> createBooking(
            Authentication auth,
            @RequestBody BookingRequest req) {

        if (auth == null || req == null || req.getRoomId() == null) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(
                bookingService.createBooking(req.getRoomId(), auth.getName(), req.getStartDate(), req.getEndDate())
        );
    }

    // USER BOOKINGS
    @GetMapping("/user")
    public ResponseEntity<List<Booking>> getUserBookings(Authentication auth) {

        if (auth == null) {
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok(
                bookingService.getUserBookings(auth.getName())
        );
    }

    // OWNER BOOKINGS
    @GetMapping("/owner")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<List<BookingResponse>> getOwnerBookings(Authentication auth) {
        return ResponseEntity.ok(
                bookingService.getOwnerBookings(auth.getName())
        );
    }

    // UPDATE STATUS
    @PutMapping("/{id}/status")
    public ResponseEntity<Booking> updateStatus(
            @PathVariable Long id,
            @RequestParam String status,
            Authentication auth) {

        return ResponseEntity.ok(
                bookingService.updateStatus(id, status, auth.getName())
        );
    }

    // CHECK BOOKING
    @GetMapping("/check")
    public ResponseEntity<Boolean> hasBooking(
            Authentication auth,
            @RequestParam Long roomId) {

        if (auth == null) {
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok(
                bookingService.hasBooking(auth.getName(), roomId)
        );
    }
}