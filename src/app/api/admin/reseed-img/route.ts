import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadProductImage, deleteProductImage } from "@/lib/storage";

export const dynamic = "force-dynamic";

const MAP = [
  { slug: "oyster-mushroom-soup", image: "oyster-mushroom-soup.webp" },
  { slug: "pumpkin-soup", image: "pumpkin-soup.webp" },
  { slug: "garlic-with-chilli-pickle", image: "garlic-chilli-pickle.webp" },
];

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get("token") !== "ckm9oyster30") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = [];
  for (const m of MAP) {
    const product = await prisma.product.findUnique({ where: { slug: m.slug } });
    if (!product) {
      results.push({ slug: m.slug, error: "product not found" });
      continue;
    }

    const fileRes = await fetch(new URL(`/seed-images/${m.image}`, request.url));
    const blob = await fileRes.blob();
    const file = new File([blob], m.image, { type: "image/webp" });

    const newUrl = await uploadProductImage(file);

    const oldUrl = product.imageUrl;
    if (oldUrl) {
      try {
        await deleteProductImage(oldUrl);
      } catch {
        // ignore cleanup failure of the old corrupt file
      }
    }

    await prisma.product.update({
      where: { id: product.id },
      data: { imageUrl: newUrl },
    });

    results.push({ slug: m.slug, oldUrl, newUrl });
  }

  return NextResponse.json({ results });
}
