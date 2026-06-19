import Image from "next/image";
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
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="grid gap-8 sm:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-brand-night/5">
          {product.imageUrl ? (
            <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-6xl">🫙</div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-brand-night-light">
              {product.category}
            </p>
            <h1 className="text-2xl font-bold text-brand-night">{product.name}</h1>
            <p className="mt-2 text-xl font-bold text-brand-night-light">
              {formatBTN(product.price)}
            </p>
          </div>

          <p className="text-brand-night/80">{product.description}</p>

          {product.ingredients && (
            <div>
              <h2 className="font-semibold text-brand-night">Ingredients</h2>
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
