<?php
require __DIR__ . '/config.php';
$pageTitle = 'Contact';

$sent = false;
$error = '';
$old = ['name' => '', 'email' => '', 'message' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $message = trim($_POST['message'] ?? '');
    $old = ['name' => $name, 'email' => $email, 'message' => $message];

    if ($name === '' || $email === '' || $message === '') {
        $error = 'Please fill in all fields.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = 'Please enter a valid email address.';
    } else {
        $db = get_db();
        $stmt = $db->prepare("INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)");
        $stmt->bind_param('sss', $name, $email, $message);
        if ($stmt->execute()) {
            $sent = true;
            $old = ['name' => '', 'email' => '', 'message' => ''];
        } else {
            $error = 'Something went wrong. Please try again or call us directly.';
        }
    }
}

require __DIR__ . '/includes/header.php';
?>

<div class="border-b border-brand-ink/10 bg-white">
  <div class="reveal mx-auto max-w-3xl px-4 py-12 text-center">
    <p class="text-xs font-semibold uppercase tracking-[0.25em] text-brand-blue">Get in Touch</p>
    <h1 class="font-display text-3xl font-medium text-brand-ink sm:text-4xl">Contact Us</h1>
  </div>
</div>

<div class="mx-auto max-w-3xl px-4 py-12">
  <div class="mb-10 grid gap-4 sm:grid-cols-3">
    <?php
    $cards = [['📞', 'Phone', '+975 17 123 456'], ['✉️', 'Email', 'hello@cmp.bt'], ['📍', 'Location', 'Thimphu, Bhutan']];
    foreach ($cards as [$icon, $label, $value]): ?>
      <div class="rounded-xl border border-brand-ink/10 bg-white p-4 text-center">
        <div class="mb-1 text-2xl"><?= $icon ?></div>
        <p class="text-xs uppercase tracking-wide text-brand-ink/50"><?= $label ?></p>
        <p class="font-medium text-brand-ink"><?= $value ?></p>
      </div>
    <?php endforeach; ?>
  </div>

  <?php if ($sent): ?>
    <p class="rounded-xl bg-green-50 p-4 font-medium text-green-700">Thanks for reaching out! We&apos;ll get back to you soon.</p>
  <?php else: ?>
    <form method="post" class="flex flex-col gap-4">
      <input required name="name" placeholder="Your Name" value="<?= htmlspecialchars($old['name']) ?>" class="rounded-xl border border-brand-ink/15 p-3 outline-none focus:border-brand-blue">
      <input required type="email" name="email" placeholder="Your Email" value="<?= htmlspecialchars($old['email']) ?>" class="rounded-xl border border-brand-ink/15 p-3 outline-none focus:border-brand-blue">
      <textarea required name="message" rows="4" placeholder="Your Message" class="rounded-xl border border-brand-ink/15 p-3 outline-none focus:border-brand-blue"><?= htmlspecialchars($old['message']) ?></textarea>
      <button type="submit" class="rounded-full bg-brand-ink py-3.5 font-display font-semibold text-brand-tint transition hover:bg-brand-blue-light">Send Message</button>
      <?php if ($error): ?>
        <p class="text-sm font-medium text-red-600"><?= htmlspecialchars($error) ?></p>
      <?php endif; ?>
    </form>
  <?php endif; ?>
</div>

<?php require __DIR__ . '/includes/footer.php'; ?>
