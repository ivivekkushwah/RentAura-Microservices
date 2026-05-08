package com.rentaura.maintenanceservice.service;

import com.rentaura.maintenanceservice.MaintenanceRepo;
import com.rentaura.maintenanceservice.client.BookingClient;
import com.rentaura.maintenanceservice.model.MaintenanceRequest;
import com.rentaura.maintenanceservice.model.Status;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class MaintenanceServiceImpl implements MaintenanceService {

    private final MaintenanceRepo repo;
    private final BookingClient bookingClient;

    @Override
    public MaintenanceRequest create(MaintenanceRequest req) {

        // 🔥 check if user has booking

        boolean hasBooking = bookingClient.hasBooking(
                req.getUserEmail(),
                req.getPropertyId()
        );

        if (!hasBooking) {
            throw new RuntimeException("You are not allowed to raise maintenance request for this property");
        }

        req.setStatus(Status.PENDING);
        return repo.save(req);
    }

    @Override
    public List<MaintenanceRequest> getOwnerRequests(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Owner email is required");
        }
        return repo.findByOwnerEmail(email);
    }

    @Override
    public List<MaintenanceRequest> getUserRequests(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("User email is required");
        }
        return repo.findByUserEmail(email);
    }

    @Override
    public MaintenanceRequest updateStatus(Long id, String status) {

        // ✅ 1. Validate ID
        MaintenanceRequest req = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Maintenance request not found"));

        // ✅ 2. Validate status (avoid crash)
        Status newStatus;
        try {
            newStatus = Status.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status value: " + status);
        }

        // ✅ 3. Optional: prevent unnecessary update
        if (req.getStatus() == newStatus) {
            return req;
        }

        // ✅ 4. Update
        req.setStatus(newStatus);
        return repo.save(req);
    }
}