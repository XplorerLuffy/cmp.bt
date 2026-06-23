# Crystal Moon Products — cPanel (PHP + MySQL) site

A responsive PHP/MySQL rebuild of the Crystal Moon Products storefront,
matching the Vercel (Next.js) app — Fraunces/Inter fonts, glass sticky
header, animated hero, product grid, cart, checkout, and a full admin panel.

## Storefront pages
- `/` — homepage (hero, featured products, feature strip)
- `/products` — shop / full product listing
- `/product/{slug}` — product detail (with Add to Cart / Buy Now)
- `/cart` — shopping cart (session-based)
- `/checkout` — delivery details + payment, saves a real order
- `/confirmation?order=...` — order confirmation
- `/about`, `/contact` — story + contact form

## Admin panel (`/admin`)
- `/admin/setup` — create the first admin account (works only once)
- `/admin/login` — log in
- `/admin` — dashboard (orders, revenue, low stock, top sellers)
- `/admin/products` — list / add / edit / delete products (with image upload)
- `/admin/orders` — view & update order statuses
- `/admin/order?id=...` — order detail
- `/admin/about` — edit the About page text + upload its image
- `/admin/contact` — edit phone / email / location (shown on Contact + footer)

## Deploy

1. **Run `migrate2.sql`** in phpMyAdmin (SQL tab, database `cmpbt_cmpbt`).
   It adds the `stock` column and creates the `orders`, `order_items`, and
   `admins` tables. (First-time setup also needs `migrate.sql` from before.)
   Then run **`migrate3.sql`** to add the `settings` table that powers the
   editable About & Contact pages.
2. **Upload everything** to `public_html` (turn on "Show Hidden Files" so
   `.htaccess` and `uploads/.htaccess` upload). **Keep your existing
   `config.php`** with your DB credentials, or re-enter them after extracting:
   ```php
   define('DB_NAME', 'cmpbt_cmpbt');
   define('DB_USER', 'cmpbt_main');
   define('DB_PASS', 'your-password');
   ```
3. **Make `uploads/` writable** — in File Manager, set the `uploads` folder
   permissions to `755` (or `775`) so product image uploads can be saved.
4. **Create your admin login** — visit `https://www.cmp.bt/admin/setup` once
   and set your email + password. After that the setup page locks itself and
   you log in at `/admin/login`.

## Notes
- Cart is stored server-side in the PHP session.
- Tailwind + Google Fonts load via CDN (no build step).
- Forms post to clean URLs (e.g. `/cart-action`) so the `.htaccess` 301
  rule doesn't drop POST data — don't rename these.
- `uploads/.htaccess` allows images but blocks any script execution there.
