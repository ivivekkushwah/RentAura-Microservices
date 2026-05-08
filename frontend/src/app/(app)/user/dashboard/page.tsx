"use client";

import { useEffect, useState } from "react";
import TenantDashboard from "./UserDashboardUI";
import api from "@/lib/api";
import { toast } from "sonner";

// ================= TYPES =================
interface Booking {
  id: number;
  roomId: number;
  amount: number;

  startDate: string;
  endDate: string;

  status: "PENDING" | "APPROVED" | "REJECTED";
}

interface Room {
  id: number;
  propertyId: number;
  roomNumber: string;
  price: number;
  images?: string[];
}

interface User {
  email: string;
}

interface DashboardProperty {
  id: number;
  title: string;
  location: string;
  price: number;
  images?: string[];
}

interface Maintenance {
  id: number;
  issue: string;
  description: string;
  status: string;
}

// ================= PAGE =================
export default function UserDashboardPage() {
  const [loading, setLoading] = useState(true);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [roomsMap, setRoomsMap] = useState<Record<number, Room>>({});

  const [user, setUser] = useState<User | null>(null);

  const [properties, setProperties] = useState<DashboardProperty[]>([]);

  const [activePropertyId, setActivePropertyId] =
    useState<number | null>(null);

  const [maintenanceRequests, setMaintenanceRequests] =
    useState<Maintenance[]>([]);

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🔥 USER
        const userRes = await api.get<User>("/auth/me");
        setUser(userRes.data);

        // 🔥 BOOKINGS
        const bookingsRes = await api.get<Booking[]>(
          "/bookings/user"
        );

        const allBookings = bookingsRes.data || [];

        // ✅ ONLY APPROVED
        const approvedBookings = allBookings.filter(
          (b) => b.status === "APPROVED"
        );

        setBookings(approvedBookings);

        if (approvedBookings.length === 0) {
          setLoading(false);
          return;
        }

        // ================= FETCH ROOMS =================
        const roomResponses = await Promise.all(
          approvedBookings.map((b) =>
            api.get<Room>(`/rooms/${b.roomId}`)
          )
        );

        const rooms: Room[] = roomResponses.map(
          (r) => r.data
        );

        // 🔥 ROOM MAP
        const roomMap: Record<number, Room> = {};

        rooms.forEach((room) => {
          roomMap[room.id] = room;
        });

        setRoomsMap(roomMap);

        // ================= FETCH PROPERTIES =================
        const uniquePropertyIds = [
          ...new Set(rooms.map((r) => r.propertyId)),
        ];

        const propertyResponses = await Promise.all(
          uniquePropertyIds.map((id) =>
            api.get<DashboardProperty>(`/properties/${id}`)
          )
        );

        const props = propertyResponses.map((res) => ({
          ...res.data,
          price: res.data.price ?? 0,
        }));

        setProperties(props);

        // 🔥 DEFAULT ACTIVE PROPERTY
        if (props.length > 0) {
          setActivePropertyId(props[0].id);
        }

      } catch (err: any) {
        console.error(err);

        if (err?.response?.status === 401) {
          toast.error("Please login again");
        } else {
          toast.error("Failed to load dashboard");
        }

      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ================= MAINTENANCE =================
  useEffect(() => {
    if (!activePropertyId) return;

    const fetchMaintenance = async () => {
      try {
        const res = await api.get<Maintenance[]>(
          `/maintenance/user?propertyId=${activePropertyId}`
        );

        setMaintenanceRequests(res.data || []);

      } catch (err) {
        console.error(err);
      }
    };

    fetchMaintenance();
  }, [activePropertyId]);

  // ================= ACTIVE PROPERTY =================
  const activeProperty = properties.find(
    (p) => p.id === activePropertyId
  );

  // ================= ACTIVE BOOKING =================
  const activeBooking = bookings.find((b) => {
    const room = roomsMap[b.roomId];

    return room?.propertyId === activePropertyId;
  });

  // ================= RENT PAYMENTS =================
  const rentPayments = bookings
    .filter((b) => {
      const room = roomsMap[b.roomId];

      return (
        room &&
        room.propertyId === activePropertyId
      );
    })
    .map((b) => ({
      _id: b.id.toString(),

      // ✅ USE BOOKING AMOUNT
      amount: b.amount,

      dueDate: b.startDate,

      status: "paid" as const,

      month: new Date(b.startDate).toLocaleString(
        "default",
        {
          month: "long",
        }
      ),
    }));

  // ================= EMPTY STATE =================
  if (!loading && bookings.length === 0) {
    return (
      <div className="p-10 text-center space-y-4">
        <h1 className="text-3xl font-bold">
          Welcome to RentAura
        </h1>

        <p className="text-gray-400">
          You don’t have any approved bookings yet.
        </p>

        <a
          href="/browse"
          className="inline-block px-6 py-3 bg-blue-600 rounded-xl hover:bg-blue-500"
        >
          Browse Rooms
        </a>
      </div>
    );
  }

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="p-10 text-center text-gray-400">
        Loading dashboard...
      </div>
    );
  }

  // ================= UI =================
  return (
    <TenantDashboard
      user={{
        _id: "1",

        fullname:
          user?.email?.split("@")[0] || "User",

        email: user?.email || "",

        phone: "N/A",

        unitNumber:
          activeProperty?.title ||
          "No Active Property",
      }}

      properties={properties}

      activePropertyId={activePropertyId}

      setActivePropertyId={setActivePropertyId}

      maintenanceRequests={maintenanceRequests}

      rentPayments={rentPayments}

      leaseInfo={{
        startDate:
          activeBooking?.startDate ||
          new Date().toISOString(),

        endDate:
          activeBooking?.endDate ||
          new Date().toISOString(),

        // ✅ USE BOOKING AMOUNT
        monthlyRent: activeBooking?.amount || 0,

        securityDeposit: activeBooking?.amount
          ? activeBooking.amount * 2
          : 0,
      }}

      notifications={[
        {
          id: 1,
          title: "Booking Approved",
          message:
            "Your booking has been approved successfully.",
        },
      ]}
    />
  );
}