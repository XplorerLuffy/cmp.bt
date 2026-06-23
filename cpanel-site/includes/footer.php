  </main>
  <footer class="mt-auto bg-brand-ink text-white/75">
    <div class="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-3">
      <div>
        <div class="mb-3 flex items-center gap-2.5 text-white">
          <img src="/logo.png" alt="Crystal Moon Products logo" class="h-8 w-8 rounded-full object-contain">
          <span class="font-display text-base font-semibold">Crystal Moon Products</span>
        </div>
        <p class="text-sm leading-relaxed">
          Handmade Bhutanese achaar, made in small batches with traditional recipes and quality ingredients.
        </p>
      </div>
      <div>
        <h4 class="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-brand-blue-light">Contact</h4>
        <ul class="space-y-1.5 text-sm">
          <li>+975 17 123 456</li>
          <li>hello@cmp.bt</li>
          <li>Thimphu, Bhutan</li>
        </ul>
      </div>
      <div>
        <h4 class="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-brand-blue-light">Quick Links</h4>
        <ul class="space-y-1.5 text-sm">
          <li><a href="/products.php" class="hover:text-brand-blue-light">Shop</a></li>
          <li><a href="/about.php" class="hover:text-brand-blue-light">About Us</a></li>
          <li><a href="/contact.php" class="hover:text-brand-blue-light">Contact</a></li>
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
