import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/session";
import { productSchema } from "@/lib/validation";
import { uploadProductImage, deleteProductImage } from "@/lib/storage";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const formData = await request.formData();

  // Simple flag toggles (isActive / outOfStock) can be sent alone without full product fields.
  if (formData.has("isActive") || formData.has("outOfStock")) {
    const data: { isActive?: boolean; outOfStock?: boolean } = {};
    if (formData.has("isActive")) data.isActive = formData.get("isActive") === "true";
    if (formData.has("outOfStock")) data.outOfStock = formData.get("outOfStock") === "true";
    const updated = await prisma.product.update({ where: { id }, data });
    return NextResponse.json(updated);
  }

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
  let imageUrl = existing.imageUrl;
  if (imageFile instanceof File && imageFile.size > 0) {
    imageUrl = await uploadProductImage(imageFile);
    if (existing.imageUrl) await deleteProductImage(existing.imageUrl).catch(() => {});
  }

  const updated = await prisma.product.update({
    where: { id },
    data: { ...parsed.data, ingredients: parsed.data.ingredients || null, imageUrl },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const hasOrders = await prisma.orderItem.findFirst({ where: { productId: id } });

  if (hasOrders) {
    // Preserve order history: deactivate instead of hard-deleting.
    const updated = await prisma.product.update({ where: { id }, data: { isActive: false } });
    return NextResponse.json({ deactivated: true, product: updated });
  }

  const product = await prisma.product.findUnique({ where: { id } });
  if (product?.imageUrl) await deleteProductImage(product.imageUrl).catch(() => {});
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ deleted: true });
}
