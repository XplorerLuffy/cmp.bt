<?php
require __DIR__ . '/config.php';
$pageTitle = 'Home';

$db = get_db();
$result = $db->query("SELECT * FROM products WHERE is_active = 1 ORDER BY created_at DESC LIMIT 8");
$featured = $result->fetch_all(MYSQLI_ASSOC);

require __DIR__ . '/includes/header.php';
?>

<section class="relative overflow-hidden bg-gradient-to-b from-brand-tint via-white to-white">
  <div class="glow-orb -left-24 -top-24 h-72 w-72 bg-brand-blue/40" aria-hidden="true"></div>
  <div class="glow-orb -right-24 top-1/3 h-80 w-80 bg-brand-blue-light/40" style="animation-delay: 3s" aria-hidden="true"></div>

  <div class="relative mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-20 text-center sm:py-28">
    <img src="/logo.png" alt="Crystal Moon Products logo"
         class="reveal h-20 w-20 rounded-full object-contain drop-shadow-lg sm:h-24 sm:w-24">
    <p class="reveal text-xs font-semibold uppercase tracking-[0.3em] text-brand-blue" style="animation-delay:.1s">Handmade in Bhutan</p>
    <h1 class="reveal max-w-2xl font-display text-4xl font-medium leading-tight text-brand-ink sm:text-6xl" style="animation-delay:.2s">
      Achaar, crafted under<br>a crystal moon.
    </h1>
    <p class="reveal max-w-xl text-brand-ink/65 sm:text-lg" style="animation-delay:.3s">
      Small-batch Bhutanese pickles made with traditional family recipes, fresh local chilies, and a whole lot of patience.
    </p>
    <div class="reveal mt-2 flex flex-col gap-3 sm:flex-row" style="animation-delay:.4s">
      <a href="/products" class="rounded-full bg-brand-blue px-7 py-3 font-display font-semibold text-white shadow-lg shadow-brand-blue/30 transition hover:-translate-y-0.5 hover:bg-brand-blue-dark hover:shadow-xl">Shop Our Pickles</a>
      <a href="/about" class="rounded-full border border-brand-ink/15 px-7 py-3 font-medium text-brand-ink transition hover:-translate-y-0.5 hover:border-brand-blue hover:text-brand-blue">Our Story</a>
    </div>
  </div>
</section>

<section class="mx-auto max-w-6xl px-4 py-14 sm:py-20">
  <div class="reveal mb-8 flex items-end justify-between">
    <div>
      <p class="text-xs font-semibold uppercase tracking-[0.25em] text-brand-blue">Featured</p>
      <h2 class="font-display text-2xl font-medium text-brand-ink sm:text-3xl">From the Pantry</h2>
    </div>
    <a href="/products" class="text-sm font-medium text-brand-ink/60 hover:text-brand-blue">View all &rarr;</a>
  </div>

  <?php if (empty($featured)): ?>
    <p class="text-brand-ink/60">Products coming soon. Check back shortly!</p>
  <?php else: ?>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <?php foreach ($featured as $cardIndex => $product): ?>
        <?php include __DIR__ . '/includes/product-card.php'; ?>
      <?php endforeach; ?>
    </div>
  <?php endif; ?>
</section>

<section class="border-t border-black/5 bg-white">
  <div class="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:grid-cols-3 sm:text-center">
    <?php
    $features = [
      ['🤲', 'Handmade in Bhutan', 'Every jar is made by hand using recipes passed down through generations.'],
      ['🌿', 'Fresh, Local Ingredients', 'We source chilies, vegetables, and spices from local Bhutanese farmers.'],
      ['🚚', 'Delivered Across Bhutan', 'Cash on delivery or bank transfer — order from anywhere in the country.'],
    ];
    foreach ($features as $i => [$emoji, $title, $text]): ?>
      <div class="reveal flex flex-col items-center gap-2" style="animation-delay: <?= $i * 0.1 ?>s">
        <div class="mb-1 flex h-12 w-12 items-center justify-center rounded-full bg-brand-blue/10 text-2xl"><?= $emoji ?></div>
        <h3 class="font-display font-semibold text-brand-ink"><?= $title ?></h3>
        <p class="text-sm text-brand-ink/70"><?= $text ?></p>
      </div>
    <?php endforeach; ?>
  </div>
</section>

<?php require __DIR__ . '/includes/footer.php'; ?>
