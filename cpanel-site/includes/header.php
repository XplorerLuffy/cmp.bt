<?php
$navLinks = [
  ['/', 'Home'],
  ['/products', 'Shop'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
];
$current = basename($_SERVER['PHP_SELF']);
// Normalise current script name to a clean path for active-link matching.
$currentPath = $current === 'index.php' ? '/' : '/' . preg_replace('/\.php$/', '', $current);
?>
<!DOCTYPE html>
<html lang="en" class="h-full">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= isset($pageTitle) ? htmlspecialchars($pageTitle) . ' | Crystal Moon Products' : 'Crystal Moon Products | Handmade Bhutanese Achaar' ?></title>
  <meta name="description" content="Crystal Moon Products makes handmade Bhutanese pickles (achaar) using traditional recipes and quality ingredients, delivered across Bhutan.">
  <link rel="icon" href="/logo.png" type="image/png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            display: ['Fraunces', 'serif'],
            body: ['Inter', 'sans-serif'],
          },
          colors: {
            'brand-blue': '#3b82f6',
            'brand-blue-light': '#60a5fa',
            'brand-blue-dark': '#1d4ed8',
            'brand-ink': '#0a0a0a',
            'brand-white': '#ffffff',
            'brand-tint': '#f4f7fd',
            background: '#f4f7fd',
          },
        },
      },
    };
  </script>
  <style>
    html { scroll-behavior: smooth; }
    body { font-family: 'Inter', sans-serif; background: #f4f7fd; color: #0a0a0a; }
    .font-display { font-family: 'Fraunces', serif; }
    .glass {
      background: rgba(255, 255, 255, 0.65);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.4);
    }
    .glow-orb {
      position: absolute; border-radius: 9999px; filter: blur(60px);
      opacity: 0.5; pointer-events: none; animation: orb-float 14s ease-in-out infinite;
    }
    @keyframes orb-float {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(20px, -30px) scale(1.08); }
      66% { transform: translate(-25px, 20px) scale(0.95); }
    }
    @keyframes fade-up {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .reveal { opacity: 0; }
    .reveal.in { animation: fade-up 0.6s ease-out forwards; }
    .line-clamp-2 {
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    }
  </style>
</head>
<body class="flex min-h-full flex-col bg-background font-body text-brand-ink antialiased">
  <header class="glass sticky top-0 z-40">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
      <a href="/" class="flex items-center gap-2.5">
        <img src="/logo.png" alt="Crystal Moon Products logo" class="h-9 w-9 rounded-full object-contain sm:h-10 sm:w-10">
        <span class="font-display text-lg font-semibold tracking-wide text-brand-ink">Crystal Moon</span>
      </a>

      <nav class="hidden items-center gap-8 md:flex">
        <?php foreach ($navLinks as [$href, $label]): ?>
          <a href="<?= $href ?>" class="group relative text-sm font-medium tracking-wide <?= $currentPath === $href ? 'text-brand-blue' : 'text-brand-ink/75' ?> transition hover:text-brand-blue">
            <?= $label ?>
            <span class="absolute -bottom-1 left-0 h-px w-0 bg-brand-blue transition-all duration-300 group-hover:w-full"></span>
          </a>
        <?php endforeach; ?>
      </nav>

      <button id="menuBtn" aria-label="Toggle menu" class="text-xl text-brand-ink md:hidden">☰</button>
    </div>

    <nav id="mobileMenu" class="hidden flex-col gap-1 border-t border-black/5 px-4 pb-2 md:hidden">
      <?php foreach ($navLinks as [$href, $label]): ?>
        <a href="<?= $href ?>" class="rounded px-2 py-2.5 text-sm font-medium text-brand-ink hover:bg-brand-blue/5"><?= $label ?></a>
      <?php endforeach; ?>
    </nav>
  </header>
  <main class="flex-1">
