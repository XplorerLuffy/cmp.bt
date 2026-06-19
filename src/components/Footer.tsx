import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto bg-brand-night text-brand-cream/80">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <h3 className="mb-2 text-lg font-semibold text-brand-cream">Crystal Moon Products</h3>
          <p className="text-sm">
            Handmade Bhutanese achaar, made in small batches with traditional recipes and
            quality ingredients.
          </p>
        </div>
        <div>
          <h4 className="mb-2 font-semibold text-brand-cream">Contact</h4>
          <ul className="space-y-1 text-sm">
            <li>📞 +975 17 123 456</li>
            <li>✉️ hello@cmp.bt</li>
            <li>📍 Thimphu, Bhutan</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-2 font-semibold text-brand-cream">Quick Links</h4>
          <ul className="space-y-1 text-sm">
            <li><Link href="/products" className="hover:text-brand-moon">Shop</Link></li>
            <li><Link href="/about" className="hover:text-brand-moon">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-brand-moon">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-brand-night-light px-4 py-4 text-center text-xs">
        © {new Date().getFullYear()} Crystal Moon Products. All rights reserved.
      </div>
    </footer>
  );
}
