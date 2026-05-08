"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { toast } from "sonner";

export default function EditRoomPage() {
  const params = useParams();
  const router = useRouter();

  const propertyId = Number(params?.id);
  const roomId = Number(params?.roomId);

  const [form, setForm] = useState({
    roomNumber: "",
    price: "",
    capacity: "",
    status: "AVAILABLE",
  });

  const [loading, setLoading] = useState(true);

  // 🔥 Fetch room details
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await api.get(`/rooms/${roomId}`);
        const data = res.data;

        setForm({
          roomNumber: data.roomNumber,
          price: data.price,
          capacity: data.capacity,
          status: data.status,
        });

      } catch (err) {
        toast.error("Failed to load room");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  // 🔥 Handle change
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 Submit update
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await api.put(`/rooms/${roomId}`, {
        ...form,
        price: Number(form.price),
        capacity: Number(form.capacity),
      });

      toast.success("Room updated");
      router.push(`/owner/properties/${propertyId}`);

    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-bold">Edit Room</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="roomNumber"
          value={form.roomNumber}
          onChange={handleChange}
          placeholder="Room Number"
          className="w-full p-2 bg-zinc-800 rounded"
        />

        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          type="number"
          className="w-full p-2 bg-zinc-800 rounded"
        />

        <input
          name="capacity"
          value={form.capacity}
          onChange={handleChange}
          placeholder="Capacity"
          type="number"
          className="w-full p-2 bg-zinc-800 rounded"
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full p-2 bg-zinc-800 rounded"
        >
          <option value="AVAILABLE">AVAILABLE</option>
          <option value="BOOKED">BOOKED</option>
        </select>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 rounded"
        >
          Update Room
        </button>

      </form>
    </div>
  );
}