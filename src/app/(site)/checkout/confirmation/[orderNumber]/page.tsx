import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatBTN } from "@/lib/format";
import { ORDER_STATUS_LABELS } from "@/lib/orders";
import FadeInSection from "@/components/FadeInSection";

export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });

  if (!order) notFound();

  return (
    <FadeInSection className="mx-auto max-w-2xl px-4 py-16 text-center">
      <p className="mb-3 text-5xl">🌙</p>
      <h1 className="mb-2 font-display text-2xl font-medium text-brand-ink">
        Thank you, {order.customerName}!
      </h1>
      <p className="mb-8 text-brand-ink/70">
        Your order has been placed. We&apos;ll contact you at {order.phone} to confirm delivery.
      </p>

      <div className="rounded-2xl border border-brand-ink/10 bg-white p-6 text-left">
        <div className="mb-4 flex items-center justify-between">
          <span className="font-display font-semibold text-brand-ink">Order #{order.orderNumber}</span>
          <span className="rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-semibold text-brand-ink">
            {ORDER_STATUS_LABELS[order.status]}
          </span>
        </div>

        <ul className="mb-4 flex flex-col gap-2 border-b border-brand-ink/10 pb-4">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between text-sm">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{formatBTN(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>

        <div className="flex justify-between font-display font-bold text-brand-ink">
          <span>Total</span>
          <span className="text-brand-blue">{formatBTN(order.subtotal)}</span>
        </div>

        <div className="mt-4 text-sm text-brand-ink/70">
          <p>Payment Method: {order.paymentMethod === "COD" ? "Cash on Delivery" : "Bank Transfer"}</p>
          <p>Delivery Address: {order.address}, {order.dzongkhag}</p>
        </div>
      </div>

      <Link href="/products" className="mt-6 inline-block font-medium text-brand-blue-light hover:text-brand-blue">
        ← Continue Shopping
      </Link>
    </FadeInSection>
  );
}
