import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatBTN } from "@/lib/format";
import OrderStatusControls from "@/components/OrderStatusControls";
import StatusBadge from "@/components/admin/StatusBadge";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="mb-1 text-2xl font-bold text-brand-ink">Order #{order.orderNumber}</h1>
          <p className="text-sm text-brand-ink/60">Placed on {order.createdAt.toLocaleString()}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-brand-ink/10 bg-white p-4 shadow-sm">
          <h2 className="mb-2 font-semibold text-brand-ink">Customer Details</h2>
          <p className="text-sm">{order.customerName}</p>
          <p className="text-sm">{order.phone}</p>
          {order.email && <p className="text-sm">{order.email}</p>}
          <p className="text-sm">{order.address}, {order.dzongkhag}</p>
          {order.notes && (
            <p className="mt-2 text-sm text-brand-ink/70">Notes: {order.notes}</p>
          )}
        </div>

        <div className="rounded-xl border border-brand-ink/10 bg-white p-4 shadow-sm">
          <h2 className="mb-2 font-semibold text-brand-ink">Update Order</h2>
          <OrderStatusControls
            orderId={order.id}
            status={order.status}
            paymentMethod={order.paymentMethod}
            paymentVerified={order.paymentVerified}
          />
        </div>
      </div>

      <div className="rounded-xl border border-brand-ink/10 bg-white p-4 shadow-sm">
        <h2 className="mb-3 font-semibold text-brand-ink">Items</h2>
        <ul className="flex flex-col gap-2 border-b border-brand-ink/10 pb-3">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between text-sm">
              <span>{item.name} × {item.quantity}</span>
              <span>{formatBTN(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between font-bold text-brand-ink">
          <span>Total</span>
          <span>{formatBTN(order.subtotal)}</span>
        </div>
        <p className="mt-2 text-sm text-brand-ink/60">
          Payment: {order.paymentMethod === "COD" ? "Cash on Delivery" : "Bank Transfer"}
        </p>
      </div>
    </div>
  );
}
