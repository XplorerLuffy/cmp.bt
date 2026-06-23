<?php
require __DIR__ . '/../includes/bootstrap.php';
require __DIR__ . '/../includes/admin-auth.php';
require_admin();
$db = get_db();

function slugify(string $s): string {
    $s = strtolower(trim($s));
    $s = preg_replace('/[^a-z0-9]+/', '-', $s);
    return trim($s, '-') ?: 'product';
}

function unique_slug(mysqli $db, string $base, ?string $excludeId): string {
    $slug = $base; $i = 2;
    while (true) {
        if ($excludeId) {
            $stmt = $db->prepare("SELECT id FROM products WHERE slug = ? AND id <> ? LIMIT 1");
            $stmt->bind_param('ss', $slug, $excludeId);
        } else {
            $stmt = $db->prepare("SELECT id FROM products WHERE slug = ? LIMIT 1");
            $stmt->bind_param('s', $slug);
        }
        $stmt->execute();
        if (!$stmt->get_result()->fetch_assoc()) return $slug;
        $slug = $base . '-' . $i++;
    }
}

function handle_upload(): ?string {
    if (empty($_FILES['image']['name']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) return null;
    $allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/gif' => 'gif'];
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = finfo_file($finfo, $_FILES['image']['tmp_name']);
    finfo_close($finfo);
    if (!isset($allowed[$mime])) return null;
    if ($_FILES['image']['size'] > 5 * 1024 * 1024) return null; // 5MB cap
    $dir = __DIR__ . '/../uploads';
    if (!is_dir($dir)) @mkdir($dir, 0755, true);
    $name = bin2hex(random_bytes(12)) . '.' . $allowed[$mime];
    if (!move_uploaded_file($_FILES['image']['tmp_name'], "$dir/$name")) return null;
    return '/uploads/' . $name;
}

$error = '';
$editing = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? 'save';

    if ($action === 'delete') {
        $id = $_POST['id'] ?? '';
        $stmt = $db->prepare("DELETE FROM products WHERE id = ?");
        $stmt->bind_param('s', $id);
        $stmt->execute();
        redirect('/cmp/products');
    }

    // Save (create or update)
    $id          = $_POST['id'] ?? '';
    $name        = trim($_POST['name'] ?? '');
    $description = trim($_POST['description'] ?? '');
    $ingredients = trim($_POST['ingredients'] ?? '');
    $category    = trim($_POST['category'] ?? '');
    $price       = (int)($_POST['price'] ?? 0);
    $stock       = (int)($_POST['stock'] ?? 0);
    $isActive    = isset($_POST['is_active']) ? 1 : 0;
    $outOfStock  = isset($_POST['out_of_stock']) ? 1 : 0;
    $ingredientsVal = $ingredients !== '' ? $ingredients : null;

    if ($name === '' || $description === '' || $category === '' || $price < 1) {
        $error = 'Please fill in name, description, category and a valid price.';
    } else {
        $imagePath = handle_upload();
        if ($id !== '') {
            // Update
            $slug = unique_slug($db, slugify($name), $id);
            if ($imagePath) {
                $stmt = $db->prepare("UPDATE products SET name=?, slug=?, description=?, ingredients=?, category=?, price=?, stock=?, is_active=?, out_of_stock=?, image_url=? WHERE id=?");
                $stmt->bind_param('sssssiiiiss', $name, $slug, $description, $ingredientsVal, $category, $price, $stock, $isActive, $outOfStock, $imagePath, $id);
            } else {
                $stmt = $db->prepare("UPDATE products SET name=?, slug=?, description=?, ingredients=?, category=?, price=?, stock=?, is_active=?, out_of_stock=? WHERE id=?");
                $stmt->bind_param('sssssiiiis', $name, $slug, $description, $ingredientsVal, $category, $price, $stock, $isActive, $outOfStock, $id);
            }
            $stmt->execute();
            redirect('/cmp/products');
        } else {
            // Create
            $newId = gen_id();
            $slug = unique_slug($db, slugify($name), null);
            $stmt = $db->prepare("INSERT INTO products (id, slug, name, description, ingredients, category, price, image_url, stock, is_active, out_of_stock) VALUES (?,?,?,?,?,?,?,?,?,?,?)");
            $stmt->bind_param('ssssssisiii', $newId, $slug, $name, $description, $ingredientsVal, $category, $price, $imagePath, $stock, $isActive, $outOfStock);
            $stmt->execute();
            redirect('/cmp/products');
        }
    }
}

// Load existing for edit form
$id = $_GET['id'] ?? ($_POST['id'] ?? '');
if ($id !== '') {
    $stmt = $db->prepare("SELECT * FROM products WHERE id = ? LIMIT 1");
    $stmt->bind_param('s', $id);
    $stmt->execute();
    $editing = $stmt->get_result()->fetch_assoc();
}
$isEdit = (bool)$editing;
$adminTitle = $isEdit ? 'Edit Product' : 'Add Product';
$v = function ($key, $default = '') use ($editing) { return htmlspecialchars($editing[$key] ?? $default); };

require __DIR__ . '/../includes/admin-layout.php';
?>
<a href="/cmp/products" class="mb-4 inline-block text-sm font-medium text-brand-ink/60 hover:text-brand-blue">&larr; Back to Products</a>
<h1 class="mb-5 text-2xl font-bold text-brand-ink"><?= $isEdit ? 'Edit Product' : 'Add Product' ?></h1>

<?php if ($error): ?><p class="mb-4 max-w-xl rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600"><?= htmlspecialchars($error) ?></p><?php endif; ?>

<form method="post" enctype="multipart/form-data" class="flex w-full max-w-xl flex-col gap-4 rounded-xl border border-brand-ink/10 bg-white p-5 shadow-sm sm:p-6">
  <?php if ($isEdit): ?><input type="hidden" name="id" value="<?= $v('id') ?>"><?php endif; ?>

  <label class="flex flex-col gap-1"><span class="text-sm font-medium text-brand-ink/80">Name</span>
    <input name="name" required value="<?= $v('name') ?>" class="rounded-lg border border-brand-ink/15 p-2.5"></label>

  <label class="flex flex-col gap-1"><span class="text-sm font-medium text-brand-ink/80">Description</span>
    <textarea name="description" required rows="3" class="rounded-lg border border-brand-ink/15 p-2.5"><?= $v('description') ?></textarea></label>

  <label class="flex flex-col gap-1"><span class="text-sm font-medium text-brand-ink/80">Ingredients (optional)</span>
    <textarea name="ingredients" rows="2" class="rounded-lg border border-brand-ink/15 p-2.5"><?= $v('ingredients') ?></textarea></label>

  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <label class="flex flex-col gap-1"><span class="text-sm font-medium text-brand-ink/80">Price (Nu.)</span>
      <input name="price" type="number" min="1" required value="<?= $v('price') ?>" class="rounded-lg border border-brand-ink/15 p-2.5"></label>
    <label class="flex flex-col gap-1"><span class="text-sm font-medium text-brand-ink/80">Stock Quantity</span>
      <input name="stock" type="number" min="0" required value="<?= $isEdit ? $v('stock') : '100' ?>" class="rounded-lg border border-brand-ink/15 p-2.5"></label>
  </div>

  <label class="flex flex-col gap-1"><span class="text-sm font-medium text-brand-ink/80">Category / Flavor Type</span>
    <input name="category" required placeholder="e.g. Chili Achaar, Mango Pickle" value="<?= $v('category') ?>" class="rounded-lg border border-brand-ink/15 p-2.5"></label>

  <label class="flex flex-col gap-1"><span class="text-sm font-medium text-brand-ink/80"><?= $isEdit ? 'Replace Image (optional)' : 'Product Image' ?></span>
    <?php if ($isEdit && !empty($editing['image_url'])): ?>
      <img src="<?= $v('image_url') ?>" alt="" class="mb-2 h-24 w-24 rounded object-cover">
    <?php endif; ?>
    <input type="file" name="image" accept="image/*" class="text-sm text-brand-ink/70 file:mr-3 file:rounded-full file:border-0 file:bg-brand-blue file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-blue-dark"></label>

  <div class="flex flex-wrap gap-5">
    <label class="flex items-center gap-2 text-sm font-medium text-brand-ink/80">
      <input type="checkbox" name="is_active" <?= (!$isEdit || $editing['is_active']) ? 'checked' : '' ?>> Active (visible on site)</label>
    <label class="flex items-center gap-2 text-sm font-medium text-brand-ink/80">
      <input type="checkbox" name="out_of_stock" <?= ($isEdit && $editing['out_of_stock']) ? 'checked' : '' ?>> Mark Out of Stock</label>
  </div>

  <button type="submit" class="w-full rounded-full bg-brand-ink px-6 py-3 font-semibold text-brand-tint sm:w-auto"><?= $isEdit ? 'Save Changes' : 'Add Product' ?></button>
</form>

<?php require __DIR__ . '/../includes/admin-layout-end.php'; ?>
