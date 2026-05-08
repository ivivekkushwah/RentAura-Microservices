"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

// ---------------- TYPES ----------------
export interface Property {
  id: number;
  title: string | null;
  location: string | null;
  description?: string;
  propertyType?: string;
  images?: string[];
}

export default function BrowsePage() {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await api.get("/properties"); // ✅ axios

        setProperties(Array.isArray(res.data) ? res.data : []);
      } catch (error: any) {
        console.error(
          "❌ Failed to fetch properties:",
          error?.response?.status,
        );
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold">Find Your Next Stay</h1>
        <p className="text-gray-400 mt-2">
          Explore verified properties across cities
        </p>
      </div>

      {/* EMPTY */}
      {properties.length === 0 && (
        <p className="text-center text-gray-400">
          No properties available right now.
        </p>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((p) => {
          const image = p.images?.[0] || "/placeholder.webp";

          return (
            <Link key={p.id} href={`/property/${p.id}`}>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:shadow-xl hover:scale-[1.02] transition cursor-pointer">
                <div className="w-full h-48 bg-zinc-900 flex items-center justify-center overflow-hidden">
                  <img
                    src={image}
                    alt={p.title || "Property"}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="p-4 space-y-2">
                  <h2 className="text-lg font-semibold">
                    {p.title || "Untitled Property"}
                  </h2>

                  <p className="text-sm text-gray-400">
                    📍 {p.location || "Unknown location"}
                  </p>

                  {p.propertyType && (
                    <p className="text-xs text-gray-500">{p.propertyType}</p>
                  )}

                  <button className="mt-2 text-sm text-blue-400 hover:underline">
                    View Details →
                  </button>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
