<?php
require __DIR__ . '/includes/bootstrap.php';
require __DIR__ . '/includes/constants.php';
$pageTitle = 'Order Confirmed';

$orderNumber = $_GET['order'] ?? '';
$order = null;
$items = [];
if ($orderNumber !== '') {
    $db = get_db();
    $stmt = $db->prepare("SELECT * FROM orders WHERE order_number = ? LIMIT 1");
    $stmt->bind_param('s', $orderNumber);
    $stmt->execute();
    $order = $stmt->get_result()->fetch_assoc();
    if ($order) {
        $istmt = $db->prepare("SELECT * FROM order_items WHERE order_id = ?");
        $istmt->bind_param('s', $order['id']);
        $istmt->execute();
        $items = $istmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }
}

require __DIR__ . '/includes/header.php';
?>

<div class="mx-auto max-w-2xl px-4 py-16">
  <?php if (!$order): ?>
    <div class="text-center">
      <h1 class="font-display text-2xl font-medium text-brand-ink">Order not found</h1>
      <a href="/products" class="mt-4 inline-block text-brand-blue hover:underline">&larr; Back to Shop</a>
    </div>
  <?php else: ?>
    <div class="rounded-2xl border border-brand-ink/10 bg-white p-6 text-center shadow-sm sm:p-10">
      <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-green-tint text-3xl">✅</div>
      <h1 class="font-display text-2xl font-medium text-brand-ink">Thank you for your order!</h1>
      <p class="mt-2 text-brand-ink/70">Your order number is</p>
      <p class="mt-1 font-display text-xl font-bold text-brand-blue"><?= htmlspecialchars($order['order_number']) ?></p>

      <div class="mt-6 rounded-xl border border-brand-ink/10 p-4 text-left">
        <div class="flex flex-col gap-2 text-sm">
          <?php foreach ($items as $it): ?>
            <div class="flex justify-between">
              <span class="text-brand-ink/80"><?= htmlspecialchars($it['name']) ?> &times; <?= (int)$it['quantity'] ?></span>
              <span class="font-medium text-brand-ink"><?= format_btn($it['price'] * $it['quantity']) ?></span>
            </div>
          <?php endforeach; ?>
          <div class="mt-2 flex justify-between border-t border-brand-ink/10 pt-2 font-display font-semibold">
            <span>Total</span>
            <span class="text-brand-blue"><?= format_btn((float)$order['subtotal']) ?></span>
          </div>
        </div>
      </div>

      <div class="mt-4 text-left text-sm text-brand-ink/70">
        <p><strong class="text-brand-ink">Payment:</strong> <?= $order['payment_method'] === 'COD' ? 'Cash on Delivery' : 'Bank Transfer' ?></p>
        <p><strong class="text-brand-ink">Status:</strong> <?= ORDER_STATUS_LABELS[$order['status']] ?? $order['status'] ?></p>
        <p><strong class="text-brand-ink">Delivery:</strong> <?= htmlspecialchars($order['dzongkhag']) ?></p>
      </div>

      <?php if ($order['payment_method'] === 'BANK_TRANSFER'): ?>
        <div class="mt-4 rounded-xl border border-brand-blue bg-brand-blue/10 p-4 text-left text-sm">
          <p class="font-display font-semibold text-brand-ink">Bank transfer details</p>
          <p>Bank: <?= BANK_DETAILS['bankName'] ?></p>
          <p>Account Name: <?= BANK_DETAILS['accountName'] ?></p>
          <p>Account Number: <?= BANK_DETAILS['accountNumber'] ?></p>
        </div>
      <?php endif; ?>

      <p class="mt-6 text-sm text-brand-ink/60">We'll contact you on <strong><?= htmlspecialchars($order['phone']) ?></strong> to confirm delivery.</p>
      <a href="/products" class="mt-6 inline-block rounded-full bg-brand-ink px-6 py-3 font-display font-semibold text-brand-tint transition hover:bg-brand-blue-light">Continue Shopping</a>
    </div>
  <?php endif; ?>
</div>

<?php require __DIR__ . '/includes/footer.php'; ?>
