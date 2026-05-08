"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { toast } from "sonner";

type RoomStatus = "AVAILABLE" | "BOOKED" | "MAINTENANCE";

export default function AddRoomPage() {
  const params = useParams();
  const router = useRouter();

  const propertyId =
    typeof params?.id === "string" ? Number(params.id) : null;

  const [form, setForm] = useState({
    roomNumber: "",
    price: "",
    capacity: "1",
    status: "AVAILABLE" as RoomStatus,
  });

  // 🔥 IMAGE STATE
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const [loading, setLoading] = useState(false);

  if (!propertyId || isNaN(propertyId)) {
    return <p className="text-center mt-10 text-red-500">Invalid Property</p>;
  }

  // ================= FORM =================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= IMAGE UPLOAD =================
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);

    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
      );

      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();

        if (data.secure_url) {
          uploadedUrls.push(data.secure_url);
        }
      } catch (err) {
        console.error("Upload failed", err);
        toast.error("Image upload failed");
      }
    }

    setImages((prev) => [...prev, ...uploadedUrls]);
    setUploading(false);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ================= VALIDATION =================
  const isFormValid =
    form.roomNumber.trim() !== "" &&
    Number(form.price) > 0 &&
    Number(form.capacity) > 0;

  // ================= SUBMIT =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.error("Fill all fields correctly");
      return;
    }

    try {
      setLoading(true);

      await api.post(`/rooms/${propertyId}`, {
        roomNumber: form.roomNumber.trim(),
        price: Number(form.price),
        capacity: Number(form.capacity),
        status: form.status,
        images, // 🔥 IMPORTANT (matches backend)
      });

      toast.success("Room added!");

      // reset
      setForm({
        roomNumber: "",
        price: "",
        capacity: "1",
        status: "AVAILABLE",
      });
      setImages([]);

    } catch (err) {
      console.error(err);
      toast.error("Failed to add room");
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">

      <h1 className="text-2xl font-bold">
        Add Room (Property #{propertyId})
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* ROOM NUMBER */}
        <input
          name="roomNumber"
          value={form.roomNumber}
          placeholder="Room Number"
          onChange={handleChange}
          className="w-full p-2 bg-zinc-800 rounded"
        />

        {/* PRICE */}
        <input
          name="price"
          type="number"
          min="1"
          value={form.price}
          placeholder="Price"
          onChange={handleChange}
          className="w-full p-2 bg-zinc-800 rounded"
        />

        {/* CAPACITY */}
        <input
          name="capacity"
          type="number"
          min="1"
          value={form.capacity}
          placeholder="Capacity"
          onChange={handleChange}
          className="w-full p-2 bg-zinc-800 rounded"
        />

        {/* STATUS */}
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full p-2 bg-zinc-800 rounded"
        >
          <option value="AVAILABLE">Available</option>
          <option value="BOOKED">Booked</option>
          <option value="MAINTENANCE">Maintenance</option>
        </select>

        {/* 🔥 IMAGE UPLOAD */}
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Room Images</label>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full p-2 bg-zinc-800 rounded"
          />

          {uploading && (
            <p className="text-yellow-400 text-sm">Uploading...</p>
          )}

          <div className="flex flex-wrap gap-2">
            {images.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={img}
                  className="w-20 h-20 object-cover rounded"
                />

                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-0 right-0 bg-red-600 text-xs px-1 rounded"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading || !isFormValid}
          className="w-full py-2 bg-green-600 rounded disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Room"}
        </button>

        {/* BACK */}
        <button
          type="button"
          onClick={() => router.push(`/owner/property/${propertyId}`)}
          className="w-full py-2 bg-blue-600 rounded"
        >
          Back to Property
        </button>

      </form>
    </div>
  );
}