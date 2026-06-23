<?php
require __DIR__ . '/../includes/bootstrap.php';
require __DIR__ . '/../includes/admin-auth.php';
require __DIR__ . '/../includes/constants.php';
require_admin();
$adminTitle = 'Orders';
$db = get_db();

// Inline status update
if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['action'] ?? '') === 'status') {
    $oid = $_POST['order_id'] ?? '';
    $newStatus = $_POST['status'] ?? '';
    if (isset(ORDER_STATUS_LABELS[$newStatus])) {
        $stmt = $db->prepare("UPDATE orders SET status = ? WHERE id = ?");
        $stmt->bind_param('ss', $newStatus, $oid);
        $stmt->execute();
    }
    redirect('/admin/orders' . (!empty($_POST['filter']) ? '?status=' . urlencode($_POST['filter']) : ''));
}

$filter = $_GET['status'] ?? '';
if ($filter !== '' && isset(ORDER_STATUS_LABELS[$filter])) {
    $stmt = $db->prepare("SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC");
    $stmt->bind_param('s', $filter);
    $stmt->execute();
    $orders = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
} else {
    $filter = '';
    $orders = $db->query("SELECT * FROM orders ORDER BY created_at DESC")->fetch_all(MYSQLI_ASSOC);
}

$counts = [];
$res = $db->query("SELECT status, COUNT(*) c FROM orders GROUP BY status");
$total = 0;
while ($r = $res->fetch_assoc()) { $counts[$r['status']] = (int)$r['c']; $total += (int)$r['c']; }

require __DIR__ . '/../includes/admin-layout.php';

function status_select($order, $filter) {
    echo '<form method="post" class="inline">';
    echo '<input type="hidden" name="action" value="status">';
    echo '<input type="hidden" name="order_id" value="' . htmlspecialchars($order['id']) . '">';
    echo '<input type="hidden" name="filter" value="' . htmlspecialchars($filter) . '">';
    echo '<select name="status" onchange="this.form.submit()" class="rounded-lg border border-brand-ink/15 bg-white px-2 py-1 text-xs">';
    foreach (ORDER_STATUS_LABELS as $value => $label) {
        $sel = $order['status'] === $value ? 'selected' : '';
        echo '<option value="' . $value . '" ' . $sel . '>' . $label . '</option>';
    }
    echo '</select></form>';
}
?>
<h1 class="mb-6 text-2xl font-bold text-brand-ink">Orders</h1>

<div class="mb-4 flex flex-wrap gap-2">
  <a href="/admin/orders" class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium <?= $filter === '' ? 'bg-brand-ink text-brand-tint' : 'bg-brand-ink/5 text-brand-ink/70 hover:bg-brand-ink/10' ?>">All <span class="rounded-full bg-white px-1.5 py-0.5 text-[10px] font-semibold text-brand-ink/60"><?= $total ?></span></a>
  <?php foreach (ORDER_STATUS_LABELS as $value => $label): ?>
    <a href="/admin/orders?status=<?= $value ?>" class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium <?= $filter === $value ? 'bg-brand-ink text-brand-tint' : 'bg-brand-ink/5 text-brand-ink/70 hover:bg-brand-ink/10' ?>"><?= $label ?> <span class="rounded-full bg-white px-1.5 py-0.5 text-[10px] font-semibold text-brand-ink/60"><?= $counts[$value] ?? 0 ?></span></a>
  <?php endforeach; ?>
</div>

<!-- Mobile cards -->
<div class="flex flex-col gap-3 sm:hidden">
  <?php foreach ($orders as $o): ?>
    <div class="rounded-xl border border-brand-ink/10 bg-white p-4 shadow-sm">
      <div class="mb-1 flex items-center justify-between">
        <a href="/admin/order?id=<?= urlencode($o['id']) ?>" class="font-medium text-brand-blue hover:underline"><?= htmlspecialchars($o['order_number']) ?></a>
        <span class="font-semibold text-brand-ink"><?= format_btn((float)$o['subtotal']) ?></span>
      </div>
      <p class="text-sm text-brand-ink/80"><?= htmlspecialchars($o['customer_name']) ?></p>
      <div class="mt-2 flex items-center justify-between text-xs text-brand-ink/60">
        <span><?= $o['payment_method'] === 'COD' ? 'COD' : 'Bank Transfer' ?></span>
        <span><?= date('d M Y', strtotime($o['created_at'])) ?></span>
      </div>
      <div class="mt-2"><?php status_select($o, $filter); ?></div>
    </div>
  <?php endforeach; ?>
  <?php if (!$orders): ?><p class="rounded-xl border border-brand-ink/10 bg-white p-6 text-center text-brand-ink/50">No orders found.</p><?php endif; ?>
</div>

<!-- Desktop table -->
<div class="hidden overflow-x-auto rounded-xl border border-brand-ink/10 bg-white shadow-sm sm:block">
  <table class="w-full text-sm">
    <thead><tr class="border-b border-brand-ink/10 text-left text-brand-ink/60">
      <th class="p-3">Order #</th><th class="p-3">Customer</th><th class="p-3">Payment</th><th class="p-3">Total</th><th class="p-3">Status</th><th class="p-3">Date</th>
    </tr></thead>
    <tbody>
      <?php foreach ($orders as $o): ?>
        <tr class="border-b border-brand-ink/5">
          <td class="p-3"><a href="/admin/order?id=<?= urlencode($o['id']) ?>" class="font-medium text-brand-blue hover:underline"><?= htmlspecialchars($o['order_number']) ?></a></td>
          <td class="p-3"><?= htmlspecialchars($o['customer_name']) ?></td>
          <td class="p-3"><?= $o['payment_method'] === 'COD' ? 'COD' : 'Bank Transfer' ?></td>
          <td class="p-3"><?= format_btn((float)$o['subtotal']) ?></td>
          <td class="p-3"><?php status_select($o, $filter); ?></td>
          <td class="p-3 text-brand-ink/60"><?= date('d M Y', strtotime($o['created_at'])) ?></td>
        </tr>
      <?php endforeach; ?>
      <?php if (!$orders): ?><tr><td colspan="6" class="p-6 text-center text-brand-ink/50">No orders found.</td></tr><?php endif; ?>
    </tbody>
  </table>
</div>

<?php require __DIR__ . '/../includes/admin-layout-end.php'; ?>
