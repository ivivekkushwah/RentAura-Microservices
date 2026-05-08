package com.rentaura.maintenanceservice.service;

import com.rentaura.maintenanceservice.model.MaintenanceRequest;

import java.util.List;
public interface MaintenanceService {

    MaintenanceRequest create(MaintenanceRequest req);

    List<MaintenanceRequest> getOwnerRequests(String email);

    List<MaintenanceRequest> getUserRequests(String email);

    MaintenanceRequest updateStatus(Long id, String status);
}