// hooks/useBookingUpdates.ts
"use client";

import { useEffect } from "react";
import Pusher from "pusher-js";

interface BookingUpdate {
  bookingId: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  message?: string;
}

export function useBookingUpdates(
  userId: string,
  onUpdate: (data: BookingUpdate) => void
) {
  useEffect(() => {
    if (!userId) return;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "ap2",
      forceTLS: true,
    });

    const channel = pusher.subscribe(`private-user-${userId}`);

    channel.bind("booking-status-changed", (data: BookingUpdate) => {
      onUpdate(data);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [userId, onUpdate]);
}
