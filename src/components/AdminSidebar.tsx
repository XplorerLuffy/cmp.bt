"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-brand-blue-light bg-brand-ink px-4 py-3 text-brand-tint sm:hidden">
        <span className="font-semibold">🌙 Crystal Moon Admin</span>
        <button
          aria-label="Toggle menu"
          className="flex h-9 w-9 items-center justify-center rounded text-xl"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 border-b border-brand-blue-light bg-brand-ink px-2 pb-3 text-brand-tint sm:hidden">
          {LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded px-3 py-2.5 text-sm font-medium ${
                  active ? "bg-brand-blue text-white" : "hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="mt-1 rounded px-3 py-2.5 text-left text-sm font-medium text-brand-tint/80 hover:bg-brand-blue-light"
          >
            Log Out
          </button>
        </nav>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden w-56 min-h-screen border-r border-brand-blue-light bg-brand-ink text-brand-tint sm:flex sm:flex-col">
        <div className="px-4 py-4 font-semibold">🌙 Crystal Moon Admin</div>
        <nav className="flex flex-1 flex-col gap-1 px-2 pb-2">
          {LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded px-3 py-2 text-sm font-medium ${
                  active ? "bg-brand-blue text-white" : "hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="mt-2 rounded px-3 py-2 text-left text-sm font-medium text-brand-tint/80 hover:bg-brand-blue-light"
          >
            Log Out
          </button>
        </nav>
      </aside>
    </>
  );
}
