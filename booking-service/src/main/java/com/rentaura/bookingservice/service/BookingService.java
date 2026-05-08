package com.rentaura.bookingservice.service;

import com.rentaura.bookingservice.dto.BookingRequest;
import com.rentaura.bookingservice.dto.BookingResponse;
import com.rentaura.bookingservice.model.Booking;

import java.time.LocalDate;
import java.util.List;

public interface BookingService {

   

    List<Booking> getUserBookings(String email);

    List<BookingResponse> getOwnerBookings(String ownerEmail);

    boolean hasBooking(String userEmail, Long propertyId);

    Booking updateStatus(Long id, String status, String ownerEmail);

    Booking createBooking(Long roomId, String userEmail,
                          String startDate, String endDate);
}