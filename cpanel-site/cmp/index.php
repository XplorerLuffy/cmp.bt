<?php
require __DIR__ . '/../includes/bootstrap.php';
require __DIR__ . '/../includes/admin-auth.php';
require __DIR__ . '/../includes/constants.php';
require_admin();
$adminTitle = 'Dashboard';

$db = get_db();
$totalOrders   = (int)$db->query("SELECT COUNT(*) c FROM orders")->fetch_assoc()['c'];
$totalProducts = (int)$db->query("SELECT COUNT(*) c FROM products")->fetch_assoc()['c'];
$revenue       = (int)($db->query("SELECT COALESCE(SUM(subtotal),0) s FROM orders WHERE status <> 'CANCELLED'")->fetch_assoc()['s']);

$counts = [];
$res = $db->query("SELECT status, COUNT(*) c FROM orders GROUP BY status");
while ($r = $res->fetch_assoc()) { $counts[$r['status']] = (int)$r['c']; }

$lowStock = $db->query("SELECT id, name, stock, out_of_stock FROM products WHERE out_of_stock = 1 OR stock <= 5 ORDER BY stock ASC LIMIT 6")->fetch_all(MYSQLI_ASSOC);
$recent   = $db->query("SELECT id, order_number, customer_name, subtotal, status FROM orders ORDER BY created_at DESC LIMIT 6")->fetch_all(MYSQLI_ASSOC);
$topSelling = $db->query("SELECT name, SUM(quantity) q FROM order_items GROUP BY name ORDER BY q DESC LIMIT 6")->fetch_all(MYSQLI_ASSOC);

$statusColors = [
  'PENDING_PAYMENT_VERIFICATION' => 'bg-accent-amber-tint text-accent-amber',
  'CONFIRMED' => 'bg-brand-blue-light/15 text-brand-blue-dark',
  'PROCESSING' => 'bg-brand-blue/10 text-brand-blue',
  'OUT_FOR_DELIVERY' => 'bg-accent-amber-tint text-accent-amber',
  'DELIVERED' => 'bg-accent-green-tint text-accent-green',
  'CANCELLED' => 'bg-accent-rose-tint text-accent-rose',
];

require __DIR__ . '/../includes/admin-layout.php';

function stat_card($label, $value, $badge, $icon) {
    echo '<div class="rounded-xl bg-white p-4 shadow-sm"><div class="mb-3 flex items-center justify-between"><p class="text-sm text-brand-ink/60">' . $label . '</p><span class="flex h-9 w-9 items-center justify-center rounded-full ' . $badge . '">' . $icon . '</span></div><p class="text-2xl font-bold text-brand-ink">' . $value . '</p></div>';
}
?>
<h1 class="mb-5 text-2xl font-bold text-brand-ink">Dashboard</h1>

<div class="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
  <?php
  stat_card('Total Orders', $totalOrders, 'bg-brand-blue/10 text-brand-blue', '🧾');
  stat_card('Total Revenue', format_btn($revenue), 'bg-accent-green-tint text-accent-green', '💰');
  stat_card('Pending Verification', $counts['PENDING_PAYMENT_VERIFICATION'] ?? 0, 'bg-accent-amber-tint text-accent-amber', '⏳');
  stat_card('Total Products', $totalProducts, 'bg-brand-blue/10 text-brand-blue', '📦');
  ?>
</div>

<div class="grid gap-4 lg:grid-cols-3">
  <!-- Recent orders -->
  <div class="rounded-xl border border-brand-ink/10 bg-white p-4 shadow-sm">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="font-semibold text-brand-ink">Recent Orders</h2>
      <a href="/cmp/orders" class="text-sm font-medium text-brand-blue hover:underline">View All</a>
    </div>
    <div class="flex flex-col gap-3">
      <?php foreach ($recent as $o): ?>
        <a href="/cmp/order?id=<?= urlencode($o['id']) ?>" class="flex items-center justify-between gap-2 rounded-lg border border-brand-ink/5 p-2.5 hover:bg-brand-tint/60">
          <div class="min-w-0">
            <p class="truncate text-sm font-medium text-brand-ink"><?= htmlspecialchars($o['order_number']) ?></p>
            <p class="truncate text-xs text-brand-ink/60"><?= htmlspecialchars($o['customer_name']) ?></p>
          </div>
          <div class="flex shrink-0 flex-col items-end gap-1">
            <span class="text-sm font-semibold text-brand-ink"><?= format_btn((float)$o['subtotal']) ?></span>
            <span class="rounded-full px-2 py-0.5 text-[10px] font-semibold <?= $statusColors[$o['status']] ?? 'bg-brand-ink/10' ?>"><?= ORDER_STATUS_LABELS[$o['status']] ?? $o['status'] ?></span>
          </div>
        </a>
      <?php endforeach; ?>
      <?php if (!$recent): ?><p class="py-6 text-center text-sm text-brand-ink/50">No orders yet.</p><?php endif; ?>
    </div>
  </div>

  <!-- Top selling -->
  <div class="rounded-xl border border-brand-ink/10 bg-white p-4 shadow-sm">
    <h2 class="mb-4 font-semibold text-brand-ink">Top Selling Products</h2>
    <div class="flex flex-col gap-3">
      <?php foreach ($topSelling as $i => $p): ?>
        <div class="flex items-center justify-between gap-2 rounded-lg border border-brand-ink/5 p-2.5">
          <div class="flex min-w-0 items-center gap-2.5">
            <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-blue/10 text-xs font-semibold text-brand-blue-dark"><?= $i + 1 ?></span>
            <span class="truncate text-sm font-medium text-brand-ink"><?= htmlspecialchars($p['name']) ?></span>
          </div>
          <span class="shrink-0 text-sm font-semibold text-brand-ink"><?= (int)$p['q'] ?> sold</span>
        </div>
      <?php endforeach; ?>
      <?php if (!$topSelling): ?><p class="py-6 text-center text-sm text-brand-ink/50">No sales data yet.</p><?php endif; ?>
    </div>
  </div>

  <!-- Low stock -->
  <div class="rounded-xl border border-brand-ink/10 bg-white p-4 shadow-sm">
    <h2 class="mb-4 font-semibold text-brand-ink">Low Stock Products</h2>
    <div class="flex flex-col gap-3">
      <?php foreach ($lowStock as $p): ?>
        <a href="/cmp/product-edit?id=<?= urlencode($p['id']) ?>" class="flex items-center justify-between gap-2 rounded-lg border border-brand-ink/5 p-2.5 hover:bg-brand-tint/60">
          <span class="truncate text-sm font-medium text-brand-ink"><?= htmlspecialchars($p['name']) ?></span>
          <span class="shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold <?= ($p['out_of_stock'] || $p['stock'] == 0) ? 'bg-accent-rose-tint text-accent-rose' : 'bg-accent-amber-tint text-accent-amber' ?>">
            <?= ($p['out_of_stock'] || $p['stock'] == 0) ? 'Out of stock' : ((int)$p['stock'] . ' left') ?>
          </span>
        </a>
      <?php endforeach; ?>
      <?php if (!$lowStock): ?><p class="py-6 text-center text-sm text-brand-ink/50">All products well stocked.</p><?php endif; ?>
    </div>
  </div>
</div>

<?php require __DIR__ . '/../includes/admin-layout-end.php'; ?>
