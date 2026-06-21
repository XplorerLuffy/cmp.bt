import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="mt-auto bg-brand-ink text-white/75">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-3">
        <div>
          <div className="mb-3 flex items-center gap-2.5 text-white">
            <Image
              src="/logo.png"
              alt="Crystal Moon Products logo"
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-contain"
            />
            <span className="font-display text-base font-semibold">Crystal Moon Products</span>
          </div>
          <p className="text-sm leading-relaxed">
            Handmade Bhutanese achaar, made in small batches with traditional recipes and
            quality ingredients.
          </p>
        </div>
        <div>
          <h4 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-brand-blue-light">
            Contact
          </h4>
          <ul className="space-y-1.5 text-sm">
            <li>+975 17 123 456</li>
            <li>hello@cmp.bt</li>
            <li>Thimphu, Bhutan</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-brand-blue-light">
            Quick Links
          </h4>
          <ul className="space-y-1.5 text-sm">
            <li><Link href="/products" className="hover:text-brand-blue-light">Shop</Link></li>
            <li><Link href="/about" className="hover:text-brand-blue-light">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-brand-blue-light">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Crystal Moon Products. All rights reserved.
      </div>
    </footer>
  );
}
