"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductRowActions({
  productId,
  isActive,
  outOfStock,
}: {
  productId: string;
  isActive: boolean;
  outOfStock: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggle(field: "isActive" | "outOfStock", value: boolean) {
    setBusy(true);
    try {
      const formData = new FormData();
      formData.set(field, String(value));
      const res = await fetch(`/api/products/${productId}`, { method: "PATCH", body: formData });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Could not update product");
        return;
      }
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this product? If it has order history it will be deactivated instead.")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/products/${productId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Could not delete product");
        return;
      }
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-2 text-xs">
      <button
        disabled={busy}
        onClick={() => toggle("outOfStock", !outOfStock)}
        className="rounded border border-brand-ink/20 px-2.5 py-1.5 hover:bg-brand-ink/5"
      >
        {outOfStock ? "Mark In Stock" : "Mark Out of Stock"}
      </button>
      <button
        disabled={busy}
        onClick={() => toggle("isActive", !isActive)}
        className="rounded border border-brand-ink/20 px-2.5 py-1.5 hover:bg-brand-ink/5"
      >
        {isActive ? "Deactivate" : "Activate"}
      </button>
      <button
        disabled={busy}
        onClick={handleDelete}
        className="rounded border border-red-300 px-2.5 py-1.5 text-red-600 hover:bg-red-50"
      >
        Delete
      </button>
    </div>
  );
}
