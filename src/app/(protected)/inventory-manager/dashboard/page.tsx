import { Package, BoxesIcon, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";

export default function InventoryManagerDashboardPage() {
  const kpis = [
    { label: "Total Products", value: "—", icon: Package, color: "bg-teal-500" },
    { label: "Packaging Types", value: "—", icon: BoxesIcon, color: "bg-purple-500" },
    { label: "Stock In (Today)", value: "—", icon: ArrowDownToLine, color: "bg-green-500" },
    { label: "Stock Out (Today)", value: "—", icon: ArrowUpFromLine, color: "bg-red-500" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inventory Manager Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage stock levels, products, and packaging
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="flex items-center gap-4 rounded-xl bg-white p-6 shadow-sm">
            <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${kpi.color}`}>
              <kpi.icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{kpi.label}</p>
              <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        <p className="mt-2 text-sm text-gray-500">
          Inventory Manager features will be implemented here — stock-in/stock-out
          tracking, product management, low-stock alerts, and inventory reporting.
        </p>
      </div>
    </div>
  );
}
