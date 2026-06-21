import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatBTN } from "@/lib/format";
import { ORDER_STATUS_LABELS } from "@/lib/orders";
import type { OrderStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const orders = await prisma.order.findMany({
    where: status ? { status: status as OrderStatus } : undefined,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-brand-ink">Orders</h1>

      <div className="mb-4 flex flex-wrap gap-2">
        <FilterLink label="All" status={undefined} active={!status} />
        {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
          <FilterLink key={value} label={label} status={value} active={status === value} />
        ))}
      </div>

      {/* Mobile: stacked cards */}
      <div className="flex flex-col gap-3 sm:hidden">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/admin/orders/${order.id}`}
            className="block rounded-xl border border-brand-ink/10 bg-white p-4"
          >
            <div className="mb-1 flex items-center justify-between">
              <span className="font-medium text-brand-blue-light">{order.orderNumber}</span>
              <span className="font-semibold text-brand-ink">{formatBTN(order.subtotal)}</span>
            </div>
            <p className="text-sm text-brand-ink/80">{order.customerName}</p>
            <div className="mt-2 flex items-center justify-between text-xs text-brand-ink/60">
              <span>{order.paymentMethod === "COD" ? "COD" : "Bank Transfer"}</span>
              <span>{order.createdAt.toLocaleDateString()}</span>
            </div>
            <p className="mt-2 inline-block rounded-full bg-brand-ink/5 px-2 py-1 text-xs font-medium text-brand-ink">
              {ORDER_STATUS_LABELS[order.status]}
            </p>
          </Link>
        ))}
        {orders.length === 0 && (
          <p className="rounded-xl border border-brand-ink/10 bg-white p-6 text-center text-brand-ink/50">
            No orders found.
          </p>
        )}
      </div>

      {/* Desktop: table */}
      <div className="hidden overflow-x-auto rounded-xl border border-brand-ink/10 bg-white sm:block">
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
                  <Link href={`/admin/orders/${order.id}`} className="font-medium text-brand-blue-light hover:underline">
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="p-3">{order.customerName}</td>
                <td className="p-3">{order.paymentMethod === "COD" ? "COD" : "Bank Transfer"}</td>
                <td className="p-3">{formatBTN(order.subtotal)}</td>
                <td className="p-3">{ORDER_STATUS_LABELS[order.status]}</td>
                <td className="p-3">{order.createdAt.toLocaleDateString()}</td>
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

function FilterLink({
  label,
  status,
  active,
}: {
  label: string;
  status?: string;
  active: boolean;
}) {
  return (
    <Link
      href={status ? `/admin/orders?status=${status}` : "/admin/orders"}
      className={`rounded-full px-3 py-1.5 text-xs font-medium ${
        active ? "bg-brand-ink text-brand-tint" : "bg-brand-ink/5 text-brand-ink/70"
      }`}
    >
      {label}
    </Link>
  );
}
