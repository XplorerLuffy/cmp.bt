<?php
/** Admin chrome. Set $adminTitle before requiring. Pair with admin-layout-end.php. */
$nav = [
  ['/admin', 'Dashboard', '▦'],
  ['/admin/products', 'Products', '📦'],
  ['/admin/orders', 'Orders', '🧾'],
  ['/admin/about', 'About Page', '📝'],
  ['/admin/contact', 'Contact Info', '☎'],
];
$here = $_SERVER['REQUEST_URI'];
function admin_active($href, $here) {
    $path = parse_url($here, PHP_URL_PATH);
    if ($href === '/admin') return $path === '/admin' || $path === '/admin/' || $path === '/admin/index.php';
    return strpos($path, $href) === 0;
}
?>
<!DOCTYPE html>
<html lang="en" class="h-full">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= isset($adminTitle) ? htmlspecialchars($adminTitle) . ' — Admin' : 'Admin' ?> | Crystal Moon</title>
  <link rel="icon" href="/logo.png" type="image/png">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = { theme: { extend: { colors: {
      'brand-blue': '#3b82f6', 'brand-blue-light': '#60a5fa', 'brand-blue-dark': '#1d4ed8',
      'brand-ink': '#0a0a0a', 'brand-tint': '#f4f7fd',
      'admin-sidebar': '#0a0f1c', 'admin-sidebar-light': '#131b2e',
      'accent-green': '#16a34a', 'accent-green-tint': '#dcfce7',
      'accent-amber': '#d97706', 'accent-amber-tint': '#fef3c7',
      'accent-rose': '#e11d48', 'accent-rose-tint': '#ffe4e6',
    } } } };
  </script>
</head>
<body class="flex min-h-full bg-brand-tint text-brand-ink">
  <!-- Sidebar -->
  <aside class="hidden w-60 shrink-0 flex-col bg-admin-sidebar p-4 text-white/80 md:flex">
    <div class="mb-8 flex items-center gap-2.5 px-2">
      <img src="/logo.png" alt="logo" class="h-9 w-9 rounded-full object-contain">
      <span class="font-semibold text-white">Crystal Moon</span>
    </div>
    <nav class="flex flex-1 flex-col gap-1">
      <?php foreach ($nav as [$href, $label, $icon]): ?>
        <a href="<?= $href ?>" class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition <?= admin_active($href, $here) ? 'bg-admin-sidebar-light text-white' : 'hover:bg-admin-sidebar-light/60' ?>">
          <span><?= $icon ?></span><?= $label ?>
        </a>
      <?php endforeach; ?>
    </nav>
    <div class="mt-auto flex flex-col gap-1 border-t border-white/10 pt-3">
      <a href="/" target="_blank" class="rounded-lg px-3 py-2 text-sm hover:bg-admin-sidebar-light/60">↗ View Site</a>
      <a href="/admin/logout" class="rounded-lg px-3 py-2 text-sm text-accent-rose hover:bg-admin-sidebar-light/60">Log Out</a>
    </div>
  </aside>

  <div class="flex min-w-0 flex-1 flex-col">
    <!-- Mobile top bar -->
    <header class="flex items-center justify-between bg-admin-sidebar px-4 py-3 text-white md:hidden">
      <span class="font-semibold">Crystal Moon Admin</span>
      <a href="/admin/logout" class="text-sm text-accent-rose">Log Out</a>
    </header>
    <nav class="flex gap-1 overflow-x-auto bg-admin-sidebar-light px-2 py-2 md:hidden">
      <?php foreach ($nav as [$href, $label, $icon]): ?>
        <a href="<?= $href ?>" class="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium <?= admin_active($href, $here) ? 'bg-white text-brand-ink' : 'text-white/80' ?>"><?= $label ?></a>
      <?php endforeach; ?>
    </nav>

    <main class="flex-1 p-4 sm:p-6 lg:p-8">
