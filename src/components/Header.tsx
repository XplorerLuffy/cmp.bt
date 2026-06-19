"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-brand-night text-brand-cream shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-wide">
          <span className="text-2xl">🌙</span>
          <span>Crystal Moon Products</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-brand-cream/90 hover:text-brand-moon"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="relative flex items-center gap-1 rounded-full border border-brand-moon/40 px-3 py-1.5 text-sm font-medium hover:bg-brand-night-light"
          >
            🛒 Cart
            {itemCount > 0 && (
              <span className="ml-1 rounded-full bg-brand-moon px-2 py-0.5 text-xs font-bold text-brand-night">
                {itemCount}
              </span>
            )}
          </Link>
          <button
            aria-label="Toggle menu"
            className="text-2xl md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-brand-night-light px-4 py-3 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded px-2 py-2 text-sm font-medium hover:bg-brand-night-light"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
