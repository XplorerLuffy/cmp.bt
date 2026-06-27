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
        <a href="https://www.facebook.com/crystalmoonproduct" target="_blank" rel="noopener noreferrer" class="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-brand-blue-light">
          <svg viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5" aria-hidden="true"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.99 3.657 9.128 8.438 9.878v-6.987H7.898V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.99 22 12z"/></svg>
          Follow us on Facebook
        </a>
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
