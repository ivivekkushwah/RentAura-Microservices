"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import RoomCard from "./RoomCard";
import BookingModal from "./BookingModal";
import { Input } from "@/components/ui/input";

// ---------------- TYPES ----------------
interface Room {
  id: number;
  roomNumber: string;
  price: number;
  status: "AVAILABLE" | "OCCUPIED";
  propertyId: number;
}

// ---------------- COMPONENT ----------------
export default function RoomGrid({ rooms }: { rooms: Room[] }) {
  const [search, setSearch] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔍 Filter rooms
  const filteredRooms = useMemo(() => {
    return rooms.filter((r) =>
      r.roomNumber.toLowerCase().includes(search.toLowerCase()),
    );
  }, [rooms, search]);

  // 🎯 Handle booking
  const handleBook = (roomId: number) => {
    const room = rooms.find((r) => r.id === roomId);
    if (!room || room.status === "OCCUPIED") return;

    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* 🔍 SEARCH */}
      <Input
        placeholder="Search room number..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* 🏠 ROOMS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <motion.div
            key={room.id} // ✅ FIXED KEY
            whileHover={{ scale: 1.03 }}
          >
            <RoomCard
              id={room.id} // ✅ FIXED
              roomNumber={room.roomNumber}
              price={room.price}
              status={room.status}
              onBook={(id) => handleBook(id)} // ✅ FIXED
            />
          </motion.div>
        ))}
      </div>

      {/* 📦 BOOKING MODAL */}
      {selectedRoom && (
        <BookingModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          roomId={selectedRoom.id} // ✅ IMPORTANT
          roomNumber={selectedRoom.roomNumber}
        />
      )}
    </div>
  );
}
