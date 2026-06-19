import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/session";
import { productSchema } from "@/lib/validation";
import { uploadProductImage } from "@/lib/storage";
import { slugify } from "@/lib/slug";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    ingredients: formData.get("ingredients"),
    price: formData.get("price"),
    category: formData.get("category"),
    stock: formData.get("stock"),
  });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const imageFile = formData.get("image");
  let imageUrl: string | null = null;
  if (imageFile instanceof File && imageFile.size > 0) {
    imageUrl = await uploadProductImage(imageFile);
  }

  const baseSlug = slugify(parsed.data.name);
  let slug = baseSlug;
  let suffix = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${++suffix}`;
  }

  const product = await prisma.product.create({
    data: {
      ...parsed.data,
      ingredients: parsed.data.ingredients || null,
      slug,
      imageUrl,
    },
  });

  return NextResponse.json(product, { status: 201 });
}
