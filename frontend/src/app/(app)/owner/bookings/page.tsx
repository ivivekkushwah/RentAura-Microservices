"use client";

import { useEffect, useState } from "react";
import { OwnerBookingsTable } from "./OwnerBookingsTable";
import { toast } from "sonner";
import api from "@/lib/api";

// ✅ Backend type
interface Booking {
  id: number;
  roomId: number;
  userEmail: string;
  amount: number;
  status: string;

  startDate: string; // ✅ add
  endDate: string; // ✅ add
}

// 🔥 Room type
interface Room {
  id: number;
  roomNumber: string;
}

// ✅ UI type
interface BookingUI {
  id: string;
  roomName: string;
  tenantName: string;
  tenantEmail: string;
  bookingAmount: number;

  startDate: string; // ✅ add
  endDate: string; // ✅ add

  status: "PENDING" | "APPROVED" | "REJECTED";
}

interface BookingSummary {
  totalBookings: number;
}

export default function OwnerBookingsPage() {
  const [bookings, setBookings] = useState<BookingUI[]>([]);
  const [summary, setSummary] = useState<BookingSummary>({
    totalBookings: 0,
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get("/bookings/owner");

        const data: Booking[] = Array.isArray(res.data) ? res.data : [];

        // ✅ FILTER INVALID ROOM IDS (CRITICAL FIX)
        const validBookings = data.filter((b) => b.roomId && b.roomId !== 0);

        // 🔥 SAFE FETCH (no crash on single failure)
        const roomResponses = await Promise.allSettled(
          validBookings.map((b) => api.get<Room>(`/rooms/${b.roomId}`)),
        );

        const roomsMap: Record<number, Room> = {};

        roomResponses.forEach((res) => {
          if (res.status === "fulfilled") {
            const room = res.value.data;
            roomsMap[room.id] = room;
          }
        });

        // ✅ format UI (keep all bookings, even invalid ones)
        const formatted: BookingUI[] = data.map((b) => ({
          id: b.id.toString(),
          roomName:
            b.roomId && roomsMap[b.roomId]
              ? `Room ${roomsMap[b.roomId].roomNumber}`
              : `Room #${b.roomId || "N/A"}`, // ✅ fallback
          tenantName: b.userEmail.split("@")[0],
          tenantEmail: b.userEmail,
          bookingAmount: b.amount,
          startDate: b.startDate,
          endDate: b.endDate,
          status: b.status?.toUpperCase() as
            | "PENDING"
            | "APPROVED"
            | "REJECTED",
        }));

        setBookings(formatted);

        setSummary({
          totalBookings: formatted.length,
        });
      } catch (err: any) {
        console.error("Error fetching bookings:", err);

        if (err.response?.status === 401) {
          toast.error("Session expired. Please login again.");
        } else {
          toast.error("Failed to load bookings");
        }
      }
    };

    fetchBookings();
  }, []);

  return <OwnerBookingsTable bookings={bookings} summary={summary} />;
}
