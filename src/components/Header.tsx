"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
    <header className="glass sticky top-0 z-40 border-b border-black/5">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="Crystal Moon Products logo"
            width={40}
            height={40}
            className="h-9 w-9 rounded-full object-contain sm:h-10 sm:w-10"
            priority
          />
          <span className="font-display text-lg font-semibold tracking-wide text-brand-ink">
            Crystal Moon
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative text-sm font-medium tracking-wide text-brand-ink/75 transition hover:text-brand-blue"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-brand-blue transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="relative flex items-center gap-1.5 rounded-full border border-brand-blue/30 px-3.5 py-1.5 text-sm font-medium text-brand-ink transition hover:border-brand-blue hover:bg-brand-blue/5"
          >
            <span aria-hidden>🛍️</span>
            <span className="hidden sm:inline">Cart</span>
            <AnimatePresence>
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-blue px-1 text-xs font-bold text-white"
                >
                  {itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          <button
            aria-label="Toggle menu"
            className="text-xl text-brand-ink md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="flex flex-col gap-1 overflow-hidden border-t border-black/5 px-4 md:hidden"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded px-2 py-2.5 text-sm font-medium text-brand-ink hover:bg-brand-blue/5"
              >
                {link.label}
              </Link>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
