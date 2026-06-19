import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatBTN } from "@/lib/format";
import { ORDER_STATUS_LABELS } from "@/lib/orders";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [orders, statusCounts, revenueAgg, recentOrders] = await Promise.all([
    prisma.order.count(),
    prisma.order.groupBy({ by: ["status"], _count: { status: true } }),
    prisma.order.aggregate({
      _sum: { subtotal: true },
      where: { status: { not: "CANCELLED" } },
    }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const countsByStatus = Object.fromEntries(
    statusCounts.map((s) => [s.status, s._count.status])
  );

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-brand-night">Dashboard</h1>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Orders" value={orders.toString()} />
        <StatCard
          label="Total Revenue"
          value={formatBTN(revenueAgg._sum.subtotal ?? 0)}
        />
        <StatCard
          label="Pending Verification"
          value={(countsByStatus.PENDING_PAYMENT_VERIFICATION ?? 0).toString()}
        />
        <StatCard label="Processing" value={(countsByStatus.PROCESSING ?? 0).toString()} />
      </div>

      <div className="rounded-xl border border-brand-night/10 bg-white p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-brand-night">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm font-medium text-brand-night-light hover:underline">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-night/10 text-left text-brand-night/60">
                <th className="py-2 pr-4">Order #</th>
                <th className="py-2 pr-4">Customer</th>
                <th className="py-2 pr-4">Total</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-brand-night/5">
                  <td className="py-2 pr-4">
                    <Link href={`/admin/orders/${order.id}`} className="font-medium text-brand-night-light hover:underline">
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="py-2 pr-4">{order.customerName}</td>
                  <td className="py-2 pr-4">{formatBTN(order.subtotal)}</td>
                  <td className="py-2 pr-4">{ORDER_STATUS_LABELS[order.status]}</td>
                  <td className="py-2 pr-4">{order.createdAt.toLocaleDateString()}</td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-brand-night/50">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-brand-night/10 bg-white p-4">
      <p className="text-sm text-brand-night/60">{label}</p>
      <p className="text-2xl font-bold text-brand-night">{value}</p>
    </div>
  );
}
