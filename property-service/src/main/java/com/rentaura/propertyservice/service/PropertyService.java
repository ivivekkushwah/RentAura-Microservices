package com.rentaura.propertyservice.service;

import com.rentaura.propertyservice.model.Property;

import java.util.List;

public interface PropertyService {

    // ✅ Create
    Property addProperty(Property property);

    // ✅ Update
    Property updateProperty(Property property);

    // ✅ Delete
    void deleteProperty(Long id);

    // ✅ Get all
    List<Property> getAllProperty();

    // ✅ Get by ID
    Property getPropertyById(Long id);

    // ✅ Get by location
    List<Property> getPropertyByLocation(String location);

    // ✅ Get owner properties
    List<Property> getPropertiesByOwner(String email);

    // ✅ Get owner email (for inter-service use)
    String getOwnerEmail(Long id);

    List<Property> getOwnerProperties(String email);
}