package com.rentaura.bookingservice.repo;

import com.rentaura.bookingservice.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserEmail(String email);

    List<Booking> findByOwnerEmail(String ownerEmail);


    boolean existsByUserEmailAndRoomId(String userEmail, Long roomId);

    @Query("""
SELECT COUNT(b) > 0 FROM Booking b
WHERE b.roomId = :roomId
AND b.status = 'APPROVED'
AND (
    b.startDate <= :endDate AND b.endDate >= :startDate
)
""")
    boolean existsOverlappingBooking(Long roomId,
                                     LocalDate startDate,
                                     LocalDate endDate);
}
