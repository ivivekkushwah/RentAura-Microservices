"use client";

interface BookingUI {
  id: string;
  roomName: string;
  tenantName: string;
  tenantEmail: string;
  bookingAmount: number;
  startDate: string;
  endDate: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

interface Props {
  bookings: BookingUI[];
  summary: {
    totalBookings: number;
  };
}

// ✅ Date formatter
function formatDate(date: string) {
  if (!date) return "N/A";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "Invalid Date";

  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

export function OwnerBookingsTable({ bookings, summary }: Props) {
  return (
    <div className="p-6 space-y-4">

      {/* HEADER */}
      <h1 className="text-xl font-bold">
        Total Bookings: {summary.totalBookings}
      </h1>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border border-zinc-800 rounded">

          <thead className="bg-zinc-800 text-left">
            <tr>
              <th className="p-3">Room</th>
              <th className="p-3">Tenant</th>
              <th className="p-3">Email</th>
              <th className="p-3">Amount</th>

              {/* 🔥 FIXED COLUMN */}
              <th className="p-3">Stay</th>

              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-400">
                  No bookings found
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr
                  key={b.id}
                  className="border-t border-zinc-800"
                >
                  <td className="p-3">{b.roomName}</td>
                  <td className="p-3">{b.tenantName}</td>
                  <td className="p-3">{b.tenantEmail}</td>
                  <td className="p-3">₹{b.bookingAmount}</td>

                  {/* 🔥 FIX: Start → End */}
                  <td className="p-3">
                    {formatDate(b.startDate)} → {formatDate(b.endDate)}
                  </td>

                  {/* STATUS */}
                  <td className="p-3">
                    <StatusBadge status={b.status} />
                  </td>

                  {/* ACTION */}
                  <td className="p-3 text-gray-400">
                    No Action
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}

/* 🔥 STATUS BADGE */
function StatusBadge({ status }: { status: string }) {
  const color =
    status === "APPROVED"
      ? "bg-green-600"
      : status === "REJECTED"
      ? "bg-red-600"
      : "bg-yellow-600";

  return (
    <span className={`px-2 py-1 text-xs rounded ${color}`}>
      {status}
    </span>
  );
}