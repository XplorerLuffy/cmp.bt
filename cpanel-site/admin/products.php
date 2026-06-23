<?php
require __DIR__ . '/../includes/bootstrap.php';
require __DIR__ . '/../includes/admin-auth.php';
require_admin();
$adminTitle = 'Products';

$db = get_db();
$products = $db->query("SELECT * FROM products ORDER BY created_at DESC")->fetch_all(MYSQLI_ASSOC);

require __DIR__ . '/../includes/admin-layout.php';
?>
<div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
  <div>
    <h1 class="text-2xl font-bold text-brand-ink">Products</h1>
    <p class="text-sm text-brand-ink/50"><?= count($products) ?> total</p>
  </div>
  <a href="/admin/product-edit" class="inline-block w-fit rounded-full bg-brand-ink px-4 py-2 text-sm font-semibold text-brand-tint">+ Add Product</a>
</div>

<?php if (!$products): ?>
  <p class="rounded-xl border border-brand-ink/10 bg-white p-6 text-center text-brand-ink/50 shadow-sm">No products yet. Add your first one!</p>
<?php else: ?>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <?php foreach ($products as $p): ?>
      <div class="flex flex-col gap-3 rounded-xl border border-brand-ink/10 bg-white p-4 shadow-sm">
        <div class="flex items-start gap-3">
          <div class="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-brand-tint">
            <?php if (!empty($p['image_url'])): ?>
              <img src="<?= htmlspecialchars($p['image_url']) ?>" alt="" class="h-full w-full object-cover">
            <?php else: ?><div class="flex h-full items-center justify-center text-2xl">🫙</div><?php endif; ?>
          </div>
          <div class="min-w-0 flex-1">
            <a href="/admin/product-edit?id=<?= urlencode($p['id']) ?>" class="font-medium text-brand-blue hover:underline"><?= htmlspecialchars($p['name']) ?></a>
            <p class="text-sm text-brand-ink/60"><?= htmlspecialchars($p['category']) ?></p>
            <p class="font-semibold text-brand-ink"><?= format_btn((float)$p['price']) ?></p>
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-1.5 text-xs">
          <span class="text-brand-ink/60">Stock: <?= (int)$p['stock'] ?></span>
          <?php if (!$p['is_active']): ?><span class="rounded-full bg-brand-ink/10 px-2 py-0.5 font-medium text-brand-ink/60">Inactive</span><?php endif; ?>
          <?php
            if ($p['out_of_stock'] || $p['stock'] == 0) echo '<span class="rounded-full bg-accent-rose-tint px-2 py-0.5 font-semibold text-accent-rose">Out of Stock</span>';
            elseif ($p['stock'] <= 5) echo '<span class="rounded-full bg-accent-amber-tint px-2 py-0.5 font-semibold text-accent-amber">Low Stock</span>';
            else echo '<span class="rounded-full bg-accent-green-tint px-2 py-0.5 font-semibold text-accent-green">In Stock</span>';
          ?>
        </div>
        <div class="flex gap-2 border-t border-brand-ink/5 pt-3">
          <a href="/admin/product-edit?id=<?= urlencode($p['id']) ?>" class="flex-1 rounded-lg border border-brand-ink/15 px-3 py-1.5 text-center text-sm font-medium hover:bg-brand-tint">Edit</a>
          <form method="post" action="/admin/product-edit" onsubmit="return confirm('Delete this product?')">
            <input type="hidden" name="action" value="delete">
            <input type="hidden" name="id" value="<?= htmlspecialchars($p['id']) ?>">
            <button class="rounded-lg border border-accent-rose/30 px-3 py-1.5 text-sm font-medium text-accent-rose hover:bg-accent-rose-tint">Delete</button>
          </form>
        </div>
      </div>
    <?php endforeach; ?>
  </div>
<?php endif; ?>

<?php require __DIR__ . '/../includes/admin-layout-end.php'; ?>
