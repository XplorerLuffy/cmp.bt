<?php
/** Expects $product as an associative array (row from `products` table). */
?>
<a href="/product.php?slug=<?= urlencode($product['slug']) ?>"
   class="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl">
  <div class="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-brand-blue-light/20 to-brand-tint">
    <?php if (!empty($product['image_url'])): ?>
      <img src="<?= htmlspecialchars($product['image_url']) ?>"
           alt="<?= htmlspecialchars($product['name']) ?>"
           class="h-full w-full object-cover transition duration-500 group-hover:scale-110" loading="lazy">
    <?php else: ?>
      <div class="flex h-full items-center justify-center text-5xl">🫙</div>
    <?php endif; ?>
    <?php if ($product['out_of_stock']): ?>
      <span class="absolute left-2 top-2 rounded-full bg-brand-ink px-2.5 py-1 text-xs font-semibold text-white">Out of Stock</span>
    <?php endif; ?>
  </div>
  <div class="flex flex-1 flex-col gap-1 p-4">
    <h3 class="font-semibold"><?= htmlspecialchars($product['name']) ?></h3>
    <p class="line-clamp-2 text-sm text-brand-ink/65"><?= htmlspecialchars($product['description']) ?></p>
    <p class="mt-2 font-bold text-brand-blue"><?= format_btn((float)$product['price']) ?></p>
  </div>
</a>
