"use client";

import { useEffect, useState } from "react";
import TenantsGrid from "./TenantsGrid";
import api from "@/lib/api";
import { toast } from "sonner";

// ✅ Backend types
interface Booking {
  id: number;
  roomId: number;
  userEmail: string;
  status: string;
  amount: number;
}

interface Room {
  id: number;
  roomNumber: string;
  propertyId: number;
  price: number;
}

interface Property {
  id: number;
  title: string;
}

// ✅ UI type
interface Tenant {
  id: string;
  name: string;
  email: string;
  room: string;
  rent: number;
  status: string;
}

export default function TenantsPage() {
  const [tenantsList, setTenantsList] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        // 🔥 Fetch everything in parallel
        const [bookingsRes, roomsRes, propertiesRes] = await Promise.all([
          api.get<Booking[]>("/bookings/owner"),
          api.get<Room[]>("/rooms/owner"), // MUST EXIST
          api.get<Property[]>("/properties/owner"),
        ]);

        const bookings = bookingsRes.data || [];
        const rooms = roomsRes.data || [];
        const properties = propertiesRes.data || [];

        // 🔥 Create lookup maps
        const roomMap = new Map<number, Room>();
        rooms.forEach((r) => roomMap.set(r.id, r));

        const propertyMap = new Map<number, Property>();
        properties.forEach((p) => propertyMap.set(p.id, p));

        // 🔥 Only APPROVED bookings
        const approvedBookings = bookings.filter(
          (b) => b.status === "APPROVED",
        );

        // 🔥 Map to tenants
        const tenants: Tenant[] = approvedBookings.map((b) => {
          const room = roomMap.get(b.roomId);
          const property = room ? propertyMap.get(room.propertyId) : null;

          return {
            id: b.id.toString(),
            name: b.userEmail.split("@")[0],
            email: b.userEmail,

            room: room
              ? `Room ${room.roomNumber} (${property?.title || ""})`
              : "Unknown Room",

            // 🔥 FIX HERE
            rent: b.amount, // ✅ USE BOOKING AMOUNT

            status: "active",
          };
        });

        setTenantsList(tenants);
      } catch (err: any) {
        console.error(err);

        if (err?.response?.status === 401) {
          toast.error("Session expired");
        } else {
          toast.error("Failed to load tenants");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, []);

  if (loading) {
    return <p className="p-6">Loading tenants...</p>;
  }

  return <TenantsGrid tenantsList={tenantsList} />;
}
