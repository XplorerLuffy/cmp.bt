<?php
require __DIR__ . '/config.php';

$slug = $_GET['slug'] ?? '';
if ($slug === '') { header('Location: /products'); exit; }

$db = get_db();
$stmt = $db->prepare("SELECT * FROM products WHERE slug = ? AND is_active = 1 LIMIT 1");
$stmt->bind_param('s', $slug);
$stmt->execute();
$product = $stmt->get_result()->fetch_assoc();

if (!$product) {
    http_response_code(404);
    $pageTitle = 'Not Found';
    require __DIR__ . '/includes/header.php';
    echo '<section class="mx-auto max-w-3xl px-4 py-24 text-center"><h1 class="font-display text-2xl font-medium">Product not found</h1><a href="/products" class="mt-4 inline-block text-brand-blue hover:underline">&larr; Back to Shop</a></section>';
    require __DIR__ . '/includes/footer.php';
    exit;
}

$pageTitle = $product['name'];
require __DIR__ . '/includes/header.php';
?>

<div class="mx-auto max-w-5xl px-4 py-10">
  <a href="/products" class="mb-6 inline-block text-sm font-medium text-brand-ink/60 hover:text-brand-blue">&larr; Back to Shop</a>

  <div class="reveal grid gap-10 sm:grid-cols-2">
    <div class="relative aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-br from-brand-blue/10 to-brand-tint">
      <?php if (!empty($product['image_url'])): ?>
        <img src="<?= htmlspecialchars($product['image_url']) ?>" alt="<?= htmlspecialchars($product['name']) ?>" class="h-full w-full object-cover">
      <?php else: ?>
        <div class="flex h-full items-center justify-center text-6xl">🫙</div>
      <?php endif; ?>
    </div>

    <div class="flex flex-col gap-5">
      <div>
        <?php if (!empty($product['category'])): ?>
          <p class="text-xs font-semibold uppercase tracking-[0.25em] text-brand-blue"><?= htmlspecialchars($product['category']) ?></p>
        <?php endif; ?>
        <h1 class="font-display text-3xl font-medium text-brand-ink"><?= htmlspecialchars($product['name']) ?></h1>
        <p class="mt-2 font-display text-2xl font-bold text-brand-blue"><?= format_btn((float)$product['price']) ?></p>
      </div>

      <p class="leading-relaxed text-brand-ink/80"><?= htmlspecialchars($product['description']) ?></p>

      <?php if (!empty($product['ingredients'])): ?>
        <div class="rounded-xl border border-brand-ink/10 bg-white p-4">
          <h2 class="mb-1 font-display font-semibold text-brand-ink">Ingredients</h2>
          <p class="text-sm text-brand-ink/70"><?= htmlspecialchars($product['ingredients']) ?></p>
        </div>
      <?php endif; ?>

      <?php if ($product['out_of_stock']): ?>
        <span class="inline-block rounded-full bg-brand-ink px-5 py-3 text-center text-sm font-semibold text-white">Out of Stock</span>
      <?php else: ?>
        <div class="rounded-xl border border-brand-blue/20 bg-brand-blue/5 p-4">
          <p class="text-sm text-brand-ink/75">To order, <a href="/contact" class="font-semibold text-brand-blue hover:underline">contact us</a> — cash on delivery or bank transfer, anywhere in Bhutan.</p>
        </div>
      <?php endif; ?>
    </div>
  </div>
</div>

<?php require __DIR__ . '/includes/footer.php'; ?>
