"use client";

interface Tenant {
  id: string;
  name: string;
  email: string;
  room: string;
  rent: number;
  status: string;
}

interface Props {
  tenantsList: Tenant[];
}

export default function TenantsGrid({ tenantsList }: Props) {
  return (
    <div className="p-6 space-y-4">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Tenants</h1>
        <p className="text-gray-400 text-sm">
          Manage tenants living in your rooms
        </p>
      </div>

      {/* EMPTY STATE */}
      {tenantsList.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          No tenants found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-zinc-800 rounded-lg overflow-hidden">

            {/* HEADER */}
            <thead className="bg-zinc-800 text-left text-sm">
              <tr>
                <th className="p-3">Tenant</th>
                <th className="p-3">Email</th>
                <th className="p-3">Room</th>
                <th className="p-3">Rent</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {tenantsList.map((t) => (
                <tr
                  key={t.id}
                  className="border-t border-zinc-800 hover:bg-zinc-900 transition"
                >
                  <td className="p-3 font-medium">{t.name}</td>

                  <td className="p-3 text-sm text-gray-400">
                    {t.email}
                  </td>

                  <td className="p-3">{t.room}</td>

                  <td className="p-3">₹{t.rent}</td>

                  <td className="p-3">
                    <StatusBadge status={t.status} />
                  </td>

                  {/* 🔥 ACTIONS (future ready) */}
                  <td className="p-3">
                    <div className="flex gap-2">

                      <button
                        className="px-2 py-1 text-xs bg-blue-600 rounded hover:bg-blue-500"
                      >
                        View
                      </button>

                      <button
                        className="px-2 py-1 text-xs bg-red-600 rounded hover:bg-red-500"
                      >
                        Remove
                      </button>

                    </div>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
}

/* 🔥 STATUS BADGE */
function StatusBadge({ status }: { status: string }) {
  const color =
    status === "active"
      ? "bg-green-600"
      : "bg-yellow-600";

  return (
    <span className={`px-2 py-1 text-xs rounded ${color}`}>
      {status}
    </span>
  );
}