<?php
require __DIR__ . '/includes/bootstrap.php';
require __DIR__ . '/includes/settings.php';
$pageTitle = 'About';

$title          = get_setting('about_title', 'Our Story');
$image          = get_setting('about_image', '/logo.png');
$intro          = get_setting('about_intro', '');
$commitTitle    = get_setting('about_commitment_title', 'Our Commitment');
$commitText     = get_setting('about_commitment_text', '');

require __DIR__ . '/includes/header.php';
?>

<div class="border-b border-brand-ink/10 bg-white">
  <div class="reveal mx-auto max-w-3xl px-4 py-12 text-center">
    <img src="<?= htmlspecialchars($image ?: '/logo.png') ?>" alt="Crystal Moon Products" class="mx-auto mb-3 max-h-48 w-auto rounded-2xl object-contain">
    <p class="text-xs font-semibold uppercase tracking-[0.25em] text-brand-blue">Our Story</p>
    <h1 class="font-display text-3xl font-medium text-brand-ink sm:text-4xl"><?= htmlspecialchars($title) ?></h1>
  </div>
</div>

<div class="reveal mx-auto max-w-3xl px-4 py-12">
  <div class="flex flex-col gap-5 leading-relaxed text-brand-ink/80">
    <?php foreach (preg_split('/\n\s*\n/', trim($intro)) as $para): if (trim($para) === '') continue; ?>
      <p><?= nl2br(htmlspecialchars(trim($para))) ?></p>
    <?php endforeach; ?>
    <?php if (trim($commitText) !== ''): ?>
      <h2 class="mt-2 font-display text-xl font-medium text-brand-ink"><?= htmlspecialchars($commitTitle) ?></h2>
      <p><?= nl2br(htmlspecialchars(trim($commitText))) ?></p>
    <?php endif; ?>
  </div>
</div>

<?php require __DIR__ . '/includes/footer.php'; ?>
