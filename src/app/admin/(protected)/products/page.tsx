import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatBTN } from "@/lib/format";
import ProductRowActions from "@/components/admin/ProductRowActions";
import ProductThumb from "@/components/admin/ProductThumb";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-ink">Products</h1>
          <p className="text-sm text-brand-ink/50">{products.length} total</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-block w-fit rounded-full bg-brand-ink px-4 py-2 text-sm font-semibold text-brand-tint"
        >
          + Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="rounded-xl border border-brand-ink/10 bg-white p-6 text-center text-brand-ink/50 shadow-sm">
          No products yet. Add your first one!
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div
              key={p.id}
              className="flex flex-col gap-3 rounded-xl border border-brand-ink/10 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <ProductThumb imageUrl={p.imageUrl} name={p.name} size={56} />
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="font-medium text-brand-blue hover:underline"
                  >
                    {p.name}
                  </Link>
                  <p className="text-sm text-brand-ink/60">{p.category}</p>
                  <p className="font-display font-semibold text-brand-ink">{formatBTN(p.price)}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-brand-ink/60">Stock: {p.stock}</span>
                {!p.isActive && (
                  <span className="rounded-full bg-brand-ink/10 px-2 py-0.5 font-medium text-brand-ink/60">
                    Inactive
                  </span>
                )}
                <StockBadge stock={p.stock} outOfStock={p.outOfStock} />
              </div>

              <div className="border-t border-brand-ink/5 pt-3">
                <ProductRowActions productId={p.id} isActive={p.isActive} outOfStock={p.outOfStock} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
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
