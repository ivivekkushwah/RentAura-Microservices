"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { toast } from "sonner";

interface Property {
  id: number;
  title: string;
  location: string;
  description: string;
  propertyType: string;
}

interface Room {
  id: number;
  roomNumber: string;
  price: number;
  capacity: number;
  status: string;
}

export default function PropertyPage() {
  const params = useParams();
  const router = useRouter();

  const propertyId = typeof params?.id === "string" ? Number(params.id) : null;

  const [property, setProperty] = useState<Property | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH PROPERTY + ROOMS
  useEffect(() => {
    if (!propertyId || isNaN(propertyId)) return;

    const fetchData = async () => {
      try {
        const propertyRes = await api.get(`/properties/${propertyId}`);
        setProperty(propertyRes.data);

        const roomsRes = await api.get(`/rooms/property/${propertyId}`);
        setRooms(roomsRes.data);
      } catch (err: any) {
        console.error(err);

        if (err?.response?.status === 401) {
          toast.error("Please login again");
          router.push("/login");
        } else {
          toast.error("Failed to load property or rooms");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [propertyId, router]);

  // 🔥 DELETE ROOM
  const handleDelete = async (roomId: number) => {
    const confirmDelete = confirm("Are you sure you want to delete this room?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/rooms/${roomId}`);

      setRooms((prev) => prev.filter((r) => r.id !== roomId));
      toast.success("Room deleted");
    } catch (err: any) {
      console.error(err);

      if (err?.response?.status === 403) {
        toast.error("You are not authorized");
      } else {
        toast.error("Failed to delete room");
      }
    }
  };

  // 🔥 VALIDATION
  if (!propertyId || isNaN(propertyId)) {
    return <p className="p-6 text-red-500">Invalid Property ID</p>;
  }

  if (loading) return <p className="p-6">Loading...</p>;
  if (!property) return <p className="p-6">Property not found</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* 🔹 PROPERTY DETAILS */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{property.title}</h1>
        <p>{property.location}</p>
        <p className="text-gray-400">{property.description}</p>
        <p className="text-sm text-gray-500">Type: {property.propertyType}</p>
      </div>

      {/* 🔹 ADD ROOM BUTTON */}
      <button
        onClick={() => router.push(`/owner/properties/${propertyId}/add-room`)}
        className="px-4 py-2 bg-green-600 rounded"
      >
        + Add Room
      </button>

      {/* 🔹 ROOMS LIST */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Rooms</h2>

        {rooms.length === 0 ? (
          <p className="text-gray-400">No rooms added yet</p>
        ) : (
          rooms.map((room) => (
            <div
              key={room.id}
              className="p-4 bg-zinc-800 rounded flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">Room {room.roomNumber}</h3>

                <p className="text-sm text-gray-400">
                  ₹{room.price} • Capacity: {room.capacity}
                </p>

                <p className="text-xs text-gray-500">Status: {room.status}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    router.push(
                      `/owner/properties/${propertyId}/edit-room/${room.id}`,
                    )
                  }
                  className="px-3 py-1 bg-yellow-600 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(room.id)}
                  className="px-3 py-1 bg-red-600 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
