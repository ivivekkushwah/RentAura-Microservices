"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { toast } from "sonner";

// ---------------- TYPES ----------------
interface Property {
  id: number;
  title: string;
  location: string;
  description: string;
  propertyType?: string;
  images?: string[];
}

interface Room {
  id: number;
  roomNumber: string;
  price: number;
  capacity: number;
  status: string;
  images?: string[];
}

// ---------------- PAGE ----------------
export default function PropertyDetailsPage() {
  const params = useParams();
  const propertyId = Number(params.id);

  const [property, setProperty] = useState<Property | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [totalPrice, setTotalPrice] = useState(0);

  // ❤️ FAVORITES
  const [favorites, setFavorites] = useState<number[]>([]);

  // ---------------- FETCH ----------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propRes, roomRes] = await Promise.all([
          api.get(`/properties/${propertyId}`),
          api.get(`/rooms/property/${propertyId}`),
        ]);

        setProperty(propRes.data);
        setRooms(roomRes.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load property");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [propertyId]);

  // ---------------- FETCH FAVORITES ----------------
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await api.get("/favorites");

        const ids = res.data.map(
          (f: any) => f.roomId
        );

        setFavorites(ids);

      } catch (err) {
        console.error(err);
      }
    };

    fetchFavorites();
  }, []);

  // ---------------- PRICE CALC ----------------
  useEffect(() => {
    if (startDate && endDate && selectedRoom) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      const months =
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth());

      const finalMonths = months <= 0 ? 1 : months;

      setTotalPrice(finalMonths * selectedRoom.price);
    }
  }, [startDate, endDate, selectedRoom]);

  // ---------------- BOOK ROOM ----------------
  const handleBooking = async () => {
    if (!selectedRoom) return;

    if (!startDate || !endDate) {
      toast.error("Please select dates");
      return;
    }

    try {
      await api.post("/bookings", {
        roomId: selectedRoom.id,
        startDate,
        endDate,
        amount: totalPrice,
      });

      toast.success("Booking successful!");

      // reset
      setSelectedRoom(null);
      setStartDate("");
      setEndDate("");
      setTotalPrice(0);

    } catch (err: any) {
      console.error(err);

      if (err.response?.status === 401) {
        toast.error("Login required");
      } else {
        toast.error("Booking failed");
      }
    }
  };

  // ---------------- TOGGLE FAVORITE ----------------
  const toggleFavorite = async (
    roomId: number
  ) => {

    try {

      // REMOVE
      if (favorites.includes(roomId)) {

        await api.delete(
          `/favorites/${roomId}`
        );

        setFavorites((prev) =>
          prev.filter(
            (id) => id !== roomId
          )
        );

        toast.success(
          "Removed from favorites"
        );

      } else {

        // ADD
        await api.post(
          `/favorites/${roomId}`
        );

        setFavorites((prev) => [
          ...prev,
          roomId,
        ]);

        toast.success(
          "Added to favorites"
        );
      }

    } catch (err) {

      console.error(err);

      toast.error(
        "Failed to update favorite"
      );
    }
  };

  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-400">
        Loading...
      </p>
    );
  }

  // ---------------- NOT FOUND ----------------
  if (!property) {
    return (
      <p className="text-center mt-10 text-red-500">
        Property not found
      </p>
    );
  }

  const propertyImage =
    property.images?.[0] || "/placeholder.webp";

  // ---------------- UI ----------------
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">

      {/* ---------------- PROPERTY INFO ---------------- */}
      <div className="space-y-6">

        {/* PROPERTY IMAGE */}
        <div className="w-full h-[350px] bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden flex items-center justify-center">
          <img
            src={propertyImage}
            alt={property.title}
            className="w-full h-full object-contain"
          />
        </div>

        {/* CONTENT */}
        <div className="space-y-3">

          <h1 className="text-4xl font-bold">
            {property.title}
          </h1>

          <p className="text-gray-400 text-lg">
            📍 {property.location}
          </p>

          {property.propertyType && (
            <div>
              <span className="bg-zinc-800 text-sm px-3 py-1 rounded-full">
                {property.propertyType}
              </span>
            </div>
          )}

          <p className="text-gray-300 leading-7">
            {property.description}
          </p>

        </div>
      </div>

      {/* ---------------- ROOMS ---------------- */}
      <div className="space-y-6">

        <h2 className="text-3xl font-bold">
          Available Rooms
        </h2>

        {rooms.length === 0 ? (

          <p className="text-gray-400">
            No rooms available
          </p>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {rooms.map((room) => {

              const roomImage =
                room.images?.[0] ||
                "/placeholder.webp";

              return (

                <div
                  key={room.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition"
                >

                  {/* ROOM IMAGE */}
                  <div className="w-full h-56 bg-zinc-900 flex items-center justify-center overflow-hidden">

                    <img
                      src={roomImage}
                      alt={`Room ${room.roomNumber}`}
                      className="w-full h-full object-contain"
                    />

                  </div>

                  {/* ROOM CONTENT */}
                  <div className="p-5 space-y-4">

                    {/* TOP */}
                    <div className="flex justify-between items-start">

                      <div>

                        <div className="flex items-center gap-3">

                          <h3 className="text-2xl font-semibold">
                            Room {room.roomNumber}
                          </h3>

                          {/* ❤️ FAVORITE */}
                          <button
                            onClick={() =>
                              toggleFavorite(room.id)
                            }
                            className="text-2xl"
                          >
                            {favorites.includes(room.id)
                              ? "❤️"
                              : "🤍"}
                          </button>

                        </div>

                        <p className="text-gray-400 text-sm mt-1">
                          Capacity: {room.capacity}
                        </p>

                      </div>

                      <p className="text-green-400 text-2xl font-bold">
                        ₹{room.price}
                      </p>

                    </div>

                    {/* STATUS */}
                    <div>

                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          room.status === "AVAILABLE"
                            ? "bg-green-600"
                            : "bg-red-600"
                        }`}
                      >
                        {room.status}
                      </span>

                    </div>

                    {/* BUTTON */}
                    <button
                      onClick={() =>
                        setSelectedRoom(room)
                      }
                      disabled={
                        room.status !==
                        "AVAILABLE"
                      }
                      className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-medium disabled:opacity-50"
                    >
                      {room.status === "AVAILABLE"
                        ? "Book Now"
                        : "Not Available"}
                    </button>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ---------------- BOOKING MODAL ---------------- */}
      {selectedRoom && (

        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md space-y-5">

            <h2 className="text-2xl font-bold">
              Book Room {selectedRoom.roomNumber}
            </h2>

            {/* START DATE */}
            <div className="space-y-2">

              <label className="text-sm text-gray-400">
                Start Date
              </label>

              <input
                type="date"
                value={startDate}
                onChange={(e) =>
                  setStartDate(e.target.value)
                }
                className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700"
              />

            </div>

            {/* END DATE */}
            <div className="space-y-2">

              <label className="text-sm text-gray-400">
                End Date
              </label>

              <input
                type="date"
                value={endDate}
                onChange={(e) =>
                  setEndDate(e.target.value)
                }
                className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700"
              />

            </div>

            {/* PRICE */}
            {totalPrice > 0 && (

              <div className="bg-zinc-800 rounded-xl p-4">

                <p className="text-lg font-bold text-green-400">
                  Total Price: ₹{totalPrice}
                </p>

              </div>
            )}

            {/* ACTIONS */}
            <div className="flex gap-3">

              <button
                onClick={() =>
                  setSelectedRoom(null)
                }
                className="flex-1 bg-zinc-700 hover:bg-zinc-600 py-3 rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={handleBooking}
                className="flex-1 bg-blue-600 hover:bg-blue-500 py-3 rounded-xl"
              >
                Confirm Booking
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}