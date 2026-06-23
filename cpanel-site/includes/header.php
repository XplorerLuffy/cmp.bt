<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= isset($pageTitle) ? htmlspecialchars($pageTitle) . ' — CMP.BT' : 'CMP.BT — Handmade Bhutanese Pickles & More' ?></title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            'brand-blue': '#3b82f6',
            'brand-blue-light': '#60a5fa',
            'brand-blue-dark': '#1d4ed8',
            'brand-ink': '#0a0a0a',
            'brand-tint': '#f4f7fd',
          }
        }
      }
    }
  </script>
</head>
<body class="bg-brand-tint text-brand-ink">
  <header class="border-b border-black/5 bg-white">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
      <a href="/" class="font-bold text-lg">CMP.BT</a>
      <nav class="flex gap-6 text-sm font-medium">
        <a href="/" class="hover:text-brand-blue">Home</a>
        <a href="/products.php" class="hover:text-brand-blue">Products</a>
      </nav>
    </div>
  </header>
  <main>
