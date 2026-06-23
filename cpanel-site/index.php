<?php
require __DIR__ . '/config.php';
$pageTitle = 'Home';

$db = get_db();
$result = $db->query(
    "SELECT * FROM products WHERE is_active = 1 ORDER BY created_at DESC LIMIT 8"
);
$featured = $result->fetch_all(MYSQLI_ASSOC);

require __DIR__ . '/includes/header.php';
?>

<section class="border-b border-black/5 bg-white">
  <div class="mx-auto max-w-6xl px-4 py-16 text-center">
    <p class="text-xs font-semibold uppercase tracking-[0.25em] text-brand-blue">Handmade in Bhutan</p>
    <h1 class="mt-3 text-3xl font-bold sm:text-5xl">Pickles &amp; Pantry Staples, Made by Hand</h1>
    <p class="mx-auto mt-4 max-w-xl text-brand-ink/70">
      Fresh, local ingredients turned into authentic Bhutanese pickles, soups and spices — delivered across Bhutan.
    </p>
  </div>
</section>

<section class="mx-auto max-w-6xl px-4 py-14">
  <div class="mb-8 flex items-end justify-between">
    <h2 class="text-2xl font-semibold">From the Pantry</h2>
    <a href="/products.php" class="text-sm font-medium text-brand-ink/60 hover:text-brand-blue">View all &rarr;</a>
  </div>

  <?php if (empty($featured)): ?>
    <p class="text-brand-ink/60">Products coming soon. Check back shortly!</p>
  <?php else: ?>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <?php foreach ($featured as $product): ?>
        <?php include __DIR__ . '/includes/product-card.php'; ?>
      <?php endforeach; ?>
    </div>
  <?php endif; ?>
</section>

<?php require __DIR__ . '/includes/footer.php'; ?>
