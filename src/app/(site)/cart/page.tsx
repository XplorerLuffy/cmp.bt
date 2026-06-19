"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatBTN } from "@/lib/format";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="mb-4 text-4xl">🛒</p>
        <h1 className="mb-2 text-xl font-bold text-brand-night">Your cart is empty</h1>
        <p className="mb-6 text-brand-night/70">Add some delicious achaar to get started.</p>
        <Link
          href="/products"
          className="rounded-full bg-brand-night px-6 py-3 font-semibold text-brand-cream"
        >
          Shop Pickles
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-brand-night">Your Cart</h1>
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex items-center gap-4 rounded-lg border border-brand-night/10 bg-white p-3"
          >
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded bg-brand-night/5">
              {item.imageUrl ? (
                <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-2xl">🫙</div>
              )}
            </div>
            <div className="flex-1">
              <Link href={`/products/${item.slug}`} className="font-medium text-brand-night hover:underline">
                {item.name}
              </Link>
              <p className="text-sm text-brand-night/60">{formatBTN(item.price)} each</p>
            </div>
            <div className="flex items-center rounded-full border border-brand-night/20">
              <button
                className="h-8 w-8 text-lg"
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
              >
                −
              </button>
              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
              <button
                className="h-8 w-8 text-lg"
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
              >
                +
              </button>
            </div>
            <button
              aria-label="Remove item"
              className="text-brand-night/50 hover:text-red-600"
              onClick={() => removeItem(item.productId)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-brand-night/10 pt-4">
        <span className="text-lg font-semibold text-brand-night">Subtotal</span>
        <span className="text-lg font-bold text-brand-night-light">{formatBTN(subtotal)}</span>
      </div>

      <Link
        href="/checkout"
        className="mt-6 block w-full rounded-full bg-brand-night py-3 text-center font-semibold text-brand-cream"
      >
        Proceed to Checkout
      </Link>
    </div>
  );
}
