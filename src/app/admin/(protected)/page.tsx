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
      <h1 className="mb-6 text-2xl font-bold text-brand-ink">Dashboard</h1>

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

      <div className="rounded-xl border border-brand-ink/10 bg-white p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-brand-ink">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm font-medium text-brand-blue-light hover:underline">
            View all →
          </Link>
        </div>
        {/* Mobile: stacked cards */}
        <div className="flex flex-col gap-2 sm:hidden">
          {recentOrders.map((order) => (
            <Link
              key={order.id}
              href={`/admin/orders/${order.id}`}
              className="block rounded-lg border border-brand-ink/10 p-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-brand-blue-light">{order.orderNumber}</span>
                <span className="font-semibold text-brand-ink">{formatBTN(order.subtotal)}</span>
              </div>
              <p className="text-sm text-brand-ink/70">{order.customerName}</p>
              <div className="mt-1 flex items-center justify-between text-xs text-brand-ink/50">
                <span>{ORDER_STATUS_LABELS[order.status]}</span>
                <span>{order.createdAt.toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
          {recentOrders.length === 0 && (
            <p className="py-6 text-center text-brand-ink/50">No orders yet.</p>
          )}
        </div>

        {/* Desktop: table */}
        <div className="hidden overflow-x-auto sm:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-ink/10 text-left text-brand-ink/60">
                <th className="py-2 pr-4">Order #</th>
                <th className="py-2 pr-4">Customer</th>
                <th className="py-2 pr-4">Total</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-brand-ink/5">
                  <td className="py-2 pr-4">
                    <Link href={`/admin/orders/${order.id}`} className="font-medium text-brand-blue-light hover:underline">
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
                  <td colSpan={5} className="py-6 text-center text-brand-ink/50">
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
    <div className="rounded-xl border border-brand-ink/10 bg-white p-4">
      <p className="text-sm text-brand-ink/60">{label}</p>
      <p className="text-2xl font-bold text-brand-ink">{value}</p>
    </div>
  );
}
