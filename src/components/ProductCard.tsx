"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { formatBTN } from "@/lib/format";
import { proxyImageUrl } from "@/lib/image";
import { useCart } from "@/lib/cart-context";

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
  const { addItem } = useCart();
  const router = useRouter();

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
      },
      1
    );
  }

  function handleBuyNow(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
      },
      1
    );
    router.push("/cart");
  }

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
            <Image
              src={proxyImageUrl(product.imageUrl) ?? ""}
              alt={product.name}
              fill
              unoptimized
              className="object-cover transition duration-500 group-hover:scale-110"
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
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              disabled={product.outOfStock}
              onClick={handleAddToCart}
              className="flex-1 rounded-full border border-brand-ink/20 px-3 py-2 text-sm font-semibold text-brand-ink transition hover:bg-brand-ink/5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Add to Cart
            </button>
            <button
              type="button"
              disabled={product.outOfStock}
              onClick={handleBuyNow}
              className="flex-1 rounded-full bg-brand-ink px-3 py-2 text-sm font-semibold text-brand-tint transition hover:bg-brand-blue-light disabled:cursor-not-allowed disabled:opacity-40"
            >
              Buy Now
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
