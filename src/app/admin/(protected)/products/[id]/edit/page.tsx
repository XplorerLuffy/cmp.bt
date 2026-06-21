import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-brand-ink">Edit Product</h1>
      <p className="mb-6 text-sm text-brand-ink/60">Update details for {product.name}.</p>
      <ProductForm
        initial={{
          id: product.id,
          name: product.name,
          description: product.description,
          ingredients: product.ingredients ?? "",
          price: product.price,
          category: product.category,
          stock: product.stock,
          imageUrl: product.imageUrl,
        }}
      />
    </div>
  );
}
