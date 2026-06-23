<?php
require __DIR__ . '/config.php';
$pageTitle = 'Shop';

$db = get_db();
$result = $db->query("SELECT * FROM products WHERE is_active = 1 ORDER BY created_at DESC");
$products = $result->fetch_all(MYSQLI_ASSOC);

require __DIR__ . '/includes/header.php';
?>

<div class="border-b border-brand-ink/10 bg-white">
  <div class="reveal mx-auto max-w-6xl px-4 py-10 text-center sm:text-left">
    <p class="text-xs font-semibold uppercase tracking-[0.25em] text-brand-blue">The Collection</p>
    <h1 class="font-display text-3xl font-medium text-brand-ink sm:text-4xl">Our Pickles</h1>
  </div>
</div>

<div class="mx-auto max-w-6xl px-4 py-10">
  <?php if (empty($products)): ?>
    <p class="text-brand-ink/60">No products available yet. Check back soon!</p>
  <?php else: ?>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <?php foreach ($products as $cardIndex => $product): ?>
        <?php include __DIR__ . '/includes/product-card.php'; ?>
      <?php endforeach; ?>
    </div>
  <?php endif; ?>
</div>

<?php require __DIR__ . '/includes/footer.php'; ?>
