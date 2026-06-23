<?php
require __DIR__ . '/includes/bootstrap.php';
require __DIR__ . '/includes/constants.php';
$pageTitle = 'Checkout';

$items = cart_items();
$errors = [];
$serverError = '';
$old = [
    'customerName' => '', 'phone' => '', 'dzongkhag' => '', 'address' => '',
    'email' => '', 'paymentMethod' => 'COD', 'notes' => '',
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    foreach ($old as $k => $_) { $old[$k] = trim($_POST[$k] ?? ''); }
    if ($old['paymentMethod'] !== 'BANK_TRANSFER') $old['paymentMethod'] = 'COD';

    if (empty($items)) {
        $serverError = 'Your cart is empty.';
    } else {
        if (mb_strlen($old['customerName']) < 2) $errors['customerName'] = 'Name is required';
        $phoneClean = preg_replace('/[\s-]/', '', $old['phone']);
        if (!preg_match('/^(\+?975)?[17][67]\d{6}$/', $phoneClean)) $errors['phone'] = 'Enter a valid Bhutan phone number (e.g. 17123456)';
        if ($old['dzongkhag'] === '') $errors['dzongkhag'] = 'Please select your Dzongkhag/town';
        if (mb_strlen($old['address']) < 5) $errors['address'] = 'Delivery address is required';
        if ($old['email'] !== '' && !filter_var($old['email'], FILTER_VALIDATE_EMAIL)) $errors['email'] = 'Enter a valid email';

        if (empty($errors)) {
            $db = get_db();
            // Re-validate products & compute trusted subtotal from DB.
            $ids = array_keys($items);
            $placeholders = implode(',', array_fill(0, count($ids), '?'));
            $types = str_repeat('s', count($ids));
            $stmt = $db->prepare("SELECT id, name, price, is_active, out_of_stock FROM products WHERE id IN ($placeholders)");
            $stmt->bind_param($types, ...$ids);
            $stmt->execute();
            $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
            $byId = [];
            foreach ($rows as $r) { $byId[$r['id']] = $r; }

            $subtotal = 0;
            $lineItems = [];
            foreach ($items as $id => $item) {
                $p = $byId[$id] ?? null;
                if (!$p || !$p['is_active'] || $p['out_of_stock']) {
                    $serverError = '"' . ($p['name'] ?? 'An item') . '" is no longer available.';
                    break;
                }
                $subtotal += (int)$p['price'] * $item['quantity'];
                $lineItems[] = ['product_id' => $id, 'name' => $p['name'], 'price' => (int)$p['price'], 'quantity' => $item['quantity']];
            }

            if ($serverError === '') {
                $orderId = gen_id();
                $orderNumber = generate_order_number();
                $status = $old['paymentMethod'] === 'COD' ? 'CONFIRMED' : 'PENDING_PAYMENT_VERIFICATION';
                $email = $old['email'] !== '' ? $old['email'] : null;
                $notes = $old['notes'] !== '' ? $old['notes'] : null;

                $db->begin_transaction();
                try {
                    $ins = $db->prepare("INSERT INTO orders (id, order_number, customer_name, phone, dzongkhag, address, email, payment_method, status, subtotal, notes) VALUES (?,?,?,?,?,?,?,?,?,?,?)");
                    $ins->bind_param('sssssssssis', $orderId, $orderNumber, $old['customerName'], $old['phone'], $old['dzongkhag'], $old['address'], $email, $old['paymentMethod'], $status, $subtotal, $notes);
                    $ins->execute();

                    $itemIns = $db->prepare("INSERT INTO order_items (order_id, product_id, name, price, quantity) VALUES (?,?,?,?,?)");
                    foreach ($lineItems as $li) {
                        $itemIns->bind_param('sssii', $orderId, $li['product_id'], $li['name'], $li['price'], $li['quantity']);
                        $itemIns->execute();
                    }
                    $db->commit();
                } catch (Throwable $e) {
                    $db->rollback();
                    error_log('Checkout order insert failed: ' . $e->getMessage());
                    $serverError = 'Something went wrong placing your order. Please try again.';
                }

                if ($serverError === '') {
                    cart_clear();
                    redirect('/confirmation?order=' . urlencode($orderNumber));
                }
            }
        }
    }
}

require __DIR__ . '/includes/header.php';
?>

<div class="mx-auto max-w-3xl px-4 py-10">
  <h1 class="mb-6 font-display text-2xl font-medium text-brand-ink">Checkout</h1>

  <?php if (empty($items)): ?>
    <p class="rounded-xl border border-brand-ink/10 bg-white p-6 text-center text-brand-ink/60">Your cart is empty. <a href="/products" class="font-semibold text-brand-blue hover:underline">Shop pickles</a></p>
  <?php else: ?>
    <form method="post" class="flex flex-col gap-5">
      <div class="grid gap-4 sm:grid-cols-2">
        <label class="flex flex-col gap-1">
          <span class="text-sm font-medium text-brand-ink/80">Full Name</span>
          <input name="customerName" value="<?= htmlspecialchars($old['customerName']) ?>" class="w-full rounded-xl border border-brand-ink/15 bg-white p-2.5">
          <?php if (isset($errors['customerName'])): ?><span class="text-xs font-medium text-red-600"><?= $errors['customerName'] ?></span><?php endif; ?>
        </label>
        <label class="flex flex-col gap-1">
          <span class="text-sm font-medium text-brand-ink/80">Phone Number</span>
          <input name="phone" placeholder="17123456" value="<?= htmlspecialchars($old['phone']) ?>" class="w-full rounded-xl border border-brand-ink/15 bg-white p-2.5">
          <?php if (isset($errors['phone'])): ?><span class="text-xs font-medium text-red-600"><?= $errors['phone'] ?></span><?php endif; ?>
        </label>
      </div>

      <label class="flex flex-col gap-1">
        <span class="text-sm font-medium text-brand-ink/80">Dzongkhag / Town</span>
        <select name="dzongkhag" class="w-full rounded-xl border border-brand-ink/15 bg-white p-2.5">
          <option value="">Select your Dzongkhag</option>
          <?php foreach (DZONGKHAGS as $d): ?>
            <option value="<?= htmlspecialchars($d) ?>" <?= $old['dzongkhag'] === $d ? 'selected' : '' ?>><?= htmlspecialchars($d) ?></option>
          <?php endforeach; ?>
        </select>
        <?php if (isset($errors['dzongkhag'])): ?><span class="text-xs font-medium text-red-600"><?= $errors['dzongkhag'] ?></span><?php endif; ?>
      </label>

      <label class="flex flex-col gap-1">
        <span class="text-sm font-medium text-brand-ink/80">Delivery Address</span>
        <textarea name="address" rows="3" placeholder="Street, landmark, etc." class="w-full rounded-xl border border-brand-ink/15 bg-white p-2.5"><?= htmlspecialchars($old['address']) ?></textarea>
        <?php if (isset($errors['address'])): ?><span class="text-xs font-medium text-red-600"><?= $errors['address'] ?></span><?php endif; ?>
      </label>

      <label class="flex flex-col gap-1">
        <span class="text-sm font-medium text-brand-ink/80">Email (optional)</span>
        <input type="email" name="email" value="<?= htmlspecialchars($old['email']) ?>" class="w-full rounded-xl border border-brand-ink/15 bg-white p-2.5">
        <?php if (isset($errors['email'])): ?><span class="text-xs font-medium text-red-600"><?= $errors['email'] ?></span><?php endif; ?>
      </label>

      <div>
        <span class="mb-2 block text-sm font-medium text-brand-ink/80">Payment Method</span>
        <div class="flex flex-col gap-3 sm:flex-row">
          <label id="payCOD" class="flex-1 cursor-pointer rounded-xl border p-3 <?= $old['paymentMethod'] === 'COD' ? 'border-brand-ink bg-brand-ink/5' : 'border-brand-ink/15' ?>">
            <input type="radio" name="paymentMethod" value="COD" class="hidden" <?= $old['paymentMethod'] === 'COD' ? 'checked' : '' ?>>
            <p class="font-display font-semibold text-brand-ink">Cash on Delivery</p>
            <p class="text-xs text-brand-ink/60">Pay when your order arrives</p>
          </label>
          <label id="payBANK" class="flex-1 cursor-pointer rounded-xl border p-3 <?= $old['paymentMethod'] === 'BANK_TRANSFER' ? 'border-brand-ink bg-brand-ink/5' : 'border-brand-ink/15' ?>">
            <input type="radio" name="paymentMethod" value="BANK_TRANSFER" class="hidden" <?= $old['paymentMethod'] === 'BANK_TRANSFER' ? 'checked' : '' ?>>
            <p class="font-display font-semibold text-brand-ink">Bank Transfer</p>
            <p class="text-xs text-brand-ink/60">Transfer now, we verify manually</p>
          </label>
        </div>
      </div>

      <div id="bankDetails" class="rounded-xl border border-brand-blue bg-brand-blue/10 p-4 text-sm <?= $old['paymentMethod'] === 'BANK_TRANSFER' ? '' : 'hidden' ?>">
          <p class="mb-2 font-display font-semibold text-brand-ink">Bank Account Details</p>
          <p>Bank: <?= BANK_DETAILS['bankName'] ?></p>
          <p>Account Name: <?= BANK_DETAILS['accountName'] ?></p>
          <p>Account Number: <?= BANK_DETAILS['accountNumber'] ?></p>
          <p class="mt-2 text-brand-ink/70">Please make the transfer and place your order. Your order will be marked "Pending Payment Verification" until we confirm receipt.</p>
        </div>

      <label class="flex flex-col gap-1">
        <span class="text-sm font-medium text-brand-ink/80">Order Notes (optional)</span>
        <textarea name="notes" rows="2" class="w-full rounded-xl border border-brand-ink/15 bg-white p-2.5"><?= htmlspecialchars($old['notes']) ?></textarea>
      </label>

      <div class="rounded-xl border border-brand-ink/10 bg-white p-4">
        <div class="flex justify-between font-display font-semibold text-brand-ink">
          <span>Subtotal (<?= count($items) ?> item<?= count($items) !== 1 ? 's' : '' ?>)</span>
          <span class="text-brand-blue"><?= format_btn(cart_subtotal()) ?></span>
        </div>
      </div>

      <?php if ($serverError): ?><p class="text-sm font-medium text-red-600"><?= htmlspecialchars($serverError) ?></p><?php endif; ?>

      <button type="submit" class="rounded-full bg-brand-ink py-3.5 font-display font-semibold text-brand-tint transition hover:bg-brand-blue-light">Place Order</button>
    </form>
    <script>
      (function () {
        var cod = document.getElementById('payCOD'), bank = document.getElementById('payBANK');
        var details = document.getElementById('bankDetails');
        var on = 'border-brand-ink', onBg = 'bg-brand-ink/5', off = 'border-brand-ink/15';
        function sync() {
          var isBank = bank.querySelector('input').checked;
          details.classList.toggle('hidden', !isBank);
          bank.classList.toggle(on, isBank); bank.classList.toggle(onBg, isBank); bank.classList.toggle(off, !isBank);
          cod.classList.toggle(on, !isBank); cod.classList.toggle(onBg, !isBank); cod.classList.toggle(off, isBank);
        }
        cod.querySelector('input').addEventListener('change', sync);
        bank.querySelector('input').addEventListener('change', sync);
      })();
    </script>
  <?php endif; ?>
</div>

<?php require __DIR__ . '/includes/footer.php'; ?>
