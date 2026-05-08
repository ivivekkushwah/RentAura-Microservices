package com.rentaura.propertyservice.service;

import com.rentaura.propertyservice.model.Property;
import com.rentaura.propertyservice.model.Room;
import com.rentaura.propertyservice.model.RoomStatus;
import com.rentaura.propertyservice.repo.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final PropertyService propertyService;

    // ✅ GET ROOMS BY PROPERTY
    @Override
    public List<Room> getRoomsByProperty(Long propertyId) {
        return roomRepository.findByPropertyId(propertyId);
    }

    // ✅ CREATE ROOM
    @Override
    public Room createRoom(Room room) {
        room.setStatus(RoomStatus.AVAILABLE);
        return roomRepository.save(room);
    }

    // ✅ UPDATE ROOM (without touching status)
    @Override
    public Room updateRoom(Long id, Room updatedRoom) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        room.setRoomNumber(updatedRoom.getRoomNumber());
        room.setPrice(updatedRoom.getPrice());
        room.setCapacity(updatedRoom.getCapacity());

        // ❗ DO NOT override status here (business logic controlled separately)

        return roomRepository.save(room);
    }

    // ✅ UPDATE STATUS (booking flow)
    @Override
    public Room updateStatus(Long roomId, String status) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        // 🔥 Validate status
        if (!status.equals("AVAILABLE") && !status.equals("OCCUPIED")) {
            throw new RuntimeException("Invalid status");
        }

        room.setStatus(RoomStatus.valueOf(status));
        return roomRepository.save(room);
    }

    // ✅ GET ROOM BY ID
    @Override
    public Room getRoomById(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));
    }

    // ✅ DELETE ROOM
    @Override
    public void deleteRoom(Long id) {
        if (!roomRepository.existsById(id)) {
            throw new RuntimeException("Room not found");
        }
        roomRepository.deleteById(id);
    }

    @Override
    public List<Room> getRoomsByOwner(String email) {

        // 1️⃣ Get owner properties
        List<Property> properties = propertyService.getOwnerProperties(email);

        // 2️⃣ Extract property IDs
        List<Long> propertyIds = properties.stream()
                .map(Property::getId)
                .toList();

        // 3️⃣ Fetch rooms using property IDs
        return roomRepository.findByPropertyIdIn(propertyIds);
    }
}