"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Heart,
  IndianRupee,
  Eye,
  X,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

// ✅ ROOM TYPE
interface Room {
  id: number;
  roomNumber: string;
  price: number;
  capacity: number;
  status: string;
  images?: string[];
}

export default function FavoritesClient() {

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ MODAL
  const [selectedRoom, setSelectedRoom] =
    useState<Room | null>(null);

  // ================= FETCH FAVORITES =================
  useEffect(() => {

    const fetchFavorites = async () => {

      try {

        // 🔥 get favorites
        const favoriteRes =
          await api.get("/favorites");

        const favorites =
          favoriteRes.data || [];

        // 🔥 fetch room details
        const roomResponses =
          await Promise.all(
            favorites.map((fav: any) =>
              api.get(`/rooms/${fav.roomId}`)
            )
          );

        const roomsData =
          roomResponses.map((r) => r.data);

        setRooms(roomsData);

      } catch (error: any) {

        console.error(
          "Favorites error:",
          error
        );

      } finally {

        setLoading(false);
      }
    };

    fetchFavorites();

  }, []);

  // ================= REMOVE FAVORITE =================
  const removeFavorite = async (
    roomId: number
  ) => {

    try {

      await api.delete(
        `/favorites/${roomId}`
      );

      setRooms((prev) =>
        prev.filter(
          (room) => room.id !== roomId
        )
      );

    } catch (err) {

      console.error(err);
    }
  };

  // ================= LOADING =================
  if (loading) {

    return (
      <p className="p-6 text-center">
        Loading favorites...
      </p>
    );
  }

  // ================= EMPTY =================
  if (rooms.length === 0) {

    return (
      <div className="p-10 text-center">

        <Heart className="mx-auto h-12 w-12 text-gray-400 mb-2" />

        <p className="text-gray-600 dark:text-gray-400">
          No favorite rooms yet.
        </p>

      </div>
    );
  }

  // ================= UI =================
  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <Heart className="text-red-500" />
          My Favorite Rooms
        </h1>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {rooms.map((room) => (

            <div
              key={room.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm"
            >

              {/* IMAGE */}
              <div className="relative h-48 bg-zinc-900">

                <Image
                  src={
                    room.images?.[0] ||
                    "/placeholder.webp"
                  }
                  alt={`Room ${room.roomNumber}`}
                  fill
                  className="object-contain"
                />

                {/* REMOVE */}
                <button
                  onClick={() =>
                    removeFavorite(room.id)
                  }
                  className="absolute top-2 right-2 bg-black/60 text-white p-2 rounded-full"
                >
                  <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                </button>

              </div>

              {/* CONTENT */}
              <div className="p-4 space-y-2">

                <h2 className="font-semibold text-lg">
                  Room {room.roomNumber}
                </h2>

                {/* PRICE */}
                <p className="flex items-center gap-1 font-bold">

                  <IndianRupee className="h-4 w-4" />

                  {room.price}

                </p>

                {/* CAPACITY */}
                <p className="flex items-center gap-1 text-sm text-gray-500">

                  <Users className="h-4 w-4" />

                  Capacity: {room.capacity}

                </p>

                {/* STATUS */}
                <span
                  className={`inline-block text-xs px-2 py-1 rounded ${
                    room.status === "AVAILABLE"
                      ? "bg-green-600 text-white"
                      : room.status === "BOOKED"
                      ? "bg-red-600 text-white"
                      : "bg-yellow-600 text-white"
                  }`}
                >
                  {room.status}
                </span>

                {/* ACTION */}
                <div className="pt-2">

                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      setSelectedRoom(room)
                    }
                  >

                    <Eye className="h-4 w-4 mr-1" />

                    View Details

                  </Button>

                </div>

              </div>
            </div>
          ))}

        </div>
      </div>

      {/* ================= MODAL ================= */}
      {selectedRoom && (

        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">

          <div className="bg-white dark:bg-zinc-900 rounded-xl max-w-lg w-full overflow-hidden">

            {/* IMAGE */}
            <div className="relative h-64 bg-zinc-900">

              <Image
                src={
                  selectedRoom.images?.[0] ||
                  "/placeholder.webp"
                }
                alt={`Room ${selectedRoom.roomNumber}`}
                fill
                className="object-contain"
              />

              {/* CLOSE */}
              <button
                onClick={() =>
                  setSelectedRoom(null)
                }
                className="absolute top-3 right-3 bg-black/60 text-white p-2 rounded-full"
              >

                <X className="h-5 w-5" />

              </button>

            </div>

            {/* DETAILS */}
            <div className="p-5 space-y-3">

              <h2 className="text-2xl font-bold">
                Room {selectedRoom.roomNumber}
              </h2>

              <p className="flex items-center gap-1 font-semibold">

                <IndianRupee className="h-4 w-4" />

                {selectedRoom.price}

              </p>

              <p className="flex items-center gap-1 text-sm text-gray-500">

                <Users className="h-4 w-4" />

                Capacity: {selectedRoom.capacity}

              </p>

              <div>

                <span
                  className={`text-xs px-3 py-1 rounded ${
                    selectedRoom.status ===
                    "AVAILABLE"
                      ? "bg-green-600 text-white"
                      : selectedRoom.status ===
                        "BOOKED"
                      ? "bg-red-600 text-white"
                      : "bg-yellow-600 text-white"
                  }`}
                >
                  {selectedRoom.status}
                </span>

              </div>

            </div>

          </div>

        </div>
      )}
    </div>
  );
}