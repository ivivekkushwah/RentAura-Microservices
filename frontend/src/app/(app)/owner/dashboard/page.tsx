"use client";

import { useEffect, useState } from "react";
import OwnerDashboardStats from "./OwnerDashboardStats";
import api from "@/lib/api";
import { toast } from "sonner";

// ================= TYPES =================
interface Property {
  id: number;
  title: string;
}

interface Room {
  id: number;
  propertyId: number;
  roomNumber: string;
  price: number;
}

interface TenantData {
  id: string;
  name: string;
  room: string;
  phone: string;
  email: string;
  rent: number;
  status: string;
}

interface Booking {
  id: number;
  roomId: number;
  bookingDate: string;
  userEmail: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  amount: number;
}

// ================= UI TYPES =================
interface OwnerStats {
  totalProperties: number;
  totalRooms: number;
  bookings: number;
  tenants: number;
}

export default function OwnerDashboardPage() {
  const [stats, setStats] = useState<OwnerStats>({
    totalProperties: 0,
    totalRooms: 0,
    bookings: 0,
    tenants: 0,
  });

  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [tenantsList, setTenantsList] = useState<TenantData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ================= PROPERTIES =================
        const propRes = await api.get("/properties/owner");
        const properties: Property[] = propRes.data || [];

        // ================= ROOMS =================
        const roomResponses = await Promise.all(
          properties.map((p) => api.get(`/rooms/property/${p.id}`)),
        );

        const rooms: Room[] = roomResponses.flatMap((r) => r.data);

        const roomMap: Record<number, Room> = {};
        rooms.forEach((r) => (roomMap[r.id] = r));

        // ================= BOOKINGS =================
        const bookRes = await api.get("/bookings/owner");
        const bookings: Booking[] = bookRes.data || [];

        const approvedBookings = bookings.filter(
          (b) => b.status === "APPROVED",
        );

        const tenants = approvedBookings.map((b) => {
          const room = roomMap[b.roomId];

          return {
            id: b.id.toString(),
            name: b.userEmail.split("@")[0],
            email: b.userEmail, // ✅ ADD
            phone: "N/A", // ✅ ADD
            room: `Room ${room?.roomNumber || b.roomId}`,
            rent: b.amount,
            status: "active",
          };
        });

        setTenantsList(tenants);

        // ================= STATS =================
        const uniqueTenants = new Set(approvedBookings.map((b) => b.userEmail));

        setStats({
          totalProperties: properties.length,
          totalRooms: rooms.length,
          bookings: approvedBookings.length,
          tenants: uniqueTenants.size,
        });

        // ================= RECENT BOOKINGS =================
        setRecentBookings(
          approvedBookings.slice(0, 5).map((b) => {
            const room = roomMap[b.roomId];

            return {
              id: b.id,
              tenant: b.userEmail.split("@")[0],
              room: `Room ${room?.roomNumber || b.roomId}`,
              checkIn: b.bookingDate,
              status: b.status,
              amount: room?.price || 0,
            };
          }),
        );
      } catch (err: any) {
        console.error(err);
        toast.error("Failed to load dashboard");
      }
    };

    fetchData();
  }, []);

  return (
    <OwnerDashboardStats
      stats={stats}
      recentBookings={recentBookings}
      tenantsList={tenantsList} // optional for now
      maintenanceRequests={[]}
    />
  );
}
