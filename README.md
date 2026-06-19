# Crystal Moon Products (cmp.bt)

E-commerce site for Crystal Moon Products, a handmade Bhutanese achaar (pickle) business.
Built with Next.js (App Router), Prisma + Postgres (Supabase), and Tailwind CSS.

## Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Database:** Postgres via Supabase, accessed with Prisma
- **Image storage:** Supabase Storage (product images, auto-resized/compressed with `sharp`)
- **Auth:** Single admin account, password hashed with bcrypt, session via signed JWT cookie (`jose`)
- **Hosting target:** Vercel

## Project structure

- `src/app/(site)/...` — public storefront (home, products, cart, checkout, about, contact)
- `src/app/admin/...` — password-protected admin panel (dashboard, orders, products)
- `src/app/api/...` — API routes for orders, products, contact form, admin auth
- `src/lib/` — Prisma client, session/auth helpers, validation, cart context, image storage
- `prisma/schema.prisma` — database schema (Product, Order, OrderItem, Admin, ContactMessage)
- `prisma/seed.ts` — creates the first admin account + sample products

## 1. Set up Supabase

1. Create a Supabase project at https://supabase.com (free tier is fine to start).
2. In **Project Settings → Database → Connection string**, copy the **Transaction pooler**
   URI (works well with serverless/Vercel) and use it as `DATABASE_URL`.
3. In **Project Settings → API**, copy the **Project URL** and **service_role key**.
4. In **Storage**, create a bucket named `product-images` and make it **public** (so product
   images can be displayed on the storefront without extra signed-URL logic).

## 2. Configure environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

- `DATABASE_URL` — Supabase Postgres connection string
- `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_STORAGE_BUCKET` — for image uploads
- `SESSION_SECRET` — generate with `openssl rand -base64 32`
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — your admin login, used by the seed script

## 3. Install dependencies, run migrations, and seed

```bash
npm install
npx prisma migrate dev --name init
npm run db:seed
```

The seed script creates your admin account (from `ADMIN_EMAIL`/`ADMIN_PASSWORD`) and a few
sample products so the storefront isn't empty on first run.

## 4. Run locally

```bash
npm run dev
```

- Storefront: http://localhost:3000
- Admin panel: http://localhost:3000/admin/login

## 5. Replace placeholder content

- **Logo:** swap the 🌙 emoji in `src/components/Header.tsx` and `src/app/(site)/page.tsx`
  for an `<Image>` of your real logo once you provide the file.
- **Bank details:** edit `BANK_DETAILS` in `src/app/(site)/checkout/page.tsx`.
- **Contact info:** edit `src/components/Footer.tsx` and `src/app/(site)/contact/page.tsx`.
- **Products:** once logged into `/admin`, delete the seeded sample products and add your
  real ones (with photos) through **Admin → Products → Add Product**.

## 6. Deploying to cmp.bt (Vercel)

1. Push this repo to GitHub (already done if you're reading this from the repo).
2. In Vercel, import the project and add all the environment variables from `.env` (use the
   **direct/non-pooled** connection string is not required — the pooler URL works for
   Vercel's serverless functions).
3. Deploy.
4. In Vercel → Project → Settings → Domains, add `cmp.bt` and follow the DNS instructions
   (typically an A record or CNAME at your domain registrar) to point it at Vercel.
5. After deploying, run the seed script once against your production database (e.g. locally
   with `DATABASE_URL` pointed at production, or via `npx prisma migrate deploy` + a one-off
   seed run) to create your real admin account. **Change `ADMIN_PASSWORD` to something strong
   before doing this**, then log in at `https://cmp.bt/admin/login` and change it again if you
   add a "change password" flow later (not included in v1 — to rotate the password now, update
   the `Admin` row's `passwordHash` directly or re-run the seed with a new password and email).

## Notes on the order/payment flow

- **Cash on Delivery** orders are created with status `CONFIRMED` immediately.
- **Bank Transfer** orders are created with status `PENDING_PAYMENT_VERIFICATION`. Go to
  **Admin → Orders**, open the order, and check "Bank transfer payment verified/received" once
  you confirm the funds, then move the status forward (e.g. to `CONFIRMED`/`PROCESSING`).
- Deleting a product that has order history will **deactivate** it instead of removing it, so
  past orders keep their line-item details intact.
