package com.rentaura.maintenanceservice.controller;

import com.rentaura.maintenanceservice.dto.UpdateStatusRequest;
import com.rentaura.maintenanceservice.model.MaintenanceRequest;
import com.rentaura.maintenanceservice.service.MaintenanceService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/maintenance")
@RequiredArgsConstructor
public class MaintenanceController {

    private final MaintenanceService service;

    // ✅ CREATE (USER)
    @PostMapping
    public ResponseEntity<MaintenanceRequest> createRequest(
            HttpServletRequest request,
            @RequestBody MaintenanceRequest req) {

        String userEmail = (String) request.getAttribute("userEmail");

        if (userEmail == null) {
            return ResponseEntity.status(401).build();
        }

        req.setUserEmail(userEmail);

        MaintenanceRequest created = service.create(req);
        return ResponseEntity.status(201).body(created);
    }

    // ✅ OWNER VIEW
    @GetMapping("/owner")
    public ResponseEntity<List<MaintenanceRequest>> getOwnerRequests(
            HttpServletRequest request) {

        String email = (String) request.getAttribute("userEmail");

        if (email == null) {
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok(service.getOwnerRequests(email));
    }

    // ✅ USER VIEW
    @GetMapping("/user")
    public ResponseEntity<List<MaintenanceRequest>> getUserRequests(
            HttpServletRequest request) {

        String email = (String) request.getAttribute("userEmail");

        if (email == null) {
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok(service.getUserRequests(email));
    }

    // ✅ UPDATE STATUS (FIXED)
    @PatchMapping("/{id}")
    public ResponseEntity<MaintenanceRequest> updateStatus(
            @PathVariable Long id,
            @RequestBody UpdateStatusRequest request) {

        if (request.getStatus() == null || request.getStatus().isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        MaintenanceRequest updated = service.updateStatus(id, request.getStatus());
        return ResponseEntity.ok(updated);
    }
}
