package com.rentaura.propertyservice.service;

import com.rentaura.propertyservice.model.Room;

import java.util.List;

public interface RoomService {
    List<Room> getRoomsByProperty(Long propertyId);

    Room createRoom(Room room);

    Room updateRoom(Long id, Room updatedRoom);

    Room updateStatus(Long id, String status);

    Room getRoomById(Long id);

    void deleteRoom(Long id);

    List<Room> getRoomsByOwner(String email);
}
