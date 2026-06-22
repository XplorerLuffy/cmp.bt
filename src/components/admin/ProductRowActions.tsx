"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
  const [confirmingDelete, setConfirmingDelete] = useState(false);

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
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      return;
    }
    setConfirmingDelete(false);
    setBusy(true);
    try {
      const res = await fetch(`/api/products/${productId}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || "Could not delete product");
        return;
      }
      if (data.deactivated) {
        alert("This product has existing orders, so it was deactivated instead of deleted to preserve order history.");
      }
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-2 text-xs">
      <Link
        href={`/admin/products/${productId}/edit`}
        className="rounded border border-brand-blue/30 px-2.5 py-1.5 font-medium text-brand-blue hover:bg-brand-blue/5"
      >
        Edit
      </Link>
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
        type="button"
        disabled={busy}
        onClick={handleDelete}
        className="rounded border border-red-300 px-2.5 py-1.5 text-red-600 hover:bg-red-50"
      >
        {confirmingDelete ? "Confirm Delete?" : "Delete"}
      </button>
      {confirmingDelete && (
        <button
          type="button"
          disabled={busy}
          onClick={() => setConfirmingDelete(false)}
          className="rounded border border-brand-ink/20 px-2.5 py-1.5 hover:bg-brand-ink/5"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
