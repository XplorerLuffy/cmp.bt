"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { formatBTN } from "@/lib/format";

export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  outOfStock: boolean;
};

export default function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      whileHover={{ y: -6, scale: 1.015 }}
    >
      <Link
        href={`/products/${product.slug}`}
        className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-brand-blue/10"
      >
        <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-brand-blue-light/20 to-brand-tint">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.imageUrl}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-5xl">🫙</div>
          )}
          {product.outOfStock && (
            <span className="absolute left-2 top-2 rounded-full bg-brand-ink px-2.5 py-1 text-xs font-semibold text-white">
              Out of Stock
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-1 p-4">
          <h3 className="font-display font-semibold text-brand-ink">{product.name}</h3>
          <p className="line-clamp-2 text-sm text-brand-ink/65">{product.description}</p>
          <p className="mt-2 font-display font-bold text-brand-blue">{formatBTN(product.price)}</p>
        </div>
      </Link>
    </motion.div>
  );
}
