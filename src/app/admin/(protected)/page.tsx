import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatBTN } from "@/lib/format";
import { ORDER_STATUS_LABELS } from "@/lib/orders";
import StatusBadge from "@/components/admin/StatusBadge";
import {
  WalletIcon,
  ReceiptIcon,
  ClockIcon,
  SpinnerArrowsIcon,
  TruckIcon,
  CheckCircleIcon,
  BoxIcon,
  AlertTriangleIcon,
} from "@/components/admin/icons";

export const dynamic = "force-dynamic";

const STATUS_RING_COLORS: Record<string, string> = {
  PENDING_PAYMENT_VERIFICATION: "var(--accent-amber)",
  CONFIRMED: "var(--brand-blue-light)",
  PROCESSING: "var(--brand-blue)",
  OUT_FOR_DELIVERY: "var(--accent-amber)",
  DELIVERED: "var(--accent-green)",
  CANCELLED: "var(--accent-rose)",
};

function startOfDay(d: Date) {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export default async function AdminDashboardPage() {
  const sevenDaysAgo = startOfDay(new Date());
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  const [
    totalOrders,
    statusCounts,
    revenueAgg,
    recentOrders,
    totalProducts,
    lowStockProducts,
    recentOrdersForChart,
    topSellingRaw,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.groupBy({ by: ["status"], _count: { status: true } }),
    prisma.order.aggregate({
      _sum: { subtotal: true },
      where: { status: { not: "CANCELLED" } },
    }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.product.count(),
    prisma.product.findMany({
      where: { OR: [{ outOfStock: true }, { stock: { lte: 5 } }] },
      orderBy: { stock: "asc" },
      take: 5,
    }),
    prisma.order.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { subtotal: true, createdAt: true },
    }),
    prisma.orderItem.groupBy({
      by: ["productId", "name"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
  ]);

  const countsByStatus = Object.fromEntries(
    statusCounts.map((s) => [s.status, s._count.status])
  );

  const pendingCount = countsByStatus.PENDING_PAYMENT_VERIFICATION ?? 0;
  const confirmedCount = countsByStatus.CONFIRMED ?? 0;
  const processingCount = countsByStatus.PROCESSING ?? 0;
  const outForDeliveryCount = countsByStatus.OUT_FOR_DELIVERY ?? 0;
  const deliveredCount = countsByStatus.DELIVERED ?? 0;

  const outOfStockOrLowCount = lowStockProducts.length;

  const statusBreakdown = Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
    count: countsByStatus[value] ?? 0,
  }));

  // --- 7-day chart buckets ---
  const days: { label: string; total: number }[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(sevenDaysAgo);
    d.setDate(d.getDate() + i);
    days.push({ label: d.toLocaleDateString(undefined, { weekday: "short" }), total: 0 });
  }
  for (const order of recentOrdersForChart) {
    const dayIndex = Math.floor(
      (startOfDay(order.createdAt).getTime() - sevenDaysAgo.getTime()) / 86400000
    );
    if (dayIndex >= 0 && dayIndex < 7) {
      days[dayIndex].total += order.subtotal;
    }
  }
  const maxDayTotal = Math.max(1, ...days.map((d) => d.total));

  // Build SVG line/area chart points (viewBox 0 0 700 220, padded)
  const chartWidth = 700;
  const chartHeight = 220;
  const padX = 24;
  const padY = 20;
  const innerW = chartWidth - padX * 2;
  const innerH = chartHeight - padY * 2;
  const points = days.map((d, i) => {
    const x = padX + (innerW / (days.length - 1)) * i;
    const y = padY + innerH - (d.total / maxDayTotal) * innerH;
    return { x, y, ...d };
  });
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = `${linePath} L${points[points.length - 1].x},${padY + innerH} L${points[0].x},${padY + innerH} Z`;

  // --- Donut chart ---
  const totalForDonut = Math.max(1, statusBreakdown.reduce((sum, s) => sum + s.count, 0));
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  let cumulativeOffset = 0;
  const donutSegments = statusBreakdown
    .filter((s) => s.count > 0)
    .map((s) => {
      const fraction = s.count / totalForDonut;
      const dash = fraction * circumference;
      const segment = {
        ...s,
        dash,
        offset: cumulativeOffset,
        color: STATUS_RING_COLORS[s.value] ?? "var(--brand-ink)",
      };
      cumulativeOffset += dash;
      return segment;
    });

  // --- Top selling products ---
  const topSelling = topSellingRaw
    .filter((t) => (t._sum.quantity ?? 0) > 0)
    .map((t) => ({ name: t.name, quantity: t._sum.quantity ?? 0 }));

  return (
    <div className="-m-4 sm:-m-6 lg:-m-8">
      {/* Dark stat band */}
      <div className="bg-admin-sidebar px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="mb-5 text-2xl font-bold text-white">Dashboard</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
          <StatCard
            label="Total Orders"
            value={totalOrders.toString()}
            icon={<ReceiptIcon className="h-5 w-5" />}
            badgeClass="bg-brand-blue/10 text-brand-blue"
          />
          <StatCard
            label="Total Revenue"
            value={formatBTN(revenueAgg._sum.subtotal ?? 0)}
            icon={<WalletIcon className="h-5 w-5" />}
            badgeClass="bg-accent-green-tint text-accent-green"
          />
          <StatCard
            label="Pending Verification"
            value={pendingCount.toString()}
            icon={<ClockIcon className="h-5 w-5" />}
            badgeClass="bg-accent-amber-tint text-accent-amber"
          />
          <StatCard
            label="Confirmed"
            value={confirmedCount.toString()}
            icon={<CheckCircleIcon className="h-5 w-5" />}
            badgeClass="bg-brand-blue-light/15 text-brand-blue-dark"
          />
          <StatCard
            label="Processing"
            value={processingCount.toString()}
            icon={<SpinnerArrowsIcon className="h-5 w-5" />}
            badgeClass="bg-brand-blue/10 text-brand-blue"
          />
          <StatCard
            label="Out for Delivery"
            value={outForDeliveryCount.toString()}
            icon={<TruckIcon className="h-5 w-5" />}
            badgeClass="bg-accent-amber-tint text-accent-amber"
          />
          <StatCard
            label="Delivered"
            value={deliveredCount.toString()}
            icon={<CheckCircleIcon className="h-5 w-5" />}
            badgeClass="bg-accent-green-tint text-accent-green"
          />
          <StatCard
            label="Total Products"
            value={totalProducts.toString()}
            icon={<BoxIcon className="h-5 w-5" />}
            badgeClass="bg-brand-blue/10 text-brand-blue"
          />
          <StatCard
            label="Low / Out of Stock"
            value={outOfStockOrLowCount.toString()}
            icon={<AlertTriangleIcon className="h-5 w-5" />}
            badgeClass="bg-accent-rose-tint text-accent-rose"
          />
        </div>
      </div>

      {/* Light content area */}
      <div className="bg-brand-tint p-4 sm:p-6 lg:p-8">
        <div className="mb-6 grid gap-4 lg:grid-cols-10">
          {/* Total Sale chart */}
          <div className="rounded-xl border border-brand-ink/10 bg-white p-4 shadow-sm lg:col-span-7">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-brand-ink">Total Sale</h2>
              <span className="text-xs text-brand-ink/50">Last 7 days</span>
            </div>
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="h-56 w-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="saleGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--brand-blue)" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="var(--brand-blue)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* horizontal grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((t) => (
                <line
                  key={t}
                  x1={padX}
                  x2={chartWidth - padX}
                  y1={padY + innerH * t}
                  y2={padY + innerH * t}
                  stroke="var(--brand-ink)"
                  strokeOpacity="0.06"
                  strokeWidth="1"
                />
              ))}
              <path d={areaPath} fill="url(#saleGradient)" />
              <path d={linePath} fill="none" stroke="var(--brand-blue)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
              {points.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="4" fill="var(--brand-blue)" stroke="white" strokeWidth="1.5" />
              ))}
            </svg>
            <div className="mt-1 flex justify-between text-xs text-brand-ink/50">
              {days.map((d, i) => (
                <span key={i}>{d.label}</span>
              ))}
            </div>
          </div>

          {/* Order Status donut */}
          <div className="rounded-xl border border-brand-ink/10 bg-white p-4 shadow-sm lg:col-span-3">
            <h2 className="mb-4 font-semibold text-brand-ink">Order Status</h2>
            <div className="flex items-center justify-center">
              <svg viewBox="0 0 160 160" className="h-40 w-40">
                <circle cx="80" cy="80" r={radius} fill="none" stroke="var(--brand-ink)" strokeOpacity="0.06" strokeWidth="18" />
                {donutSegments.map((seg) => (
                  <circle
                    key={seg.value}
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="none"
                    stroke={seg.color}
                    strokeWidth="18"
                    strokeDasharray={`${seg.dash} ${circumference - seg.dash}`}
                    strokeDashoffset={-seg.offset}
                    transform="rotate(-90 80 80)"
                    strokeLinecap="butt"
                  />
                ))}
                <text x="80" y="76" textAnchor="middle" className="fill-brand-ink text-2xl font-bold" style={{ fontSize: "22px" }}>
                  {totalOrders}
                </text>
                <text x="80" y="96" textAnchor="middle" style={{ fontSize: "11px" }} className="fill-brand-ink/50">
                  Orders
                </text>
              </svg>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              {statusBreakdown.map((s) => (
                <div key={s.value} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-brand-ink/70">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ background: STATUS_RING_COLORS[s.value] ?? "var(--brand-ink)" }}
                    />
                    {s.label}
                  </span>
                  <span className="font-medium text-brand-ink">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Recent Orders */}
          <div className="rounded-xl border border-brand-ink/10 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-brand-ink">Recent Orders</h2>
              <Link href="/admin/orders" className="text-sm font-medium text-brand-blue hover:underline">
                View All
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between gap-2 rounded-lg border border-brand-ink/5 p-2.5 hover:bg-brand-tint/60"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-brand-ink">{order.orderNumber}</p>
                    <p className="truncate text-xs text-brand-ink/60">{order.customerName}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className="text-sm font-semibold text-brand-ink">{formatBTN(order.subtotal)}</span>
                    <StatusBadge status={order.status} />
                  </div>
                </Link>
              ))}
              {recentOrders.length === 0 && (
                <p className="py-6 text-center text-sm text-brand-ink/50">No orders yet.</p>
              )}
            </div>
          </div>

          {/* Top Selling Products */}
          <div className="rounded-xl border border-brand-ink/10 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-brand-ink">Top Selling Products</h2>
              <Link href="/admin/products" className="text-sm font-medium text-brand-blue hover:underline">
                View All
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              {topSelling.map((p, i) => (
                <div key={`${p.name}-${i}`} className="flex items-center justify-between gap-2 rounded-lg border border-brand-ink/5 p-2.5">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-blue/10 text-xs font-semibold text-brand-blue-dark">
                      {i + 1}
                    </span>
                    <span className="truncate text-sm font-medium text-brand-ink">{p.name}</span>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-brand-ink">{p.quantity} sold</span>
                </div>
              ))}
              {topSelling.length === 0 && (
                <p className="py-6 text-center text-sm text-brand-ink/50">No sales data yet.</p>
              )}
            </div>
          </div>

          {/* Low Stock Products */}
          <div className="rounded-xl border border-brand-ink/10 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-brand-ink">Low Stock Products</h2>
              <Link href="/admin/products" className="text-sm font-medium text-brand-blue hover:underline">
                View All
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              {lowStockProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/admin/products/${p.id}/edit`}
                  className="flex items-center justify-between gap-2 rounded-lg border border-brand-ink/5 p-2.5 hover:bg-brand-tint/60"
                >
                  <span className="truncate text-sm font-medium text-brand-ink">{p.name}</span>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                      p.outOfStock || p.stock === 0
                        ? "bg-accent-rose-tint text-accent-rose"
                        : "bg-accent-amber-tint text-accent-amber"
                    }`}
                  >
                    {p.outOfStock || p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                  </span>
                </Link>
              ))}
              {lowStockProducts.length === 0 && (
                <p className="py-6 text-center text-sm text-brand-ink/50">All products well stocked.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  badgeClass,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  badgeClass: string;
}) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-brand-ink/60">{label}</p>
        <span className={`flex h-9 w-9 items-center justify-center rounded-full ${badgeClass}`}>{icon}</span>
      </div>
      <p className="text-2xl font-bold text-brand-ink">{value}</p>
    </div>
  );
}
