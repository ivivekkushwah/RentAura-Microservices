"use client";

import { motion } from "framer-motion";

interface RoomCardProps {
  id: number;
  roomNumber: string;
  price: number;
  status: "AVAILABLE" | "OCCUPIED";
  onBook: (roomId: number) => void;
  image?: string;
  location?: string;
  rating?: number;
}

export default function RoomCard({
  id,
  roomNumber,
  price,
  status,
  onBook,
  image,
  location,
  rating = 4.5,
}: RoomCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="border rounded-xl overflow-hidden bg-zinc-900 hover:shadow-xl transition duration-300"
    >
      {/* IMAGE */}
      <div className="relative">
        <img
          src={image || "/placeholder.webp"}
          alt={`Room ${roomNumber}`}
          className="w-full h-44 object-cover"
        />

        {/* STATUS BADGE */}
        <span
          className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full font-medium ${
            status === "AVAILABLE"
              ? "bg-green-600"
              : "bg-red-600"
          }`}
        >
          {status}
        </span>
      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-3">

        {/* TITLE */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            Room {roomNumber}
          </h3>

          <span className="text-sm text-yellow-400">
            ⭐ {rating}
          </span>
        </div>

        {/* LOCATION */}
        {location && (
          <p className="text-sm text-gray-400">
            {location}
          </p>
        )}

        {/* PRICE */}
        <p className="text-xl font-bold">
          ₹{price}
          <span className="text-sm text-gray-400"> /month</span>
        </p>

        {/* ACTION */}
        <div className="pt-2">
          {status === "AVAILABLE" ? (
            <button
              onClick={() => onBook(id)} // ✅ PASS ROOM ID
              className="w-full py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              Book Now
            </button>
          ) : (
            <button
              disabled
              className="w-full py-2 bg-gray-600 rounded-lg cursor-not-allowed"
            >
              Occupied
            </button>
          )}
        </div>

      </div>
    </motion.div>
  );
}