import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadProductImage } from "@/lib/storage";
import { slugify } from "@/lib/slug";

const SEED_PRODUCTS = [
  {
    image: "oyster-mushroom-soup.webp",
    name: "Oyster Mushroom Soup",
    description:
      "A wholesome dried soup mix made with farm-grown oyster mushrooms from Sarpang, Bhutan. Just add hot water for a comforting, earthy bowl of soup — naturally flavorful with no preservatives or added sugar.",
    ingredients: "Oyster Mushroom, Coriander leaves, Onion leaf, Salt, Garlic powder.",
    price: 30,
    category: "Soup Mix",
    stock: 25,
  },
  {
    image: "pumpkin-soup.webp",
    name: "Pumpkin Soup",
    description:
      "A naturally sweet and savory dried soup mix made from sun-ripened Bhutanese pumpkin. Blended with coriander, onion leaves, garlic and a hint of Sichuan pepper for a warming, no-fuss bowl of soup.",
    ingredients: "Pumpkin powder, coriander leaves, onion leaves, garlic powder, Sichuan pepper, salt.",
    price: 30,
    category: "Soup Mix",
    stock: 25,
  },
  {
    image: "garlic-chilli-pickle.webp",
    name: "Garlic with Chilli Pickle",
    description:
      "A bold, home-style pickle made with whole garlic cloves and green chillies, slow-pickled in oil with mustard seed, fenugreek and turmeric. Naturally preserved and completely chemical-free.",
    ingredients: "Garlic, Green Chilli, Oil, Mustard Seed, Black Salt powder, Salt, Fenugreek, Turmeric.",
    price: 150,
    category: "Garlic Pickle",
    stock: 20,
  },
];

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  if (token !== "ckm9oyster30") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = [];
  for (const p of SEED_PRODUCTS) {
    const baseSlug = slugify(p.name);
    const existing = await prisma.product.findUnique({ where: { slug: baseSlug } });
    if (existing) {
      results.push({ slug: baseSlug, skipped: true });
      continue;
    }

    const fileUrl = new URL(`/seed-images/${p.image}`, request.url);
    const fileRes = await fetch(fileUrl);
    const blob = await fileRes.blob();
    const file = new File([blob], p.image, { type: "image/webp" });
    const imageUrl = await uploadProductImage(file);

    const created = await prisma.product.create({
      data: {
        name: p.name,
        description: p.description,
        ingredients: p.ingredients,
        price: p.price,
        category: p.category,
        stock: p.stock,
        slug: baseSlug,
        imageUrl,
      },
    });
    results.push({ id: created.id, slug: created.slug, imageUrl: created.imageUrl });
  }

  return NextResponse.json({ results });
}
