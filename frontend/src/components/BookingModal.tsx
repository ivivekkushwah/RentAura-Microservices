"use client";

import { useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  roomId: number;
  roomNumber: string;
}

export default function BookingModal({
  open,
  onClose,
  roomId,
  roomNumber,
}: BookingModalProps) {
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleBooking = async () => {
    try {
      setLoading(true);

      await api.post("/bookings/create", {
        roomId, // ✅ IMPORTANT
      });

      toast.success("Booking request sent!");

      onClose();

    } catch (err: any) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Booking failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

      <div className="bg-zinc-900 p-6 rounded-xl w-full max-w-md">

        <h2 className="text-xl font-semibold mb-4">
          Book Room {roomNumber}
        </h2>

        <p className="text-sm text-gray-400 mb-6">
          Do you want to proceed with this booking?
        </p>

        <div className="flex justify-end gap-3">

          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-zinc-700"
          >
            Cancel
          </button>

          <button
            onClick={handleBooking}
            disabled={loading}
            className="px-4 py-2 rounded bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Booking..." : "Confirm"}
          </button>

        </div>

      </div>
    </div>
  );
}