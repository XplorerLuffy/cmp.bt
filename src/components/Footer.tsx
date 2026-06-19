import Link from "next/link";
import MoonMark from "@/components/MoonMark";

export default function Footer() {
  return (
    <footer className="mt-auto bg-brand-night text-brand-cream/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-3">
        <div>
          <div className="mb-3 flex items-center gap-2 text-brand-cream">
            <MoonMark className="h-5 w-5 text-brand-moon" />
            <span className="font-display text-base font-semibold">Crystal Moon Products</span>
          </div>
          <p className="text-sm leading-relaxed">
            Handmade Bhutanese achaar, made in small batches with traditional recipes and
            quality ingredients.
          </p>
        </div>
        <div>
          <h4 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-brand-moon">
            Contact
          </h4>
          <ul className="space-y-1.5 text-sm">
            <li>+975 17 123 456</li>
            <li>hello@cmp.bt</li>
            <li>Thimphu, Bhutan</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-brand-moon">
            Quick Links
          </h4>
          <ul className="space-y-1.5 text-sm">
            <li><Link href="/products" className="hover:text-brand-moon">Shop</Link></li>
            <li><Link href="/about" className="hover:text-brand-moon">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-brand-moon">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-brand-night-light px-4 py-4 text-center text-xs text-brand-cream/50">
        © {new Date().getFullYear()} Crystal Moon Products. All rights reserved.
      </div>
    </footer>
  );
}
