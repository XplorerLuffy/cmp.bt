import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatBTN } from "@/lib/format";
import ProductRowActions from "@/components/admin/ProductRowActions";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-brand-ink">Products</h1>
        <Link
          href="/admin/products/new"
          className="inline-block w-fit rounded-full bg-brand-ink px-4 py-2 text-sm font-semibold text-brand-tint"
        >
          + Add Product
        </Link>
      </div>

      {/* Mobile: stacked cards */}
      <div className="flex flex-col gap-3 sm:hidden">
        {products.map((p) => (
          <div key={p.id} className="rounded-xl border border-brand-ink/10 bg-white p-4">
            <div className="mb-1 flex items-center justify-between gap-2">
              <Link href={`/admin/products/${p.id}/edit`} className="font-medium text-brand-blue-light hover:underline">
                {p.name}
              </Link>
              <span className="whitespace-nowrap font-semibold text-brand-ink">{formatBTN(p.price)}</span>
            </div>
            <p className="text-sm text-brand-ink/60">{p.category}</p>
            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-brand-ink/60">Stock: {p.stock}</span>
              {!p.isActive && <span className="rounded bg-zinc-200 px-2 py-0.5">Inactive</span>}
              {p.outOfStock && <span className="rounded bg-red-100 px-2 py-0.5 text-red-700">Out of Stock</span>}
              {p.isActive && !p.outOfStock && <span className="rounded bg-green-100 px-2 py-0.5 text-green-700">Active</span>}
            </div>
            <div className="mt-3">
              <ProductRowActions productId={p.id} isActive={p.isActive} outOfStock={p.outOfStock} />
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <p className="rounded-xl border border-brand-ink/10 bg-white p-6 text-center text-brand-ink/50">
            No products yet. Add your first one!
          </p>
        )}
      </div>

      {/* Desktop: table */}
      <div className="hidden overflow-x-auto rounded-xl border border-brand-ink/10 bg-white sm:block">
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
