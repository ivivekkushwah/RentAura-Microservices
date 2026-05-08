"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { toast } from "sonner";

export default function RoommateToggle({
  initialStatus,
}: {
  initialStatus: boolean;
}) {
  const [lookingForRoommate, setLookingForRoommate] =
    useState(initialStatus);
  const [loading, setLoading] = useState(false);

  const toggleRoommate = async () => {
    try {
      setLoading(true);

      const response = await api.post("/auth/users/roommates/toggle");
      const { lookingForRoommate } = response.data;

      setLookingForRoommate(lookingForRoommate);

      toast.success(
        lookingForRoommate
          ? "You are now looking for a roommate 👍"
          : "You are no longer looking for a roommate"
      );
    } catch (error: any) {
      console.error("Toggle error:", error);

      toast.error(
        error?.message || "Failed to update roommate status"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={toggleRoommate} disabled={loading}>
      {loading
        ? "Updating..."
        : lookingForRoommate
        ? "Stop Looking"
        : "Start Looking"}
    </Button>
  );
}