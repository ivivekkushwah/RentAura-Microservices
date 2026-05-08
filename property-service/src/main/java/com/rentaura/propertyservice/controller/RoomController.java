package com.rentaura.propertyservice.controller;

import com.rentaura.propertyservice.model.Room;
import com.rentaura.propertyservice.service.RoomService;
import com.rentaura.propertyservice.service.PropertyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;
    private final PropertyService propertyService;

    // 🔹 Utility
    private String getCurrentUserEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("Unauthorized");
        }

        return auth.getName();
    }

    // ✅ GET ROOMS BY PROPERTY (PUBLIC)
    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<Room>> getRooms(@PathVariable Long propertyId) {
        return ResponseEntity.ok(roomService.getRoomsByProperty(propertyId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Room> getRoomById(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.getRoomById(id));
    }

    // ✅ CREATE ROOM (OWNER ONLY + OWNERSHIP CHECK)
    @PostMapping("/{propertyId}")
    public ResponseEntity<Room> createRoom(@PathVariable Long propertyId,
                                           @RequestBody Room room) {

        String email = getCurrentUserEmail();

        String ownerEmail = propertyService.getOwnerEmail(propertyId);

        if (!ownerEmail.equals(email)) {
            throw new RuntimeException("You can add rooms only to your property");
        }

        // 🔥 enforce propertyId from URL (secure)
        room.setPropertyId(propertyId);

        return ResponseEntity.ok(roomService.createRoom(room));
    }

    // ✅ UPDATE ROOM (OWNER ONLY)
    @PutMapping("/{id}")
    public ResponseEntity<Room> updateRoom(@PathVariable Long id,
                                           @RequestBody Room updatedRoom) {

        String email = getCurrentUserEmail();

        Room existing = roomService.getRoomById(id);

        String ownerEmail = propertyService.getOwnerEmail(existing.getPropertyId());

        if (!ownerEmail.equals(email)) {
            throw new RuntimeException("Access denied");
        }

        return ResponseEntity.ok(roomService.updateRoom(id, updatedRoom));
    }

    // ✅ UPDATE STATUS (BOOKING FLOW)
    @PutMapping("/{id}/status")
    public ResponseEntity<Room> updateRoomStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {
        System.out.println("🔥 HIT PROPERTY SERVICE CONTROLLER");
        return ResponseEntity.ok(roomService.updateStatus(id, status));
    }

    // ✅ DELETE ROOM (OWNER / ADMIN)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRoom(@PathVariable Long id) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ADMIN"));

        Room room = roomService.getRoomById(id);
        String ownerEmail = propertyService.getOwnerEmail(room.getPropertyId());

        if (isAdmin || ownerEmail.equals(email)) {
            roomService.deleteRoom(id);
            return ResponseEntity.ok("Room deleted successfully");
        }

        throw new RuntimeException("Access denied");
    }

    @GetMapping("/owner")
    public ResponseEntity<List<Room>> getOwnerRooms() {
        String email = getCurrentUserEmail();

        List<Room> rooms = roomService.getRoomsByOwner(email);

        return ResponseEntity.ok(rooms);
    }
}