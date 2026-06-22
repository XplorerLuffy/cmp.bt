"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ORDER_STATUS_LABELS } from "@/lib/orders";
import { getStatusSelectStyle } from "@/components/admin/StatusBadge";

export default function InlineStatusSelect({
  orderId,
  status,
}: {
  orderId: string;
  status: string;
}) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);
  const [value, setValue] = useState(status);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newValue = e.target.value;
    setValue(newValue);
    setUpdating(true);
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newValue }),
      });
      router.refresh();
    } finally {
      setUpdating(false);
    }
  }

  return (
    <select
      aria-label="Order status"
      value={value}
      disabled={updating}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => {
        e.stopPropagation();
        handleChange(e);
      }}
      className={`rounded-full border px-2.5 py-1 text-xs font-semibold transition-opacity focus:outline-none focus:ring-2 focus:ring-brand-blue/40 disabled:opacity-60 ${getStatusSelectStyle(
        value
      )}`}
    >
      {Object.entries(ORDER_STATUS_LABELS).map(([val, label]) => (
        <option key={val} value={val}>
          {label}
        </option>
      ))}
    </select>
  );
}
