"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCart } from "@/lib/cart-context";
import { formatBTN } from "@/lib/format";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-3xl px-4 py-20 text-center"
      >
        <p className="mb-4 text-5xl">🫙</p>
        <h1 className="mb-2 font-display text-2xl font-medium text-brand-ink">
          Your cart is empty
        </h1>
        <p className="mb-6 text-brand-ink/70">Add some delicious achaar to get started.</p>
        <Link
          href="/products"
          className="rounded-full bg-brand-ink px-6 py-3 font-display font-semibold text-brand-tint transition hover:bg-brand-blue-light"
        >
          Shop Pickles
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-3xl px-4 py-10"
    >
      <h1 className="mb-6 font-display text-2xl font-medium text-brand-ink">Your Cart</h1>
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex flex-wrap items-center gap-3 rounded-xl border border-brand-ink/10 bg-white p-3 sm:flex-nowrap sm:gap-4"
          >
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-brand-blue/10 to-brand-tint">
              {item.imageUrl ? (
                <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-2xl">🫙</div>
              )}
            </div>
            <div className="min-w-[8rem] flex-1 basis-full sm:basis-auto">
              <Link href={`/products/${item.slug}`} className="font-medium text-brand-ink hover:text-brand-blue">
                {item.name}
              </Link>
              <p className="text-sm text-brand-ink/60">{formatBTN(item.price)} each</p>
            </div>
            <div className="flex items-center rounded-full border border-brand-ink/20">
              <button
                className="h-9 w-9 text-lg sm:h-8 sm:w-8"
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
              >
                −
              </button>
              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
              <button
                className="h-9 w-9 text-lg sm:h-8 sm:w-8"
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
              >
                +
              </button>
            </div>
            <button
              aria-label="Remove item"
              className="flex h-9 w-9 items-center justify-center text-brand-ink/40 hover:text-brand-blue"
              onClick={() => removeItem(item.productId)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between rounded-xl border border-brand-ink/10 bg-white p-4">
        <span className="font-display text-lg font-semibold text-brand-ink">Subtotal</span>
        <span className="font-display text-lg font-bold text-brand-blue">{formatBTN(subtotal)}</span>
      </div>

      <Link
        href="/checkout"
        className="mt-6 block w-full rounded-full bg-brand-ink py-3.5 text-center font-display font-semibold text-brand-tint transition hover:bg-brand-blue-light"
      >
        Proceed to Checkout
      </Link>
    </motion.div>
  );
}
