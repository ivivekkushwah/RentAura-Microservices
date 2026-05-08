"use client";

import { useRouter } from "next/navigation";

// ================= TYPES =================
interface OwnerStats {
  totalProperties?: number;
  totalRooms: number;
  bookings: number;
  tenants: number;
}

interface BookingData {
  id: string;
  tenant: string;
  room: string;
  checkIn: string;
  status: string;
  amount: number;
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

interface Props {
  stats: OwnerStats;
  recentBookings: BookingData[];
  tenantsList: TenantData[];
  maintenanceRequests: any[];
}

export default function OwnerDashboardStats({
  stats,
  recentBookings,
  tenantsList,
  maintenanceRequests,
}: Props) {
  return (
    <div className="p-6 space-y-8">

      {/* 🔥 HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Owner Dashboard</h1>
        <p className="text-gray-400 text-sm">
          Manage your properties, rooms, and bookings
        </p>
      </div>

      {/* 🔥 STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Properties" value={stats.totalProperties ?? 0} />
        <StatCard title="Rooms" value={stats.totalRooms} />
        <StatCard title="Bookings" value={stats.bookings} />
        <StatCard title="Tenants" value={stats.tenants} />
      </div>

      {/* 🔥 QUICK ACTIONS */}
      <div className="flex gap-4 flex-wrap">
        <ActionBtn label="+ Add Property" path="/owner/add-property" />
        <ActionBtn label="View Properties" path="/owner/properties" />
        <ActionBtn label="Manage Bookings" path="/owner/bookings" />
      </div>

      {/* 🔥 GRID SECTIONS */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* BOOKINGS */}
        <Card
          title="Recent Bookings"
          action={<ActionLink label="View All" path="/owner/bookings" />}
        >
          {recentBookings.length === 0 ? (
            <Empty text="No bookings yet." />
          ) : (
            recentBookings.slice(0, 5).map((b) => (
              <Row
                key={b.id}
                title={b.tenant}
                subtitle={b.room}
                right={
                  <>
                    <p className="text-sm">{b.checkIn}</p>
                    <StatusBadge status={b.status} />
                  </>
                }
              />
            ))
          )}
        </Card>

        {/* TENANTS */}
        <Card
          title="Tenants"
          action={<ActionLink label="View All" path="/owner/tenants" />}
        >
          {tenantsList.length === 0 ? (
            <Empty text="No tenants yet." />
          ) : (
            tenantsList.slice(0, 5).map((t) => (
              <Row
                key={t.id}
                title={t.name}
                subtitle={`${t.room} • ${t.email}`}
                right={
                  <>
                    <p className="text-sm">₹{t.rent}</p>
                    <StatusBadge status={t.status} />
                  </>
                }
              />
            ))
          )}
        </Card>

      </div>

      {/* 🔥 MAINTENANCE */}
      <Card title="Maintenance Requests">
        {maintenanceRequests.length === 0 ? (
          <Empty text="No maintenance requests." />
        ) : (
          maintenanceRequests.map((m: any) => (
            <div key={m.id} className="p-3 border rounded mb-2">
              <p className="font-medium">{m.issue}</p>
              <p className="text-sm text-gray-400">{m.description}</p>
              <StatusBadge status={m.status} />
            </div>
          ))
        )}
      </Card>

    </div>
  );
}

/* ================= UI COMPONENTS ================= */

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
      <p className="text-sm text-gray-400">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
}

function ActionBtn({ label, path }: { label: string; path: string }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(path)}
      className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
    >
      {label}
    </button>
  );
}

function ActionLink({ label, path }: { label: string; path: string }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(path)}
      className="text-sm text-blue-400 hover:underline"
    >
      {label}
    </button>
  );
}

function Card({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="border border-zinc-800 rounded-xl p-4 space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

function Row({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle: string;
  right: React.ReactNode;
}) {
  return (
    <div className="flex justify-between items-center border-b border-zinc-800 py-2">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-gray-400">{subtitle}</p>
      </div>
      <div className="text-right">{right}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const color =
    status === "APPROVED" || status === "active"
      ? "bg-green-600"
      : status === "REJECTED"
      ? "bg-red-600"
      : "bg-yellow-600";

  return (
    <span className={`text-xs px-2 py-1 rounded ${color}`}>
      {status}
    </span>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="text-gray-400 text-sm">{text}</p>;
}