<?php
require __DIR__ . '/../includes/bootstrap.php';
require __DIR__ . '/../includes/admin-auth.php';
require __DIR__ . '/../includes/constants.php';
require_admin();
$db = get_db();

$id = $_GET['id'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['action'] ?? '') === 'status') {
    $newStatus = $_POST['status'] ?? '';
    if (isset(ORDER_STATUS_LABELS[$newStatus])) {
        $stmt = $db->prepare("UPDATE orders SET status = ? WHERE id = ?");
        $stmt->bind_param('ss', $newStatus, $id);
        $stmt->execute();
    }
    redirect('/cmp/order?id=' . urlencode($id));
}

$stmt = $db->prepare("SELECT * FROM orders WHERE id = ? LIMIT 1");
$stmt->bind_param('s', $id);
$stmt->execute();
$order = $stmt->get_result()->fetch_assoc();

if (!$order) {
    $adminTitle = 'Order';
    require __DIR__ . '/../includes/admin-layout.php';
    echo '<p class="text-brand-ink/60">Order not found. <a href="/cmp/orders" class="text-brand-blue hover:underline">Back to orders</a></p>';
    require __DIR__ . '/../includes/admin-layout-end.php';
    exit;
}

$istmt = $db->prepare("SELECT * FROM order_items WHERE order_id = ?");
$istmt->bind_param('s', $id);
$istmt->execute();
$items = $istmt->get_result()->fetch_all(MYSQLI_ASSOC);

$adminTitle = $order['order_number'];
require __DIR__ . '/../includes/admin-layout.php';
?>
<a href="/cmp/orders" class="mb-4 inline-block text-sm font-medium text-brand-ink/60 hover:text-brand-blue">&larr; Back to Orders</a>

<div class="mb-4 flex flex-wrap items-center justify-between gap-3">
  <div>
    <h1 class="text-2xl font-bold text-brand-ink"><?= htmlspecialchars($order['order_number']) ?></h1>
    <p class="text-sm text-brand-ink/50"><?= date('d M Y, g:i A', strtotime($order['created_at'])) ?></p>
  </div>
  <form method="post" class="flex items-center gap-2">
    <input type="hidden" name="action" value="status">
    <select name="status" class="rounded-lg border border-brand-ink/15 bg-white px-3 py-2 text-sm">
      <?php foreach (ORDER_STATUS_LABELS as $value => $label): ?>
        <option value="<?= $value ?>" <?= $order['status'] === $value ? 'selected' : '' ?>><?= $label ?></option>
      <?php endforeach; ?>
    </select>
    <button class="rounded-full bg-brand-ink px-4 py-2 text-sm font-semibold text-brand-tint">Update</button>
  </form>
</div>

<div class="grid gap-4 lg:grid-cols-3">
  <div class="rounded-xl border border-brand-ink/10 bg-white p-5 shadow-sm lg:col-span-2">
    <h2 class="mb-3 font-semibold text-brand-ink">Items</h2>
    <div class="flex flex-col gap-2">
      <?php foreach ($items as $it): ?>
        <div class="flex justify-between text-sm">
          <span class="text-brand-ink/80"><?= htmlspecialchars($it['name']) ?> &times; <?= (int)$it['quantity'] ?></span>
          <span class="font-medium text-brand-ink"><?= format_btn($it['price'] * $it['quantity']) ?></span>
        </div>
      <?php endforeach; ?>
      <div class="mt-2 flex justify-between border-t border-brand-ink/10 pt-2 font-semibold">
        <span>Total</span><span class="text-brand-blue"><?= format_btn((float)$order['subtotal']) ?></span>
      </div>
    </div>
  </div>

  <div class="rounded-xl border border-brand-ink/10 bg-white p-5 shadow-sm">
    <h2 class="mb-3 font-semibold text-brand-ink">Customer</h2>
    <div class="flex flex-col gap-1.5 text-sm text-brand-ink/80">
      <p><strong class="text-brand-ink"><?= htmlspecialchars($order['customer_name']) ?></strong></p>
      <p>📞 <?= htmlspecialchars($order['phone']) ?></p>
      <?php if (!empty($order['email'])): ?><p>✉️ <?= htmlspecialchars($order['email']) ?></p><?php endif; ?>
      <p>📍 <?= htmlspecialchars($order['dzongkhag']) ?></p>
      <p class="text-brand-ink/70"><?= nl2br(htmlspecialchars($order['address'])) ?></p>
      <hr class="my-2 border-brand-ink/10">
      <p>Payment: <strong class="text-brand-ink"><?= $order['payment_method'] === 'COD' ? 'Cash on Delivery' : 'Bank Transfer' ?></strong></p>
      <?php if (!empty($order['notes'])): ?><p class="text-brand-ink/70">Notes: <?= htmlspecialchars($order['notes']) ?></p><?php endif; ?>
    </div>
  </div>
</div>

<?php require __DIR__ . '/../includes/admin-layout-end.php'; ?>
