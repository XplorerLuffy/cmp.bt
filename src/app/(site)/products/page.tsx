import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-brand-night">Our Pickles</h1>
      {products.length === 0 ? (
        <p className="text-brand-night/60">No products available yet. Check back soon!</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
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
  );
}
