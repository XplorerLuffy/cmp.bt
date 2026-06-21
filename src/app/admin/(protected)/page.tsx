import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatBTN } from "@/lib/format";
import { ORDER_STATUS_LABELS } from "@/lib/orders";
import StatusBadge from "@/components/admin/StatusBadge";
import { WalletIcon, ReceiptIcon, ClockIcon, SpinnerArrowsIcon } from "@/components/admin/icons";

export const dynamic = "force-dynamic";

const STATUS_BAR_COLORS: Record<string, string> = {
  PENDING_PAYMENT_VERIFICATION: "bg-accent-amber",
  CONFIRMED: "bg-brand-blue-light",
  PROCESSING: "bg-brand-blue",
  OUT_FOR_DELIVERY: "bg-accent-amber",
  DELIVERED: "bg-accent-green",
  CANCELLED: "bg-accent-rose",
};

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

  const pendingCount = countsByStatus.PENDING_PAYMENT_VERIFICATION ?? 0;
  const processingCount = countsByStatus.PROCESSING ?? 0;
  const pendingPct = orders > 0 ? Math.round((pendingCount / orders) * 100) : 0;
  const processingPct = orders > 0 ? Math.round((processingCount / orders) * 100) : 0;

  const statusBreakdown = Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
    count: countsByStatus[value] ?? 0,
  }));
  const maxStatusCount = Math.max(1, ...statusBreakdown.map((s) => s.count));

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-brand-ink">Dashboard</h1>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Orders"
          value={orders.toString()}
          icon={<ReceiptIcon className="h-5 w-5" />}
          badgeClass="bg-brand-blue/10 text-brand-blue"
        />
        <StatCard
          label="Total Revenue"
          value={formatBTN(revenueAgg._sum.subtotal ?? 0)}
          icon={<WalletIcon className="h-5 w-5" />}
          badgeClass="bg-accent-green-tint text-accent-green"
        />
        <StatCard
          label="Pending Verification"
          value={pendingCount.toString()}
          sub={orders > 0 ? `${pendingPct}% of orders` : undefined}
          icon={<ClockIcon className="h-5 w-5" />}
          badgeClass="bg-accent-amber-tint text-accent-amber"
        />
        <StatCard
          label="Processing"
          value={processingCount.toString()}
          sub={orders > 0 ? `${processingPct}% of orders` : undefined}
          icon={<SpinnerArrowsIcon className="h-5 w-5" />}
          badgeClass="bg-brand-blue-light/15 text-brand-blue-dark"
        />
      </div>

      <div className="mb-8 grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-brand-ink/10 bg-white p-4 shadow-sm lg:col-span-1">
          <h2 className="mb-4 font-semibold text-brand-ink">Orders by Status</h2>
          <div className="flex flex-col gap-3">
            {statusBreakdown.map((s) => (
              <div key={s.value}>
                <div className="mb-1 flex items-center justify-between text-xs text-brand-ink/60">
                  <span>{s.label}</span>
                  <span className="font-medium text-brand-ink">{s.count}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-brand-ink/5">
                  <div
                    className={`h-full rounded-full ${STATUS_BAR_COLORS[s.value] ?? "bg-brand-ink/30"}`}
                    style={{ width: `${(s.count / maxStatusCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-brand-ink/10 bg-white p-4 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-brand-ink">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm font-medium text-brand-blue hover:underline">
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
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <InitialsAvatar name={order.customerName} />
                    <div>
                      <p className="font-medium text-brand-ink">{order.orderNumber}</p>
                      <p className="text-xs text-brand-ink/60">{order.customerName}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-brand-ink">{formatBTN(order.subtotal)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <StatusBadge status={order.status} />
                  <span className="text-xs text-brand-ink/50">{order.createdAt.toLocaleDateString()}</span>
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
                  <th className="py-2 pr-4">Customer</th>
                  <th className="py-2 pr-4">Order #</th>
                  <th className="py-2 pr-4">Total</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-brand-ink/5">
                    <td className="py-2.5 pr-4">
                      <div className="flex items-center gap-2">
                        <InitialsAvatar name={order.customerName} />
                        <span className="font-medium text-brand-ink">{order.customerName}</span>
                      </div>
                    </td>
                    <td className="py-2.5 pr-4">
                      <Link href={`/admin/orders/${order.id}`} className="font-medium text-brand-blue hover:underline">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="py-2.5 pr-4">{formatBTN(order.subtotal)}</td>
                    <td className="py-2.5 pr-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="py-2.5 pr-4 text-brand-ink/60">{order.createdAt.toLocaleDateString()}</td>
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
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  icon,
  badgeClass,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  badgeClass: string;
}) {
  return (
    <div className="rounded-xl border border-brand-ink/10 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-brand-ink/60">{label}</p>
        <span className={`flex h-9 w-9 items-center justify-center rounded-full ${badgeClass}`}>{icon}</span>
      </div>
      <p className="text-2xl font-bold text-brand-ink">{value}</p>
      {sub && <p className="mt-1 text-xs text-brand-ink/50">{sub}</p>}
    </div>
  );
}

function InitialsAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-blue/10 text-xs font-semibold text-brand-blue-dark">
      {initials || "?"}
    </span>
  );
}
