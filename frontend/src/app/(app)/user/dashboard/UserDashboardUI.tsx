"use client";

interface Property {
  id: number;
  title: string;
  location: string;
  images?: string[];
}

interface TenantDashboardProps {
  user: {
    _id: string;
    fullname: string;
    email: string;
    phone: string;
    unitNumber: string;
  };

  properties: Property[];

  activePropertyId: number | null;

  setActivePropertyId: (id: number) => void;

  maintenanceRequests: {
    id: number;
    issue: string;
    description: string;
    status: string;
  }[];

  rentPayments: any[];

  leaseInfo: any;

  notifications: any[];
}

export default function TenantDashboard({
  user,
  properties,
  activePropertyId,
  setActivePropertyId,
  maintenanceRequests,
  rentPayments,
  leaseInfo,
  notifications,
}: TenantDashboardProps) {
  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">
          Welcome, {user.fullname}
        </h1>

        <p className="text-gray-400 mt-1">
          Manage your bookings and stay details
        </p>
      </div>

      {/* EMPTY STATE */}
      {properties.length === 0 ? (
        <div className="border border-zinc-800 rounded-xl p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">
            No Approved Bookings
          </h2>

          <p className="text-gray-400 mb-4">
            Browse rooms and book your next stay.
          </p>

          <a
            href="/browse"
            className="inline-block px-4 py-2 bg-blue-600 rounded"
          >
            Browse Rooms
          </a>
        </div>
      ) : (
        <>
          {/* PROPERTY SELECTOR */}
          <div className="flex gap-2 flex-wrap">
            {properties.map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePropertyId(p.id)}
                className={`px-4 py-2 rounded border transition ${
                  activePropertyId === p.id
                    ? "bg-blue-600 border-blue-600"
                    : "bg-zinc-900 border-zinc-700"
                }`}
              >
                {p.title}
              </button>
            ))}
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            <SimpleCard
              title="Monthly Rent"
              value={`₹${leaseInfo.monthlyRent || 0}`}
            />

            <SimpleCard
              title="Payments"
              value={`${rentPayments.length}`}
            />

            <SimpleCard
              title="Maintenance"
              value={`${maintenanceRequests.length}`}
            />

            <SimpleCard
              title="Notifications"
              value={`${notifications.length}`}
            />

          </div>

          {/* RENT PAYMENTS */}
          <div className="border border-zinc-800 rounded-xl p-4">

            <h2 className="text-xl font-semibold mb-4">
              Rent Payments
            </h2>

            {rentPayments.length === 0 ? (
              <p className="text-gray-400">
                No payments found.
              </p>
            ) : (
              <div className="space-y-3">

                {rentPayments.map((payment: any) => (
                  <div
                    key={payment._id}
                    className="border border-zinc-800 rounded-lg p-3 flex justify-between items-center"
                  >

                    <div>
                      <p className="font-medium">
                        {payment.month}
                      </p>

                      <p className="text-sm text-gray-400">
                        {new Date(
                          payment.dueDate
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">
                        ₹{payment.amount}
                      </p>

                      <span className="text-xs bg-green-600 px-2 py-1 rounded">
                        PAID
                      </span>
                    </div>

                  </div>
                ))}

              </div>
            )}

          </div>

          {/* MAINTENANCE */}
          <div className="border border-zinc-800 rounded-xl p-4">

            <h2 className="text-xl font-semibold mb-4">
              Maintenance Requests
            </h2>

            {maintenanceRequests.length === 0 ? (
              <p className="text-gray-400">
                No maintenance requests.
              </p>
            ) : (
              <div className="space-y-3">

                {maintenanceRequests.map((m) => (
                  <div
                    key={m.id}
                    className="border border-zinc-800 rounded-lg p-3"
                  >

                    <div className="flex justify-between items-start">

                      <div>
                        <p className="font-medium">
                          {m.issue}
                        </p>

                        <p className="text-sm text-gray-400">
                          {m.description}
                        </p>
                      </div>

                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          m.status === "RESOLVED"
                            ? "bg-green-600"
                            : m.status === "PENDING"
                            ? "bg-yellow-600"
                            : "bg-red-600"
                        }`}
                      >
                        {m.status}
                      </span>

                    </div>

                  </div>
                ))}

              </div>
            )}

          </div>

          {/* LEASE INFO */}
          <div className="border border-zinc-800 rounded-xl p-4">

            <h2 className="text-xl font-semibold mb-4">
              Lease Information
            </h2>

            <div className="grid md:grid-cols-3 gap-4">

              <SimpleCard
                title="Lease Start"
                value={new Date(
                  leaseInfo.startDate
                ).toLocaleDateString()}
              />

              <SimpleCard
                title="Lease End"
                value={new Date(
                  leaseInfo.endDate
                ).toLocaleDateString()}
              />

              <SimpleCard
                title="Security Deposit"
                value={`₹${leaseInfo.securityDeposit}`}
              />

            </div>

          </div>
        </>
      )}
    </div>
  );
}

/* ================= SIMPLE CARD ================= */

function SimpleCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-900">

      <p className="text-sm text-gray-400">
        {title}
      </p>

      <h2 className="text-xl font-bold mt-1">
        {value}
      </h2>

    </div>
  );
}