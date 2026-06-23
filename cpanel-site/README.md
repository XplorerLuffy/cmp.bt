# Crystal Moon Products — cPanel (PHP + MySQL) site

A responsive PHP/MySQL rebuild of the Crystal Moon Products storefront,
matching the Vercel (Next.js) app's design — Fraunces/Inter fonts, glass
sticky header, animated hero, product grid, and product detail pages.

## Pages
- `index.php` — homepage (hero, featured products, feature strip)
- `products.php` — shop / full product listing
- `product.php?slug=...` — product detail (category, ingredients)
- `about.php` — our story
- `contact.php` — contact info + working contact form (saves to `contact_messages`)

## Deploy

1. **Database** — already created (`cmpbt_cmpbt`).
2. **Upgrade the table** — in phpMyAdmin, select your database, open the SQL
   tab and run **`migrate.sql`** once. This adds the `category` /
   `ingredients` columns, fills them in, and creates the `contact_messages`
   table. (For a brand-new database instead, run `schema.sql` then `seed.sql`.)
3. **Upload** — upload everything in this folder to `public_html`, **except
   keep your existing `config.php`** (it already has your DB credentials).
   If you do overwrite it, re-enter:
   ```php
   define('DB_NAME', 'cmpbt_cmpbt');
   define('DB_USER', 'cmpbt_main');
   define('DB_PASS', 'your-password');
   ```
4. Make sure `logo.png` lands in the `public_html` root.
5. Visit the site.

## Notes
- Tailwind + Google Fonts load via CDN (no build step).
- Cart / checkout / admin panel are not included yet — product pages link to
  the contact page to place an order.
