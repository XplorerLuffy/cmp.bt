import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import FadeInSection from "@/components/FadeInSection";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="border-b border-brand-ink/10 bg-white">
        <FadeInSection className="mx-auto max-w-6xl px-4 py-10 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-blue">
            The Collection
          </p>
          <h1 className="font-display text-3xl font-medium text-brand-ink sm:text-4xl">
            Our Pickles
          </h1>
        </FadeInSection>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10">
        {products.length === 0 ? (
          <p className="text-brand-ink/60">No products available yet. Check back soon!</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={{
                  id: p.id,
                  slug: p.slug,
                  name: p.name,
                  description: p.description,
                  price: p.price,
                  imageUrl: p.imageUrl,
                  outOfStock: p.outOfStock,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
