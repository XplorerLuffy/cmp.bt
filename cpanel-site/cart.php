<?php
require __DIR__ . '/includes/bootstrap.php';
$pageTitle = 'Cart';
$items = cart_items();
$subtotal = cart_subtotal();
require __DIR__ . '/includes/header.php';
?>

<?php if (empty($items)): ?>
  <div class="mx-auto max-w-3xl px-4 py-20 text-center">
    <p class="mb-4 text-5xl">🫙</p>
    <h1 class="mb-2 font-display text-2xl font-medium text-brand-ink">Your cart is empty</h1>
    <p class="mb-6 text-brand-ink/70">Add some delicious achaar to get started.</p>
    <a href="/products" class="rounded-full bg-brand-ink px-6 py-3 font-display font-semibold text-brand-tint transition hover:bg-brand-blue-light">Shop Pickles</a>
  </div>
<?php else: ?>
  <div class="mx-auto max-w-3xl px-4 py-10">
    <h1 class="mb-6 font-display text-2xl font-medium text-brand-ink">Your Cart</h1>
    <div class="flex flex-col gap-3">
      <?php foreach ($items as $id => $item): ?>
        <div class="flex flex-wrap items-center gap-3 rounded-xl border border-brand-ink/10 bg-white p-3 sm:flex-nowrap sm:gap-4">
          <div class="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-brand-blue/10 to-brand-tint">
            <?php if (!empty($item['image_url'])): ?>
              <img src="<?= htmlspecialchars($item['image_url']) ?>" alt="<?= htmlspecialchars($item['name']) ?>" class="h-full w-full object-cover">
            <?php else: ?>
              <div class="flex h-full items-center justify-center text-2xl">🫙</div>
            <?php endif; ?>
          </div>
          <div class="min-w-0 flex-1 basis-full sm:basis-auto">
            <a href="/product/<?= urlencode($item['slug']) ?>" class="break-words font-medium text-brand-ink hover:text-brand-blue"><?= htmlspecialchars($item['name']) ?></a>
            <p class="text-sm text-brand-ink/60"><?= format_btn($item['price']) ?> each</p>
          </div>
          <div class="flex items-center rounded-full border border-brand-ink/20">
            <form method="post" action="/cart-action">
              <input type="hidden" name="action" value="update">
              <input type="hidden" name="product_id" value="<?= htmlspecialchars($id) ?>">
              <input type="hidden" name="quantity" value="<?= $item['quantity'] - 1 ?>">
              <button class="h-9 w-9 text-lg sm:h-8 sm:w-8">−</button>
            </form>
            <span class="w-8 text-center text-sm font-medium"><?= $item['quantity'] ?></span>
            <form method="post" action="/cart-action">
              <input type="hidden" name="action" value="update">
              <input type="hidden" name="product_id" value="<?= htmlspecialchars($id) ?>">
              <input type="hidden" name="quantity" value="<?= $item['quantity'] + 1 ?>">
              <button class="h-9 w-9 text-lg sm:h-8 sm:w-8">+</button>
            </form>
          </div>
          <form method="post" action="/cart-action">
            <input type="hidden" name="action" value="remove">
            <input type="hidden" name="product_id" value="<?= htmlspecialchars($id) ?>">
            <button aria-label="Remove item" class="flex h-9 w-9 items-center justify-center text-brand-ink/40 hover:text-brand-blue">✕</button>
          </form>
        </div>
      <?php endforeach; ?>
    </div>

    <div class="mt-6 flex items-center justify-between rounded-xl border border-brand-ink/10 bg-white p-4">
      <span class="font-display text-lg font-semibold text-brand-ink">Subtotal</span>
      <span class="font-display text-lg font-bold text-brand-blue"><?= format_btn($subtotal) ?></span>
    </div>

    <a href="/checkout" class="mt-6 block w-full rounded-full bg-brand-ink py-3.5 text-center font-display font-semibold text-brand-tint transition hover:bg-brand-blue-light">Proceed to Checkout</a>
  </div>
<?php endif; ?>

<?php require __DIR__ . '/includes/footer.php'; ?>
