import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatBTN } from "@/lib/format";
import ProductRowActions from "@/components/admin/ProductRowActions";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-ink">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-brand-ink px-4 py-2 text-sm font-semibold text-brand-tint"
        >
          + Add Product
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-brand-ink/10 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-ink/10 text-left text-brand-ink/60">
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-brand-ink/5 align-top">
                <td className="p-3">
                  <Link href={`/admin/products/${p.id}/edit`} className="font-medium text-brand-blue-light hover:underline">
                    {p.name}
                  </Link>
                </td>
                <td className="p-3">{p.category}</td>
                <td className="p-3">{formatBTN(p.price)}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">
                  {!p.isActive && <span className="mr-1 rounded bg-zinc-200 px-2 py-0.5 text-xs">Inactive</span>}
                  {p.outOfStock && <span className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-700">Out of Stock</span>}
                  {p.isActive && !p.outOfStock && <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">Active</span>}
                </td>
                <td className="p-3">
                  <ProductRowActions productId={p.id} isActive={p.isActive} outOfStock={p.outOfStock} />
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-brand-ink/50">
                  No products yet. Add your first one!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
