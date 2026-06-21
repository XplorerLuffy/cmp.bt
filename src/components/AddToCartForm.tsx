"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";

export default function AddToCartForm({
  productId,
  slug,
  name,
  price,
  imageUrl,
  outOfStock,
}: {
  productId: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string | null;
  outOfStock: boolean;
}) {
  const { addItem } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({ productId, slug, name, price, imageUrl }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-brand-ink/70">Quantity</span>
        <div className="flex items-center rounded-full border border-brand-ink/20">
          <button
            type="button"
            className="h-9 w-9 text-lg disabled:opacity-30"
            disabled={outOfStock || quantity <= 1}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            −
          </button>
          <span className="w-8 text-center font-medium">{quantity}</span>
          <button
            type="button"
            className="h-9 w-9 text-lg disabled:opacity-30"
            disabled={outOfStock}
            onClick={() => setQuantity((q) => q + 1)}
          >
            +
          </button>
        </div>
      </div>

      <button
        type="button"
        disabled={outOfStock}
        onClick={handleAdd}
        className="rounded-full bg-brand-ink px-6 py-3 font-display font-semibold text-brand-tint transition hover:bg-brand-blue-light disabled:cursor-not-allowed disabled:opacity-40"
      >
        {outOfStock ? "Out of Stock" : added ? "Added ✓" : "Add to Cart"}
      </button>
      {added && (
        <button
          type="button"
          onClick={() => router.push("/cart")}
          className="text-sm font-medium text-brand-blue hover:underline"
        >
          View Cart →
        </button>
      )}
    </div>
  );
}
