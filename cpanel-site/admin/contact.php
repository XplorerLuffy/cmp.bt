<?php
require __DIR__ . '/../includes/bootstrap.php';
require __DIR__ . '/../includes/admin-auth.php';
require_admin();
$adminTitle = 'Contact Details';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    set_setting('contact_phone', trim($_POST['contact_phone'] ?? ''));
    set_setting('contact_email', trim($_POST['contact_email'] ?? ''));
    set_setting('contact_location', trim($_POST['contact_location'] ?? ''));
    redirect('/admin/contact?saved=1');
}
$saved = isset($_GET['saved']);

require __DIR__ . '/../includes/admin-layout.php';
?>
<h1 class="mb-1 text-2xl font-bold text-brand-ink">Contact Details</h1>
<p class="mb-5 text-sm text-brand-ink/50">Shown on <a href="/contact" target="_blank" class="text-brand-blue hover:underline">/contact</a> and in the site footer.</p>

<?php if ($saved): ?><p class="mb-4 max-w-xl rounded-lg bg-accent-green-tint p-3 text-sm font-medium text-accent-green">Saved! Changes are live on the site.</p><?php endif; ?>

<form method="post" class="flex w-full max-w-xl flex-col gap-4 rounded-xl border border-brand-ink/10 bg-white p-5 shadow-sm sm:p-6">
  <label class="flex flex-col gap-1"><span class="text-sm font-medium text-brand-ink/80">Phone</span>
    <input name="contact_phone" value="<?= htmlspecialchars(get_setting('contact_phone')) ?>" class="rounded-lg border border-brand-ink/15 p-2.5"></label>
  <label class="flex flex-col gap-1"><span class="text-sm font-medium text-brand-ink/80">Email</span>
    <input name="contact_email" value="<?= htmlspecialchars(get_setting('contact_email')) ?>" class="rounded-lg border border-brand-ink/15 p-2.5"></label>
  <label class="flex flex-col gap-1"><span class="text-sm font-medium text-brand-ink/80">Location</span>
    <input name="contact_location" value="<?= htmlspecialchars(get_setting('contact_location')) ?>" class="rounded-lg border border-brand-ink/15 p-2.5"></label>
  <button type="submit" class="w-full rounded-full bg-brand-ink px-6 py-3 font-semibold text-brand-tint sm:w-auto">Save Changes</button>
</form>

<?php require __DIR__ . '/../includes/admin-layout-end.php'; ?>
