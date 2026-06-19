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
      className="group flex flex-col overflow-hidden rounded-2xl border border-brand-night/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-brand-moon-soft to-brand-cream">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl">🫙</div>
        )}
        {product.outOfStock && (
          <span className="absolute left-2 top-2 rounded-full bg-brand-night px-2.5 py-1 text-xs font-semibold text-brand-cream">
            Out of Stock
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-display font-semibold text-brand-night">{product.name}</h3>
        <p className="line-clamp-2 text-sm text-brand-night/65">{product.description}</p>
        <p className="mt-2 font-display font-bold text-brand-chili">{formatBTN(product.price)}</p>
      </div>
    </Link>
  );
}
