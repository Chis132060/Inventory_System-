import { Users, Package, BoxesIcon, Activity } from "lucide-react";
import { getUserCount, getUserCountByRole } from "@/lib/services/users.service";
import { getProductCount } from "@/lib/services/products.service";
import { getPackagingCount } from "@/lib/services/packaging.service";
import { getRecentAuditLogs } from "@/lib/services/audit.service";

export default async function AdminDashboardPage() {
  const [totalUsers, pendingUsers, totalProducts, totalPackaging, recentLogs] =
    await Promise.all([
      getUserCount(),
      getUserCountByRole("UNASSIGNED"),
      getProductCount(),
      getPackagingCount(),
      getRecentAuditLogs(10),
    ]);

  const kpis = [
    {
      label: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      label: "Pending Approval",
      value: pendingUsers,
      icon: Users,
      color: "bg-amber-500",
    },
    {
      label: "Products",
      value: totalProducts,
      icon: Package,
      color: "bg-green-500",
    },
    {
      label: "Packaging Types",
      value: totalPackaging,
      icon: BoxesIcon,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your inventory system
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="flex items-center gap-4 rounded-xl bg-white p-6 shadow-sm"
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-lg ${kpi.color}`}
            >
              <kpi.icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{kpi.label}</p>
              <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Activity
          </h2>
        </div>

        {recentLogs.length === 0 ? (
          <p className="text-sm text-gray-500">
            No recent activity. Actions like role changes and product updates
            will appear here.
          </p>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex items-center gap-4 py-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                  <Activity className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">
                      {log.actor?.full_name || log.actor?.email || "System"}
                    </span>{" "}
                    performed{" "}
                    <span className="font-medium">{log.action}</span> on{" "}
                    <span className="font-medium">{log.entity}</span>
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(log.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
