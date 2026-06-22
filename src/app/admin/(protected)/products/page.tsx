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
          <div key={p.id} className="rounded-xl border border-brand-ink/10 bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-start gap-3">
              <ProductThumb imageUrl={p.imageUrl} name={p.name} size={48} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <Link href={`/admin/products/${p.id}/edit`} className="font-medium text-brand-blue hover:underline">
                    {p.name}
                  </Link>
                  <span className="whitespace-nowrap font-semibold text-brand-ink">{formatBTN(p.price)}</span>
                </div>
                <p className="text-sm text-brand-ink/60">{p.category}</p>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-brand-ink/60">Stock: {p.stock}</span>
              {!p.isActive && (
                <span className="rounded-full bg-brand-ink/10 px-2 py-0.5 font-medium text-brand-ink/60">Inactive</span>
              )}
              <StockBadge stock={p.stock} outOfStock={p.outOfStock} />
            </div>
            <div className="mt-3">
              <ProductRowActions productId={p.id} isActive={p.isActive} outOfStock={p.outOfStock} />
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <p className="rounded-xl border border-brand-ink/10 bg-white p-6 text-center text-brand-ink/50 shadow-sm">
            No products yet. Add your first one!
          </p>
        )}
      </div>

      {/* Desktop: table */}
      <div className="hidden overflow-x-auto rounded-xl border border-brand-ink/10 bg-white shadow-sm sm:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-ink/10 text-left text-brand-ink/60">
              <th className="p-3">Product</th>
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
                  <div className="flex items-center gap-3">
                    <ProductThumb imageUrl={p.imageUrl} name={p.name} size={40} />
                    <Link href={`/admin/products/${p.id}/edit`} className="font-medium text-brand-blue hover:underline">
                      {p.name}
                    </Link>
                  </div>
                </td>
                <td className="p-3">{p.category}</td>
                <td className="p-3">{formatBTN(p.price)}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {!p.isActive && (
                      <span className="rounded-full bg-brand-ink/10 px-2 py-0.5 text-xs font-medium text-brand-ink/60">
                        Inactive
                      </span>
                    )}
                    <StockBadge stock={p.stock} outOfStock={p.outOfStock} />
                  </div>
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

function ProductThumb({ imageUrl, name, size }: { imageUrl: string | null; name: string; size: number }) {
  if (!imageUrl) {
    return (
      <span
        className="flex shrink-0 items-center justify-center rounded-lg bg-brand-ink/5 text-xs font-semibold text-brand-ink/40"
        style={{ width: size, height: size }}
      >
        {name.slice(0, 1).toUpperCase()}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageUrl}
      alt={name}
      className="shrink-0 rounded-lg object-cover"
      style={{ width: size, height: size }}
    />
  );
}

function StockBadge({ stock, outOfStock }: { stock: number; outOfStock: boolean }) {
  if (outOfStock || stock === 0) {
    return (
      <span className="rounded-full bg-accent-rose-tint px-2 py-0.5 text-xs font-semibold text-accent-rose">
        Out of Stock
      </span>
    );
  }
  if (stock <= 5) {
    return (
      <span className="rounded-full bg-accent-amber-tint px-2 py-0.5 text-xs font-semibold text-accent-amber">
        Low Stock
      </span>
    );
  }
  return (
    <span className="rounded-full bg-accent-green-tint px-2 py-0.5 text-xs font-semibold text-accent-green">
      In Stock
    </span>
  );
}
