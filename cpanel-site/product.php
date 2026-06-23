<?php
require __DIR__ . '/config.php';

$slug = $_GET['slug'] ?? '';
if ($slug === '') {
    header('Location: /products.php');
    exit;
}

$db = get_db();
$stmt = $db->prepare("SELECT * FROM products WHERE slug = ? AND is_active = 1 LIMIT 1");
$stmt->bind_param('s', $slug);
$stmt->execute();
$product = $stmt->get_result()->fetch_assoc();

if (!$product) {
    http_response_code(404);
    $pageTitle = 'Not Found';
    require __DIR__ . '/includes/header.php';
    echo '<section class="mx-auto max-w-3xl px-4 py-20 text-center"><h1 class="text-2xl font-semibold">Product not found</h1><a href="/products.php" class="mt-4 inline-block text-brand-blue hover:underline">Back to products</a></section>';
    require __DIR__ . '/includes/footer.php';
    exit;
}

$pageTitle = $product['name'];
require __DIR__ . '/includes/header.php';
?>

<section class="mx-auto max-w-5xl px-4 py-14">
  <a href="/products.php" class="text-sm font-medium text-brand-ink/60 hover:text-brand-blue">&larr; Back to products</a>

  <div class="mt-6 grid grid-cols-1 gap-10 sm:grid-cols-2">
    <div class="relative aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-br from-brand-blue-light/20 to-brand-tint">
      <?php if (!empty($product['image_url'])): ?>
        <img src="<?= htmlspecialchars($product['image_url']) ?>"
             alt="<?= htmlspecialchars($product['name']) ?>"
             class="h-full w-full object-cover">
      <?php else: ?>
        <div class="flex h-full items-center justify-center text-6xl">🫙</div>
      <?php endif; ?>
    </div>

    <div>
      <h1 class="text-3xl font-bold"><?= htmlspecialchars($product['name']) ?></h1>
      <p class="mt-3 text-brand-ink/70"><?= htmlspecialchars($product['description']) ?></p>
      <p class="mt-4 text-2xl font-bold text-brand-blue"><?= format_btn((float)$product['price']) ?></p>

      <?php if ($product['out_of_stock']): ?>
        <p class="mt-6 inline-block rounded-full bg-brand-ink px-4 py-2 text-sm font-semibold text-white">Out of Stock</p>
      <?php else: ?>
        <p class="mt-6 text-sm text-brand-ink/60">To order, contact us directly — cash on delivery or bank transfer, anywhere in Bhutan.</p>
      <?php endif; ?>
    </div>
  </div>
</section>

<?php require __DIR__ . '/includes/footer.php'; ?>
