import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featured = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  return (
    <div>
      <section className="bg-brand-night text-brand-cream">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-16 text-center sm:py-24">
          <span className="text-5xl">🌙</span>
          <h1 className="text-3xl font-bold sm:text-5xl">
            Crystal Moon Products
          </h1>
          <p className="max-w-xl text-brand-cream/80 sm:text-lg">
            Handmade Bhutanese achaar, crafted in small batches with traditional recipes,
            fresh local ingredients, and a whole lot of love. Tangy, spicy, and unmistakably
            Bhutanese.
          </p>
          <Link
            href="/products"
            className="rounded-full bg-brand-moon px-6 py-3 font-semibold text-brand-night shadow hover:opacity-90"
          >
            Shop Our Pickles
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-brand-night">Featured Pickles</h2>
          <Link href="/products" className="text-sm font-medium text-brand-night-light hover:underline">
            View all →
          </Link>
        </div>
        {featured.length === 0 ? (
          <p className="text-brand-night/60">
            Products coming soon. Check back shortly!
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((p) => (
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
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 sm:text-center">
          <div>
            <div className="mb-2 text-3xl">🤲</div>
            <h3 className="font-semibold text-brand-night">Handmade in Bhutan</h3>
            <p className="text-sm text-brand-night/70">
              Every jar is made by hand using recipes passed down through generations.
            </p>
          </div>
          <div>
            <div className="mb-2 text-3xl">🌿</div>
            <h3 className="font-semibold text-brand-night">Fresh, Local Ingredients</h3>
            <p className="text-sm text-brand-night/70">
              We source chilies, vegetables, and spices from local Bhutanese farmers.
            </p>
          </div>
          <div>
            <div className="mb-2 text-3xl">🚚</div>
            <h3 className="font-semibold text-brand-night">Delivered Across Bhutan</h3>
            <p className="text-sm text-brand-night/70">
              Cash on delivery or bank transfer — order from anywhere in the country.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
