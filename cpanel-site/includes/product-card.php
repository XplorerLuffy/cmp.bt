<?php
/** Expects $product (associative array) and optional $cardIndex for stagger. */
$delay = isset($cardIndex) ? ($cardIndex % 4) * 0.08 : 0;
?>
<div class="reveal" style="animation-delay: <?= $delay ?>s">
  <a href="/product/<?= urlencode($product['slug']) ?>"
     class="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-brand-blue/10">
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
    <div class="flex flex-1 flex-col gap-1 p-4">
      <h3 class="font-display font-semibold text-brand-ink"><?= htmlspecialchars($product['name']) ?></h3>
      <p class="line-clamp-2 text-sm text-brand-ink/65"><?= htmlspecialchars($product['description']) ?></p>
      <p class="mt-2 font-display font-bold text-brand-blue"><?= format_btn((float)$product['price']) ?></p>
      <div class="mt-3">
        <span class="inline-flex w-full items-center justify-center rounded-full bg-brand-ink px-3 py-2 text-sm font-semibold text-brand-tint transition group-hover:bg-brand-blue-light">
          View Product
        </span>
      </div>
    </div>
  </a>
</div>
