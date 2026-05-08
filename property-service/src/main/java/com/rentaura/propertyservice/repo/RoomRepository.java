package com.rentaura.propertyservice.repo;

import com.rentaura.propertyservice.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByPropertyId(Long propertyId);

    List<Room> findByPropertyIdIn(List<Long> propertyIds);
}