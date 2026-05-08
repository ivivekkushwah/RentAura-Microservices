package com.rentaura.propertyservice.controller;

import com.rentaura.propertyservice.model.Property;
import com.rentaura.propertyservice.service.PropertyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/properties")
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService service;

    // 🔹 Utility method (DRY principle)
    private String getCurrentUserEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("Unauthorized");
        }

        return auth.getName();
    }

    // ✅ GET ALL (PUBLIC)
    @GetMapping
    public ResponseEntity<List<Property>> getAllProperty() {
        return ResponseEntity.ok(service.getAllProperty());
    }

    // ✅ GET BY ID (PUBLIC)
    @GetMapping("/{id}")
    public ResponseEntity<Property> getPropertyById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getPropertyById(id));
    }

    // ✅ GET BY LOCATION (PUBLIC)
    @GetMapping("/location/{location}")
    public ResponseEntity<List<Property>> getPropertyByLocation(@PathVariable String location) {
        return ResponseEntity.ok(service.getPropertyByLocation(location));
    }

    // ✅ GET OWNER PROPERTIES (OWNER ONLY - handled by SecurityConfig)
    @GetMapping("/owner")
    public ResponseEntity<List<Property>> getOwnerProperties() {
        String email = getCurrentUserEmail();
        return ResponseEntity.ok(service.getPropertiesByOwner(email));
    }

    // ✅ ADD PROPERTY (OWNER ONLY)
    @PostMapping
    public ResponseEntity<Property> addProperty(@RequestBody Property property) {

        String email = getCurrentUserEmail();
        property.setOwnerEmail(email);

        return ResponseEntity.ok(service.addProperty(property));
    }

    // ✅ UPDATE PROPERTY (OWNER ONLY)
    @PutMapping("/{id}")
    public ResponseEntity<Property> updateProperty(@PathVariable Long id,
                                                   @RequestBody Property updatedProperty) {

        String email = getCurrentUserEmail();

        Property existing = service.getPropertyById(id);

        // 🔒 Ownership check
        if (!existing.getOwnerEmail().equals(email)) {
            throw new RuntimeException("You can update only your own property");
        }

        // 🔥 Update allowed fields
        existing.setTitle(updatedProperty.getTitle());
        existing.setLocation(updatedProperty.getLocation());
        existing.setAddress(updatedProperty.getAddress());
        existing.setDescription(updatedProperty.getDescription());
        existing.setPropertyType(updatedProperty.getPropertyType());
        existing.setAmenities(updatedProperty.getAmenities());
        existing.setImages(updatedProperty.getImages());

        return ResponseEntity.ok(service.updateProperty(existing));
    }

    // ✅ DELETE PROPERTY (OWNER / ADMIN)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProperty(@PathVariable Long id) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ADMIN"));

        Property property = service.getPropertyById(id);

        if (isAdmin) {
            service.deleteProperty(id);
            return ResponseEntity.ok("Deleted by ADMIN");
        }

        if (property.getOwnerEmail().equals(email)) {
            service.deleteProperty(id);
            return ResponseEntity.ok("Deleted by OWNER");
        }

        throw new RuntimeException("Access denied");
    }

    // ✅ INTERNAL USE
    @GetMapping("/{id}/owner")
    public ResponseEntity<String> getOwnerEmail(@PathVariable Long id) {
        return ResponseEntity.ok(service.getOwnerEmail(id));
    }
}