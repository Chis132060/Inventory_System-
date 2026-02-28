import { ShoppingCart, Users, Receipt, TrendingUp } from "lucide-react";

export default function SalesmanDashboardPage() {
  const kpis = [
    { label: "Orders Today", value: "—", icon: ShoppingCart, color: "bg-orange-500" },
    { label: "Customers", value: "—", icon: Users, color: "bg-blue-500" },
    { label: "Pending Invoices", value: "—", icon: Receipt, color: "bg-amber-500" },
    { label: "Sales (MTD)", value: "—", icon: TrendingUp, color: "bg-green-500" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Salesman Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track your sales, customers, and order pipeline
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
          Salesman features will be implemented here — create orders, manage
          customer database, generate invoices, and track commissions.
        </p>
      </div>
    </div>
  );
}
