"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import MoonMark from "@/components/MoonMark";

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
    <header className="sticky top-0 z-40 border-b border-brand-moon/20 bg-brand-night/95 text-brand-cream backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
        <Link href="/" className="flex items-center gap-2">
          <MoonMark className="h-6 w-6 text-brand-moon" />
          <span className="font-display text-lg font-semibold tracking-wide">
            Crystal Moon
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium tracking-wide text-brand-cream/80 transition hover:text-brand-moon"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="relative flex items-center gap-1.5 rounded-full border border-brand-moon/30 px-3.5 py-1.5 text-sm font-medium transition hover:border-brand-moon hover:bg-brand-night-light"
          >
            <span aria-hidden>🛍️</span>
            <span className="hidden sm:inline">Cart</span>
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-moon px-1 text-xs font-bold text-brand-night">
                {itemCount}
              </span>
            )}
          </Link>
          <button
            aria-label="Toggle menu"
            className="text-xl md:hidden"
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
              className="rounded px-2 py-2.5 text-sm font-medium hover:bg-brand-night-light"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
