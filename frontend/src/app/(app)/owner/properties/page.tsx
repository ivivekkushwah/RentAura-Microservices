"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { toast } from "sonner";

interface Property {
  id: number;
  title: string;
  location: string;
  propertyType: string;
}

export default function MyPropertiesPage() {
  const router = useRouter();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH OWNER PROPERTIES
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await api.get("/properties/owner");
        setProperties(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load properties");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return <p className="p-6">Loading properties...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Properties</h1>

        <button
          onClick={() => router.push("/owner/add-property")}
          className="px-4 py-2 bg-blue-600 rounded"
        >
          + Add Property
        </button>
      </div>

      {properties.length === 0 ? (
        <p>No properties found</p>
      ) : (
        <div className="space-y-4">
          {properties.map((property) => (
            <div
              key={property.id}
              className="p-4 bg-zinc-800 rounded flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-semibold">{property.title}</h2>
                <p className="text-sm text-gray-400">
                  {property.location} • {property.propertyType}
                </p>
              </div>

              <div className="flex gap-2">
                {/* VIEW */}
                <button
                  onClick={() =>
                    router.push(`/owner/properties/${property.id}`)
                  }
                  className="px-3 py-1 bg-gray-600 rounded"
                >
                  View
                </button>

                {/* EDIT */}
                <button
                  onClick={() =>
                    router.push(`/owner/properties/${property.id}/edit-property`)
                  }
                  className="px-3 py-1 bg-yellow-600 rounded"
                >
                  Edit
                </button>

                {/* ADD ROOM */}
                <button
                  onClick={() =>
                    router.push(`/owner/properties/${property.id}/add-room`)
                  }
                  className="px-3 py-1 bg-green-600 rounded"
                >
                  Add Room
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
