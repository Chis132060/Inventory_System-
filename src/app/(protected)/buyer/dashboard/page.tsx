import { ShoppingBag, Truck, FileText, BarChart3 } from "lucide-react";

export default function BuyerDashboardPage() {
  const kpis = [
    { label: "Open POs", value: "—", icon: ShoppingBag, color: "bg-cyan-500" },
    { label: "Suppliers", value: "—", icon: Truck, color: "bg-blue-500" },
    { label: "Pending Receiving", value: "—", icon: FileText, color: "bg-amber-500" },
    { label: "Spend (MTD)", value: "—", icon: BarChart3, color: "bg-red-500" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Buyer Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage purchase orders, suppliers, and goods receiving
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
          Buyer features will be implemented here — create purchase orders,
          manage supplier database, track deliveries, and analyze spend.
        </p>
      </div>
    </div>
  );
}
