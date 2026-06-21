"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ORDER_STATUS_LABELS } from "@/lib/orders";

export default function OrderStatusControls({
  orderId,
  status,
  paymentMethod,
  paymentVerified,
}: {
  orderId: string;
  status: string;
  paymentMethod: string;
  paymentVerified: boolean;
}) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);

  async function updateOrder(data: Record<string, unknown>) {
    setUpdating(true);
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      router.refresh();
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-brand-ink/80">Order Status</span>
        <select
          disabled={updating}
          className="rounded-lg border border-brand-ink/15 p-2 text-sm focus:border-brand-blue focus:outline-none"
          value={status}
          onChange={(e) => updateOrder({ status: e.target.value })}
        >
          {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>

      {paymentMethod === "BANK_TRANSFER" && (
        <label className="flex items-center gap-2 rounded-lg bg-brand-ink/5 p-2.5">
          <input
            type="checkbox"
            disabled={updating}
            checked={paymentVerified}
            onChange={(e) => updateOrder({ paymentVerified: e.target.checked })}
            className="h-4 w-4 accent-brand-blue"
          />
          <span className="text-sm font-medium text-brand-ink/80">
            Bank transfer payment verified/received
          </span>
        </label>
      )}
    </div>
  );
}
