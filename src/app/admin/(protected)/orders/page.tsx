import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatBTN } from "@/lib/format";
import { ORDER_STATUS_LABELS } from "@/lib/orders";
import InlineStatusSelect from "@/components/admin/InlineStatusSelect";
import type { OrderStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const [orders, statusCounts] = await Promise.all([
    prisma.order.findMany({
      where: status ? { status: status as OrderStatus } : undefined,
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.groupBy({ by: ["status"], _count: { status: true } }),
  ]);

  const countsByStatus = Object.fromEntries(
    statusCounts.map((s) => [s.status, s._count.status])
  );
  const totalOrders = statusCounts.reduce((sum, s) => sum + s._count.status, 0);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-brand-ink">Orders</h1>

      <div className="mb-4 flex flex-wrap gap-2">
        <FilterChip label="All" count={totalOrders} status={undefined} active={!status} />
        {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
          <FilterChip
            key={value}
            label={label}
            count={countsByStatus[value] ?? 0}
            status={value}
            active={status === value}
          />
        ))}
      </div>

      {/* Mobile: stacked cards */}
      <div className="flex flex-col gap-3 sm:hidden">
        {orders.map((order) => (
          <div
            key={order.id}
            className="block rounded-xl border border-brand-ink/10 bg-white p-4 shadow-sm"
          >
            <div className="mb-1 flex items-center justify-between">
              <Link href={`/admin/orders/${order.id}`} className="font-medium text-brand-blue hover:underline">
                {order.orderNumber}
              </Link>
              <span className="font-semibold text-brand-ink">{formatBTN(order.subtotal)}</span>
            </div>
            <p className="text-sm text-brand-ink/80">{order.customerName}</p>
            <div className="mt-2 flex items-center justify-between text-xs text-brand-ink/60">
              <span>{order.paymentMethod === "COD" ? "COD" : "Bank Transfer"}</span>
              <span>{order.createdAt.toLocaleDateString()}</span>
            </div>
            <div className="mt-2">
              <InlineStatusSelect orderId={order.id} status={order.status} />
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <p className="rounded-xl border border-brand-ink/10 bg-white p-6 text-center text-brand-ink/50 shadow-sm">
            No orders found.
          </p>
        )}
      </div>

      {/* Desktop: table */}
      <div className="hidden overflow-x-auto rounded-xl border border-brand-ink/10 bg-white shadow-sm sm:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-ink/10 text-left text-brand-ink/60">
              <th className="p-3">Order #</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-brand-ink/5">
                <td className="p-3">
                  <Link href={`/admin/orders/${order.id}`} className="font-medium text-brand-blue hover:underline">
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="p-3">{order.customerName}</td>
                <td className="p-3">{order.paymentMethod === "COD" ? "COD" : "Bank Transfer"}</td>
                <td className="p-3">{formatBTN(order.subtotal)}</td>
                <td className="p-3">
                  <InlineStatusSelect orderId={order.id} status={order.status} />
                </td>
                <td className="p-3 text-brand-ink/60">{order.createdAt.toLocaleDateString()}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-brand-ink/50">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FilterChip({
  label,
  count,
  status,
  active,
}: {
  label: string;
  count: number;
  status?: string;
  active: boolean;
}) {
  return (
    <Link
      href={status ? `/admin/orders?status=${status}` : "/admin/orders"}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
        active ? "bg-brand-ink text-brand-tint" : "bg-brand-ink/5 text-brand-ink/70 hover:bg-brand-ink/10"
      }`}
    >
      {label}
      <span
        className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
          active ? "bg-white/20" : "bg-white text-brand-ink/60"
        }`}
      >
        {count}
      </span>
    </Link>
  );
}
