  </main>
  <footer class="mt-auto bg-brand-ink text-white/75">
    <div class="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-3">
      <div>
        <div class="mb-3 flex items-center gap-2.5 text-white">
          <img src="/logo.png" alt="Crystal Moon Products logo" class="h-8 w-8 rounded-full object-contain" loading="lazy">
          <span class="font-display text-base font-semibold">Crystal Moon Products</span>
        </div>
        <p class="text-sm leading-relaxed">
          Handmade Bhutanese achaar, made in small batches with traditional recipes and quality ingredients.
        </p>
        <div class="mt-4 flex flex-col gap-2">
          <a href="https://www.facebook.com/crystalmoonproduct" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-brand-blue-light">
            <svg viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5" aria-hidden="true"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.99 3.657 9.128 8.438 9.878v-6.987H7.898V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.99 22 12z"/></svg>
            Follow us on Facebook
          </a>
          <a href="https://www.tiktok.com/@cmp_agri_business" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-brand-blue-light">
            <svg viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5" aria-hidden="true"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
            Follow us on TikTok
          </a>
        </div>
      </div>
      <div>
        <h4 class="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-brand-blue-light">Contact</h4>
        <ul class="space-y-1.5 text-sm">
          <li><?= htmlspecialchars(function_exists('get_setting') ? get_setting('contact_phone', '+975 17 123 456') : '+975 17 123 456') ?></li>
          <li><?= htmlspecialchars(function_exists('get_setting') ? get_setting('contact_email', 'hello@cmp.bt') : 'hello@cmp.bt') ?></li>
          <li><?= htmlspecialchars(function_exists('get_setting') ? get_setting('contact_location', 'Thimphu, Bhutan') : 'Thimphu, Bhutan') ?></li>
        </ul>
      </div>
      <div>
        <h4 class="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-brand-blue-light">Quick Links</h4>
        <ul class="space-y-1.5 text-sm">
          <li><a href="/products" class="hover:text-brand-blue-light">Shop</a></li>
          <li><a href="/about" class="hover:text-brand-blue-light">About Us</a></li>
          <li><a href="/contact" class="hover:text-brand-blue-light">Contact</a></li>
        </ul>
      </div>
    </div>
    <div class="border-t border-white/10 px-4 py-4 text-center text-xs text-white/50">
      &copy; <?= date('Y') ?> Crystal Moon Products. All rights reserved.
    </div>
  </footer>

  <script>
    // Mobile menu toggle
    (function () {
      var btn = document.getElementById('menuBtn');
      var menu = document.getElementById('mobileMenu');
      if (btn && menu) {
        btn.addEventListener('click', function () {
          var hidden = menu.classList.toggle('hidden');
          menu.classList.toggle('flex', !hidden);
          btn.textContent = hidden ? '☰' : '✕';
        });
      }
      // Scroll reveal animations
      var els = document.querySelectorAll('.reveal');
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
          });
        }, { rootMargin: '-40px' });
        els.forEach(function (el) { io.observe(el); });
      } else {
        els.forEach(function (el) { el.classList.add('in'); });
      }
    })();
  </script>
</body>
</html>
