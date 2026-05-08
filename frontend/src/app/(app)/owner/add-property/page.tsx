"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { toast } from "sonner";

export default function AddPropertyPage() {
  const router = useRouter();

  // 🔹 Basic fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [propertyType, setPropertyType] = useState("");

  // 🔹 Features
  const [instantBook, setInstantBook] = useState(false);
  const [selfCheckIn, setSelfCheckIn] = useState(false);

  // 🔹 Amenities
  const [amenityInput, setAmenityInput] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);

  // 🔹 Images
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  // 🔹 Availability
  const [availableFrom, setAvailableFrom] = useState("");
  const [availableTo, setAvailableTo] = useState("");

  // ================= IMAGE UPLOAD =================
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);

    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);

      // ✅ Use env variables
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
      );

      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          },
        );

        const data = await res.json();

        if (data.secure_url) {
          uploadedUrls.push(data.secure_url);
        } else {
          console.error("Upload failed:", data);
        }
      } catch (err) {
        console.error("Upload error:", err);
      }
    }

    setImages((prev) => [...prev, ...uploadedUrls]);
    setUploading(false);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ================= AMENITIES =================
  const addAmenity = () => {
    if (!amenityInput.trim()) return;
    setAmenities((prev) => [...prev, amenityInput]);
    setAmenityInput("");
  };

  const removeAmenity = (index: number) => {
    setAmenities((prev) => prev.filter((_, i) => i !== index));
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post("/properties", {
        title,
        description,
        location,
        address,
        propertyType,
        instantBook,
        selfCheckIn,
        amenities,
        images,
        availableFrom,
        availableTo,
      });

      toast.success("Property added!");
      router.push("/owner/properties");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add property");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Add Property</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* BASIC */}
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 bg-zinc-800 rounded"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 bg-zinc-800 rounded"
        />

        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-2 bg-zinc-800 rounded"
        />

        <input
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full p-2 bg-zinc-800 rounded"
        />

        <input
          placeholder="Property Type (Hostel / PG)"
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
          className="w-full p-2 bg-zinc-800 rounded"
        />

        {/* FEATURES */}
        <div className="flex gap-4">
          <label>
            <input
              type="checkbox"
              checked={instantBook}
              onChange={(e) => setInstantBook(e.target.checked)}
            />{" "}
            Instant Book
          </label>

          <label>
            <input
              type="checkbox"
              checked={selfCheckIn}
              onChange={(e) => setSelfCheckIn(e.target.checked)}
            />{" "}
            Self Check-In
          </label>
        </div>

        {/* AMENITIES */}
        <div>
          <input
            placeholder="Add amenity"
            value={amenityInput}
            onChange={(e) => setAmenityInput(e.target.value)}
            className="p-2 bg-zinc-800 rounded"
          />
          <button
            type="button"
            onClick={addAmenity}
            className="ml-2 px-3 py-1 bg-blue-600 rounded"
          >
            Add
          </button>

          <div className="flex gap-2 flex-wrap mt-2">
            {amenities.map((a, i) => (
              <span key={i} className="bg-zinc-700 px-2 py-1 rounded">
                {a}
                <button onClick={() => removeAmenity(i)}> ✕</button>
              </span>
            ))}
          </div>
        </div>

        {/* IMAGES */}
        <div>
          <input type="file" multiple onChange={handleImageUpload} />
          {uploading && <p>Uploading...</p>}

          <div className="flex gap-2 mt-2">
            {images.map((img, i) => (
              <div key={i} className="relative">
                <img src={img} className="w-20 h-20 object-cover rounded" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-0 right-0 bg-red-600 text-xs px-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* AVAILABILITY */}
        <div className="flex gap-2">
          <input
            type="date"
            value={availableFrom}
            onChange={(e) => setAvailableFrom(e.target.value)}
            className="p-2 bg-zinc-800 rounded"
          />

          <input
            type="date"
            value={availableTo}
            onChange={(e) => setAvailableTo(e.target.value)}
            className="p-2 bg-zinc-800 rounded"
          />
        </div>

        {/* SUBMIT */}
        <button className="w-full bg-green-600 py-2 rounded">
          Add Property
        </button>
      </form>
    </div>
  );
}
