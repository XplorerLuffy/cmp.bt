import Link from "next/link";
import Image from "next/image";
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
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-brand-night/10 bg-white shadow-sm transition hover:shadow-lg"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-brand-night/5">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl">🫙</div>
        )}
        {product.outOfStock && (
          <span className="absolute left-2 top-2 rounded bg-brand-night px-2 py-1 text-xs font-semibold text-brand-cream">
            Out of Stock
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-semibold text-brand-night">{product.name}</h3>
        <p className="line-clamp-2 text-sm text-brand-night/70">{product.description}</p>
        <p className="mt-2 font-bold text-brand-night-light">{formatBTN(product.price)}</p>
      </div>
    </Link>
  );
}
