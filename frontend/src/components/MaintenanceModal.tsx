"use client";

import { useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

export default function MaintenanceModal({
  booking,
  onClose,
}: {
  booking: any;
  onClose: () => void;
}) {
  const [issue, setIssue] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!issue || !description) {
      toast.error("All fields required");
      return;
    }

    try {
      setLoading(true);

      await api.post("/maintenance/create", {
        bookingId: booking.id,
        propertyId: booking.propertyId,
        issue,
        description,
      });

      toast.success("Request submitted");
      onClose();
    } catch (err) {
      toast.error("Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-zinc-900 p-6 rounded-xl w-[400px] space-y-4">
        <h2 className="text-lg font-semibold">Raise Maintenance</h2>

        <input
          placeholder="Issue (e.g. Plumbing)"
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          className="w-full p-2 bg-zinc-800 rounded"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 bg-zinc-800 rounded"
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-green-600 px-3 py-1 rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}