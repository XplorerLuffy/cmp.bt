import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatBTN } from "@/lib/format";
import AddToCartForm from "@/components/AddToCartForm";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });

  if (!product || !product.isActive) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link href="/products" className="mb-6 inline-block text-sm font-medium text-brand-night/60 hover:text-brand-chili">
        ← Back to Shop
      </Link>
      <div className="grid gap-10 sm:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-br from-brand-moon-soft to-brand-cream">
          {product.imageUrl ? (
            <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-6xl">🫙</div>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-chili">
              {product.category}
            </p>
            <h1 className="font-display text-3xl font-medium text-brand-night">{product.name}</h1>
            <p className="mt-2 font-display text-2xl font-bold text-brand-chili">
              {formatBTN(product.price)}
            </p>
          </div>

          <p className="leading-relaxed text-brand-night/80">{product.description}</p>

          {product.ingredients && (
            <div className="rounded-xl border border-brand-night/10 bg-white p-4">
              <h2 className="mb-1 font-display font-semibold text-brand-night">Ingredients</h2>
              <p className="text-sm text-brand-night/70">{product.ingredients}</p>
            </div>
          )}

          <AddToCartForm
            productId={product.id}
            slug={product.slug}
            name={product.name}
            price={product.price}
            imageUrl={product.imageUrl}
            outOfStock={product.outOfStock}
          />
        </div>
      </div>
    </div>
  );
}
