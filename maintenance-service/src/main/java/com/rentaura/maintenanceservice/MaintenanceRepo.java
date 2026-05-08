package com.rentaura.maintenanceservice;

import com.rentaura.maintenanceservice.model.MaintenanceRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MaintenanceRepo extends JpaRepository<MaintenanceRequest, Long> {
    List<MaintenanceRequest> findByOwnerEmail(String ownerEmail);

    List<MaintenanceRequest> findByUserEmail(String userEmail);
}
