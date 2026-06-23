<?php
require __DIR__ . '/config.php';
$pageTitle = 'Products';

$db = get_db();
$result = $db->query(
    "SELECT * FROM products WHERE is_active = 1 ORDER BY created_at DESC"
);
$products = $result->fetch_all(MYSQLI_ASSOC);

require __DIR__ . '/includes/header.php';
?>

<section class="mx-auto max-w-6xl px-4 py-14">
  <h1 class="mb-8 text-2xl font-semibold">All Products</h1>

  <?php if (empty($products)): ?>
    <p class="text-brand-ink/60">No products available right now.</p>
  <?php else: ?>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <?php foreach ($products as $product): ?>
        <?php include __DIR__ . '/includes/product-card.php'; ?>
      <?php endforeach; ?>
    </div>
  <?php endif; ?>
</section>

<?php require __DIR__ . '/includes/footer.php'; ?>
