<?php
require __DIR__ . '/../includes/bootstrap.php';
require __DIR__ . '/../includes/admin-auth.php';
require_admin();
$adminTitle = 'Homepage';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    set_setting('home_tagline', trim($_POST['home_tagline'] ?? ''));
    set_setting('home_heading', trim($_POST['home_heading'] ?? ''));
    set_setting('home_subtext', trim($_POST['home_subtext'] ?? ''));
    foreach ([1, 2, 3] as $n) {
        set_setting("home_feature{$n}_emoji", trim($_POST["home_feature{$n}_emoji"] ?? ''));
        set_setting("home_feature{$n}_title", trim($_POST["home_feature{$n}_title"] ?? ''));
        set_setting("home_feature{$n}_text", trim($_POST["home_feature{$n}_text"] ?? ''));
    }
    redirect('/admin/home?saved=1');
}
$saved = isset($_GET['saved']);

$tagline = get_setting('home_tagline', 'Handmade in Bhutan');
$heading = get_setting('home_heading', "Achaar, crafted under\na crystal moon.");
$subtext = get_setting('home_subtext', 'Small-batch Bhutanese pickles made with traditional family recipes, fresh local chilies, and a whole lot of patience.');

$featureDefaults = [
    1 => ['🤲', 'Handmade in Bhutan', 'Every jar is made by hand using recipes passed down through generations.'],
    2 => ['🌿', 'Fresh, Local Ingredients', 'We source chilies, vegetables, and spices from local Bhutanese farmers.'],
    3 => ['🚚', 'Delivered Across Bhutan', 'Cash on delivery or bank transfer — order from anywhere in the country.'],
];

require __DIR__ . '/../includes/admin-layout.php';
?>
<h1 class="mb-1 text-2xl font-bold text-brand-ink">Homepage</h1>
<p class="mb-5 text-sm text-brand-ink/50">Edit the hero text and feature strip shown on <a href="/" target="_blank" class="text-brand-blue hover:underline">/</a>.</p>

<?php if ($saved): ?><p class="mb-4 max-w-2xl rounded-lg bg-accent-green-tint p-3 text-sm font-medium text-accent-green">Saved! Changes are live on the site.</p><?php endif; ?>

<form method="post" class="flex w-full max-w-2xl flex-col gap-6">
  <div class="flex flex-col gap-4 rounded-xl border border-brand-ink/10 bg-white p-5 shadow-sm sm:p-6">
    <h2 class="font-display font-semibold text-brand-ink">Hero</h2>
    <label class="flex flex-col gap-1"><span class="text-sm font-medium text-brand-ink/80">Tagline (small text above heading)</span>
      <input name="home_tagline" value="<?= htmlspecialchars($tagline) ?>" class="rounded-lg border border-brand-ink/15 p-2.5"></label>

    <label class="flex flex-col gap-1"><span class="text-sm font-medium text-brand-ink/80">Heading (use a new line for a line break)</span>
      <textarea name="home_heading" rows="2" class="rounded-lg border border-brand-ink/15 p-2.5"><?= htmlspecialchars($heading) ?></textarea></label>

    <label class="flex flex-col gap-1"><span class="text-sm font-medium text-brand-ink/80">Subtext</span>
      <textarea name="home_subtext" rows="3" class="rounded-lg border border-brand-ink/15 p-2.5"><?= htmlspecialchars($subtext) ?></textarea></label>
  </div>

  <div class="flex flex-col gap-4 rounded-xl border border-brand-ink/10 bg-white p-5 shadow-sm sm:p-6">
    <h2 class="font-display font-semibold text-brand-ink">Feature Strip</h2>
    <?php foreach ([1, 2, 3] as $n): ?>
      <div class="flex flex-col gap-2 border-t border-brand-ink/10 pt-4 first:border-t-0 first:pt-0">
        <div class="grid gap-3 sm:grid-cols-[80px_1fr]">
          <label class="flex flex-col gap-1"><span class="text-sm font-medium text-brand-ink/80">Icon</span>
            <input name="home_feature<?= $n ?>_emoji" value="<?= htmlspecialchars(get_setting("home_feature{$n}_emoji", $featureDefaults[$n][0])) ?>" class="rounded-lg border border-brand-ink/15 p-2.5 text-center"></label>
          <label class="flex flex-col gap-1"><span class="text-sm font-medium text-brand-ink/80">Title</span>
            <input name="home_feature<?= $n ?>_title" value="<?= htmlspecialchars(get_setting("home_feature{$n}_title", $featureDefaults[$n][1])) ?>" class="rounded-lg border border-brand-ink/15 p-2.5"></label>
        </div>
        <label class="flex flex-col gap-1"><span class="text-sm font-medium text-brand-ink/80">Text</span>
          <input name="home_feature<?= $n ?>_text" value="<?= htmlspecialchars(get_setting("home_feature{$n}_text", $featureDefaults[$n][2])) ?>" class="rounded-lg border border-brand-ink/15 p-2.5"></label>
      </div>
    <?php endforeach; ?>
  </div>

  <button type="submit" class="w-full rounded-full bg-brand-ink px-6 py-3 font-semibold text-brand-tint sm:w-auto">Save Changes</button>
</form>

<?php require __DIR__ . '/../includes/admin-layout-end.php'; ?>
