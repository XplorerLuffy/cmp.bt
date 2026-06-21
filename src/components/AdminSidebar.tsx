"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { GridIcon, ReceiptIcon, BoxIcon, LogoutIcon } from "@/components/admin/icons";

const LINKS = [
  { href: "/admin", label: "Dashboard", Icon: GridIcon },
  { href: "/admin/orders", label: "Orders", Icon: ReceiptIcon },
  { href: "/admin/products", label: "Products", Icon: BoxIcon },
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
      <div className="flex items-center justify-between border-b border-white/10 bg-brand-ink px-4 py-3 text-brand-tint sm:hidden">
        <span className="flex items-center gap-2 font-semibold">
          <Image src="/logo.png" alt="Crystal Moon Products" width={28} height={28} className="rounded-full" />
          Crystal Moon Admin
        </span>
        <button
          aria-label="Toggle menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-xl hover:bg-white/10"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 border-b border-white/10 bg-brand-ink px-2 pb-3 text-brand-tint sm:hidden">
          {LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active ? "bg-brand-blue text-white shadow-sm" : "text-brand-tint/80 hover:bg-white/10"
                }`}
              >
                <link.Icon className="h-5 w-5 shrink-0" />
                {link.label}
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-brand-tint/70 hover:bg-white/10"
          >
            <LogoutIcon className="h-5 w-5 shrink-0" />
            Log Out
          </button>
        </nav>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden w-60 min-h-screen flex-col border-r border-white/10 bg-brand-ink text-brand-tint sm:flex">
        <div className="flex items-center gap-3 px-5 py-6">
          <Image src="/logo.png" alt="Crystal Moon Products" width={36} height={36} className="rounded-full" />
          <div className="flex flex-col leading-tight">
            <span className="font-semibold">Crystal Moon</span>
            <span className="text-xs text-brand-tint/50">Admin Panel</span>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-brand-blue text-white shadow-sm shadow-brand-blue/30"
                    : "text-brand-tint/70 hover:bg-white/10 hover:text-brand-tint"
                }`}
              >
                <link.Icon className="h-5 w-5 shrink-0" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 pb-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-brand-tint/70 hover:bg-white/10 hover:text-brand-tint"
          >
            <LogoutIcon className="h-5 w-5 shrink-0" />
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
}
