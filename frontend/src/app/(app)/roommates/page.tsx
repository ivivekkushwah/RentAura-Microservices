"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import api from "@/lib/api";
import { toast } from "sonner";

// ✅ Type
type Roommate = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  avatar?: string;
};

export default function RoommatesPage() {
  const [roommates, setRoommates] = useState<Roommate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ Check auth (cookie-based)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get("/auth/me");
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []);

  // ✅ Fetch roommates
  useEffect(() => {
    const fetchRoommates = async () => {
      try {
        const response = await api.get<Roommate[]>("/auth/users/roommates");
        setRoommates(response.data);
      } catch (err) {
        console.error("Roommate error:", err);
        toast.error("Failed to load roommates");
      } finally {
        setLoading(false);
      }
    };

    fetchRoommates();
  }, []);

  // 🔥 Loading state
  if (loading) {
    return <p className="text-center text-gray-500">Loading roommates...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">

      <Card>
        <CardHeader>
          <CardTitle>People Looking for Roommates</CardTitle>
        </CardHeader>

        <CardContent>
          {roommates.length === 0 ? (
            <p className="text-center text-gray-500">No roommates found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roommates.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-col gap-2 p-3 border rounded-lg shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={user.avatar || "/default-avatar.png"}
                      alt={user.name}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />

                    <div className="flex-1">
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>

                      {user.phone && (
                        <p className="text-sm text-gray-600">📞 {user.phone}</p>
                      )}

                      {user.city && (
                        <p className="text-sm text-gray-600">🏙 {user.city}</p>
                      )}
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="flex gap-2 mt-2">
                    {isLoggedIn ? (
                      <a
                        href={`mailto:${user.email}`}
                        className="flex-1 px-3 py-1 text-sm text-white bg-green-600 rounded text-center"
                      >
                        Contact
                      </a>
                    ) : (
                      <button
                        onClick={() => toast.error("Login required to contact")}
                        className="flex-1 px-3 py-1 text-sm text-white bg-gray-400 rounded"
                      >
                        Login to Contact
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}