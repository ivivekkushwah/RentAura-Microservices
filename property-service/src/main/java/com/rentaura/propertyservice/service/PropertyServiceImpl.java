package com.rentaura.propertyservice.service;

import com.rentaura.propertyservice.model.Property;
import com.rentaura.propertyservice.repo.PropertyRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PropertyServiceImpl implements PropertyService {

    private final PropertyRepo repo;

    // ✅ CREATE
    @Override
    public Property addProperty(Property property) {
        return repo.save(property);
    }

    // ✅ GET BY ID
    @Override
    public Property getPropertyById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));
    }

    // ✅ GET ALL
    @Override
    public List<Property> getAllProperty() {
        return repo.findAll();
    }

    // ✅ GET BY LOCATION (optimized)
    @Override
    public List<Property> getPropertyByLocation(String location) {
        return repo.findByLocationIgnoreCase(location);
    }

    // ✅ GET OWNER PROPERTIES
    @Override
    public List<Property> getPropertiesByOwner(String ownerEmail) {
        return repo.findByOwnerEmail(ownerEmail);
    }

    // ✅ UPDATE
    @Override
    public Property updateProperty(Property property) {

        // Ensure property exists
        if (!repo.existsById(property.getId())) {
            throw new RuntimeException("Property not found");
        }

        return repo.save(property);
    }

    // ✅ DELETE
    @Override
    public void deleteProperty(Long id) {

        if (!repo.existsById(id)) {
            throw new RuntimeException("Property not found");
        }

        repo.deleteById(id);
    }

    // ✅ GET OWNER EMAIL (for other services)
    @Override
    public String getOwnerEmail(Long id) {
        return repo.findById(id)
                .map(Property::getOwnerEmail)
                .orElseThrow(() -> new RuntimeException("Property not found"));
    }

    @Override
    public List<Property> getOwnerProperties(String email) {
        return repo.findByOwnerEmail(email);
    }
}