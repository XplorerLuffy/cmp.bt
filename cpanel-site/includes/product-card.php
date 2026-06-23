<?php
/** Expects $product (associative array) and optional $cardIndex for stagger. */
$delay = isset($cardIndex) ? ($cardIndex % 4) * 0.08 : 0;
?>
<div class="reveal" style="animation-delay: <?= $delay ?>s">
  <div class="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-brand-blue/10">
    <a href="/product/<?= urlencode($product['slug']) ?>" class="flex flex-1 flex-col">
      <div class="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-brand-blue-light/20 to-brand-tint">
        <?php if (!empty($product['image_url'])): ?>
          <img src="<?= htmlspecialchars($product['image_url']) ?>" alt="<?= htmlspecialchars($product['name']) ?>"
               class="h-full w-full object-cover transition duration-500 group-hover:scale-110" loading="lazy">
        <?php else: ?>
          <div class="flex h-full items-center justify-center text-5xl">🫙</div>
        <?php endif; ?>
        <?php if ($product['out_of_stock']): ?>
          <span class="absolute left-2 top-2 rounded-full bg-brand-ink px-2.5 py-1 text-xs font-semibold text-white">Out of Stock</span>
        <?php endif; ?>
      </div>
      <div class="flex flex-1 flex-col gap-1 p-4 pb-2">
        <h3 class="font-display font-semibold text-brand-ink"><?= htmlspecialchars($product['name']) ?></h3>
        <p class="line-clamp-2 text-sm text-brand-ink/65"><?= htmlspecialchars($product['description']) ?></p>
        <p class="mt-2 font-display font-bold text-brand-blue"><?= format_btn((float)$product['price']) ?></p>
      </div>
    </a>
    <div class="flex gap-2 px-4 pb-4 pt-1">
      <form method="post" action="/cart-action" class="flex-1">
        <input type="hidden" name="action" value="add">
        <input type="hidden" name="product_id" value="<?= htmlspecialchars($product['id']) ?>">
        <input type="hidden" name="return" value="<?= htmlspecialchars($_SERVER['REQUEST_URI']) ?>">
        <button type="submit" <?= $product['out_of_stock'] ? 'disabled' : '' ?>
          class="w-full rounded-full border border-brand-ink/20 px-3 py-2 text-sm font-semibold text-brand-ink transition hover:bg-brand-ink/5 disabled:cursor-not-allowed disabled:opacity-40">
          Add to Cart
        </button>
      </form>
      <form method="post" action="/cart-action" class="flex-1">
        <input type="hidden" name="action" value="buy">
        <input type="hidden" name="product_id" value="<?= htmlspecialchars($product['id']) ?>">
        <button type="submit" <?= $product['out_of_stock'] ? 'disabled' : '' ?>
          class="w-full rounded-full bg-brand-ink px-3 py-2 text-sm font-semibold text-brand-tint transition hover:bg-brand-blue-light disabled:cursor-not-allowed disabled:opacity-40">
          Buy Now
        </button>
      </form>
    </div>
  </div>
</div>
