package com.rentaura.bookingservice.service;

import com.rentaura.bookingservice.client.PropertyClient;
import com.rentaura.bookingservice.dto.BookingResponse;
import com.rentaura.bookingservice.dto.RoomResponse;
import com.rentaura.bookingservice.model.*;
import com.rentaura.bookingservice.repo.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final PropertyClient propertyClient;

    // ✅ CREATE BOOKING (FIXED)
    @Override
    public Booking createBooking(Long roomId, String userEmail,
                                 String startDateStr, String endDateStr) {

        // 🔥 Validate input
        if (startDateStr == null || endDateStr == null) {
            throw new RuntimeException("Start and End date required");
        }

        // ✅ Convert String → LocalDate
        LocalDate startDate = LocalDate.parse(startDateStr);
        LocalDate endDate = LocalDate.parse(endDateStr);

        // 🔥 Validate date range
        if (endDate.isBefore(startDate)) {
            throw new RuntimeException("Invalid date range");
        }

        // 🔥 Fetch room
        RoomResponse room = propertyClient.getRoomById(roomId);

        // 🔥 Check overlap
        boolean isBooked = bookingRepository.existsOverlappingBooking(
                roomId, startDate, endDate
        );

        if (isBooked) {
            throw new RuntimeException("Room already booked for selected dates");
        }

        // 🔥 Get owner
        String ownerEmail = propertyClient.getOwnerEmail(room.getPropertyId());

        // 🔥 Calculate duration
        long days = ChronoUnit.DAYS.between(startDate, endDate);
        long months = (long) Math.ceil(days / 30.0);

        if (months <= 0) months = 1;

        // 🔥 Calculate amount
        int amount = (int) (months * room.getPrice());

        Booking booking = Booking.builder()
                .roomId(roomId)
                .userEmail(userEmail)
                .ownerEmail(ownerEmail)
                .startDate(startDate)   // ✅ now correct type
                .endDate(endDate)
                .createdAt(LocalDate.now().atStartOfDay())
                .status(BookingStatus.PENDING)
                .amount(amount)
                .build();

        return bookingRepository.save(booking);
    }

    // ✅ UPDATE STATUS (same but clean)
    @Override
    public Booking updateStatus(Long id, String status, String ownerEmail) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getOwnerEmail().equals(ownerEmail)) {
            throw new RuntimeException("Unauthorized");
        }

        BookingStatus newStatus = BookingStatus.valueOf(status);
        booking.setStatus(newStatus);

        // 🔥 Sync room status
        if (newStatus == BookingStatus.APPROVED) {
            propertyClient.updateRoomStatus(booking.getRoomId(), "OCCUPIED");
        } else if (newStatus == BookingStatus.REJECTED) {
            propertyClient.updateRoomStatus(booking.getRoomId(), "AVAILABLE");
        }

        return bookingRepository.save(booking);
    }

    // ✅ USER BOOKINGS
    @Override
    public List<Booking> getUserBookings(String email) {
        return bookingRepository.findByUserEmail(email);
    }

    // ✅ OWNER BOOKINGS
    @Override
    public List<BookingResponse> getOwnerBookings(String ownerEmail) {

        return bookingRepository.findByOwnerEmail(ownerEmail)
                .stream()
                .map(b -> new BookingResponse(
                        b.getId(),
                        b.getRoomId(),
                        b.getUserEmail(),
                        b.getOwnerEmail(),
                        b.getAmount(),          // ✅ correct order
                        b.getStartDate(),
                        b.getEndDate(),
                        b.getStatus(),
                        b.getCreatedAt()
                ))
                .toList();
    }

    @Override
    public boolean hasBooking(String userEmail, Long propertyId) {
        return false;
    }

}