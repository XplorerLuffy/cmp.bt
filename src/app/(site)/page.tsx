import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import HomeHero from "@/components/HomeHero";
import FadeInSection from "@/components/FadeInSection";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featured = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  return (
    <div>
      <HomeHero />

      <section className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
        <FadeInSection className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-blue">
              Featured
            </p>
            <h2 className="font-display text-2xl font-medium text-brand-ink sm:text-3xl">
              From the Pantry
            </h2>
          </div>
          <Link href="/products" className="text-sm font-medium text-brand-ink/60 hover:text-brand-blue">
            View all →
          </Link>
        </FadeInSection>
        {featured.length === 0 ? (
          <p className="text-brand-ink/60">
            Products coming soon. Check back shortly!
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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

      <section className="border-t border-black/5 bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:grid-cols-3 sm:text-center">
          <FadeInSection delay={0}>
            <Feature
              emoji="🤲"
              title="Handmade in Bhutan"
              text="Every jar is made by hand using recipes passed down through generations."
            />
          </FadeInSection>
          <FadeInSection delay={0.1}>
            <Feature
              emoji="🌿"
              title="Fresh, Local Ingredients"
              text="We source chilies, vegetables, and spices from local Bhutanese farmers."
            />
          </FadeInSection>
          <FadeInSection delay={0.2}>
            <Feature
              emoji="🚚"
              title="Delivered Across Bhutan"
              text="Cash on delivery or bank transfer — order from anywhere in the country."
            />
          </FadeInSection>
        </div>
      </section>
    </div>
  );
}

function Feature({ emoji, title, text }: { emoji: string; title: string; text: string }) {
  return (
    <div className="flex flex-col items-center gap-2 sm:items-center">
      <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-full bg-brand-blue/10 text-2xl">
        {emoji}
      </div>
      <h3 className="font-display font-semibold text-brand-ink">{title}</h3>
      <p className="text-sm text-brand-ink/70">{text}</p>
    </div>
  );
}
