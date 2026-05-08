"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

// ✅ Backend type (UPDATED)
interface Booking {
  id: number;
  roomId: number;
  startDate: string; // ✅ ADD
  endDate: string; // ✅ ADD
  amount: number;
  status: string;
}

// ✅ UI type
interface BookingUI {
  id: string;
  roomId: number;
  startDate: string;
  endDate: string;
  amount: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export default function UserBookingsPage() {
  const [bookings, setBookings] = useState<BookingUI[]>([]);

  // ✅ Maintenance state
  const [selectedBooking, setSelectedBooking] = useState<BookingUI | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get("/bookings/user");
        console.log(res);
        

        const data: Booking[] = Array.isArray(res.data) ? res.data : [];

        const formatted: BookingUI[] = data.map((b) => ({
          id: b.id.toString(),
          roomId: b.roomId,
          startDate: b.startDate,
          endDate: b.endDate,
          amount: b.amount,
          status: b.status?.toUpperCase() as
            | "PENDING"
            | "APPROVED"
            | "REJECTED",
        }));

        setBookings(formatted);
      } catch (err: any) {
        console.error(err);
        toast.error("Failed to load bookings");
      }
    };

    fetchBookings();
  }, []);

  const openMaintenanceModal = (booking: BookingUI) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 space-y-4">
      {/* 🔥 EMPTY STATE */}
      {bookings.length === 0 && (
        <p className="text-gray-400">No bookings found.</p>
      )}

      {bookings.map((booking) => (
        <div
          key={`booking-${booking.id}`}
          className="bg-zinc-900 p-5 rounded-2xl shadow-md space-y-3 hover:shadow-xl transition"
        >
          {/* HEADER */}
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Room #{booking.roomId}</h2>

            <span
              className={`text-xs px-3 py-1 rounded-full ${
                booking.status === "APPROVED"
                  ? "bg-green-600"
                  : booking.status === "REJECTED"
                    ? "bg-red-600"
                    : "bg-yellow-600"
              }`}
            >
              {booking.status}
            </span>
          </div>

          {/* DATES */}
          <div className="text-sm text-gray-400 space-y-1">
            <p>📅 From: {booking.startDate}</p>
            <p>📅 To: {booking.endDate}</p>
          </div>

          {/* DURATION */}
          <p className="text-sm text-gray-500">
            Duration:{" "}
            {Math.ceil(
              (new Date(booking.endDate).getTime() -
                new Date(booking.startDate).getTime()) /
                (1000 * 60 * 60 * 24 * 30),
            )}{" "}
            month(s)
          </p>

          {/* PRICE */}
          <p className="text-green-400 font-bold text-lg">₹{booking.amount}</p>

          {/* ACTION */}
          {booking.status === "APPROVED" && (
            <button
              onClick={() => openMaintenanceModal(booking)}
              className="mt-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              Raise Maintenance
            </button>
          )}
        </div>
      ))}

      {/* 🔥 SIMPLE MODAL */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-zinc-900 p-6 rounded-xl space-y-4 w-96">
            <h2 className="text-lg font-semibold">Raise Maintenance</h2>

            <button
              onClick={() => {
                setIsModalOpen(false);
                toast.success("Request submitted (dummy)");
              }}
              className="px-4 py-2 bg-blue-600 rounded"
            >
              Submit
            </button>

            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-gray-600 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
