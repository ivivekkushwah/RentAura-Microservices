"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { toast } from "sonner";

export default function EditPropertyPage() {
  const params = useParams();
  const router = useRouter();

  const propertyId = Number(params?.id);

  const [form, setForm] = useState({
    title: "",
    location: "",
    description: "",
    propertyType: "HOSTEL",
  });

  const [loading, setLoading] = useState(true);

  // 🔥 Fetch property
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await api.get(`/properties/${propertyId}`);
        const data = res.data;

        setForm({
          title: data.title,
          location: data.location,
          description: data.description,
          propertyType: data.propertyType,
        });

      } catch (err) {
        toast.error("Failed to load property");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  // 🔥 Handle change
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 Submit update
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await api.put(`/properties/${propertyId}`, form);
      toast.success("Property updated");

      router.push("/owner/properties");

    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-bold">Edit Property</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full p-2 bg-zinc-800 rounded"
        />

        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full p-2 bg-zinc-800 rounded"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-2 bg-zinc-800 rounded"
        />

        <select
          name="propertyType"
          value={form.propertyType}
          onChange={handleChange}
          className="w-full p-2 bg-zinc-800 rounded"
        >
          <option value="HOSTEL">HOSTEL</option>
          <option value="PG">PG</option>
          <option value="APARTMENT">APARTMENT</option>
        </select>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 rounded"
        >
          Update Property
        </button>

      </form>
    </div>
  );
}