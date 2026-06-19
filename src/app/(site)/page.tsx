import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import MoonMark from "@/components/MoonMark";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featured = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  return (
    <div>
      <section className="starfield relative overflow-hidden bg-gradient-to-b from-brand-night via-brand-night to-brand-night-light text-brand-cream">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-20 text-center sm:py-28">
          <MoonMark className="h-12 w-12 text-brand-moon" />
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-moon">
            Handmade in Bhutan
          </p>
          <h1 className="max-w-2xl font-display text-4xl font-medium leading-tight sm:text-6xl">
            Achaar, crafted under
            <br />
            a crystal moon.
          </h1>
          <p className="max-w-xl text-brand-cream/75 sm:text-lg">
            Small-batch Bhutanese pickles made with traditional family recipes, fresh local
            chilies, and a whole lot of patience.
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/products"
              className="rounded-full bg-brand-moon px-7 py-3 font-display font-semibold text-brand-night shadow-lg shadow-black/20 transition hover:bg-brand-moon-soft"
            >
              Shop Our Pickles
            </Link>
            <Link
              href="/about"
              className="rounded-full border border-brand-cream/30 px-7 py-3 font-medium text-brand-cream transition hover:border-brand-moon hover:text-brand-moon"
            >
              Our Story
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-chili">
              Featured
            </p>
            <h2 className="font-display text-2xl font-medium text-brand-night sm:text-3xl">
              From the Pantry
            </h2>
          </div>
          <Link href="/products" className="text-sm font-medium text-brand-night-light hover:text-brand-chili">
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

      <section className="border-t border-brand-night/10 bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:grid-cols-3 sm:text-center">
          <Feature
            emoji="🤲"
            title="Handmade in Bhutan"
            text="Every jar is made by hand using recipes passed down through generations."
          />
          <Feature
            emoji="🌿"
            title="Fresh, Local Ingredients"
            text="We source chilies, vegetables, and spices from local Bhutanese farmers."
          />
          <Feature
            emoji="🚚"
            title="Delivered Across Bhutan"
            text="Cash on delivery or bank transfer — order from anywhere in the country."
          />
        </div>
      </section>
    </div>
  );
}

function Feature({ emoji, title, text }: { emoji: string; title: string; text: string }) {
  return (
    <div className="flex flex-col items-center gap-2 sm:items-center">
      <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-full bg-brand-moon-soft text-2xl">
        {emoji}
      </div>
      <h3 className="font-display font-semibold text-brand-night">{title}</h3>
      <p className="text-sm text-brand-night/70">{text}</p>
    </div>
  );
}
