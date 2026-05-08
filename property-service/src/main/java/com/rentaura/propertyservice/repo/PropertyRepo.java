package com.rentaura.propertyservice.repo;

import com.rentaura.propertyservice.model.Property;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PropertyRepo extends JpaRepository<Property, Long> {

    List<Property> findByOwnerEmail(String ownerEmail);

    List<Property> findByLocationIgnoreCase(String location);


}
