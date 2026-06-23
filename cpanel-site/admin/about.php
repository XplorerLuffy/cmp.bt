<?php
require __DIR__ . '/../includes/bootstrap.php';
require __DIR__ . '/../includes/admin-auth.php';
require_admin();
$adminTitle = 'About Page';

$saved = false;
$error = '';

function about_handle_upload(): ?string {
    if (empty($_FILES['image']['name']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) return null;
    $allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/gif' => 'gif'];
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = finfo_file($finfo, $_FILES['image']['tmp_name']);
    finfo_close($finfo);
    if (!isset($allowed[$mime]) || $_FILES['image']['size'] > 5 * 1024 * 1024) return null;
    $dir = __DIR__ . '/../uploads';
    if (!is_dir($dir)) @mkdir($dir, 0755, true);
    $name = 'about-' . bin2hex(random_bytes(8)) . '.' . $allowed[$mime];
    if (!move_uploaded_file($_FILES['image']['tmp_name'], "$dir/$name")) return null;
    return '/uploads/' . $name;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    set_setting('about_title', trim($_POST['about_title'] ?? ''));
    set_setting('about_intro', trim($_POST['about_intro'] ?? ''));
    set_setting('about_commitment_title', trim($_POST['about_commitment_title'] ?? ''));
    set_setting('about_commitment_text', trim($_POST['about_commitment_text'] ?? ''));
    $img = about_handle_upload();
    if ($img) set_setting('about_image', $img);
    redirect('/admin/about?saved=1');
}
$saved = isset($_GET['saved']);

$title       = get_setting('about_title');
$image       = get_setting('about_image', '/logo.png');
$intro       = get_setting('about_intro');
$commitTitle = get_setting('about_commitment_title', 'Our Commitment');
$commitText  = get_setting('about_commitment_text');

require __DIR__ . '/../includes/admin-layout.php';
?>
<h1 class="mb-1 text-2xl font-bold text-brand-ink">About Page</h1>
<p class="mb-5 text-sm text-brand-ink/50">Edit the content shown on <a href="/about" target="_blank" class="text-brand-blue hover:underline">/about</a>.</p>

<?php if ($saved): ?><p class="mb-4 max-w-2xl rounded-lg bg-accent-green-tint p-3 text-sm font-medium text-accent-green">Saved! Changes are live on the site.</p><?php endif; ?>

<form method="post" enctype="multipart/form-data" class="flex w-full max-w-2xl flex-col gap-4 rounded-xl border border-brand-ink/10 bg-white p-5 shadow-sm sm:p-6">
  <label class="flex flex-col gap-1"><span class="text-sm font-medium text-brand-ink/80">Heading</span>
    <input name="about_title" value="<?= htmlspecialchars($title) ?>" class="rounded-lg border border-brand-ink/15 p-2.5"></label>

  <label class="flex flex-col gap-1"><span class="text-sm font-medium text-brand-ink/80">Image</span>
    <?php if ($image): ?><img src="<?= htmlspecialchars($image) ?>" alt="" class="mb-2 max-h-40 w-auto rounded-lg object-contain"><?php endif; ?>
    <input type="file" name="image" accept="image/*" class="text-sm text-brand-ink/70 file:mr-3 file:rounded-full file:border-0 file:bg-brand-blue file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-blue-dark">
    <span class="text-xs text-brand-ink/50">Leave empty to keep the current image.</span></label>

  <label class="flex flex-col gap-1"><span class="text-sm font-medium text-brand-ink/80">Story (leave a blank line between paragraphs)</span>
    <textarea name="about_intro" rows="8" class="rounded-lg border border-brand-ink/15 p-2.5"><?= htmlspecialchars($intro) ?></textarea></label>

  <label class="flex flex-col gap-1"><span class="text-sm font-medium text-brand-ink/80">Commitment Heading</span>
    <input name="about_commitment_title" value="<?= htmlspecialchars($commitTitle) ?>" class="rounded-lg border border-brand-ink/15 p-2.5"></label>

  <label class="flex flex-col gap-1"><span class="text-sm font-medium text-brand-ink/80">Commitment Text</span>
    <textarea name="about_commitment_text" rows="3" class="rounded-lg border border-brand-ink/15 p-2.5"><?= htmlspecialchars($commitText) ?></textarea></label>

  <button type="submit" class="w-full rounded-full bg-brand-ink px-6 py-3 font-semibold text-brand-tint sm:w-auto">Save Changes</button>
</form>

<?php require __DIR__ . '/../includes/admin-layout-end.php'; ?>
