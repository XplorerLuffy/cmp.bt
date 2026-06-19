"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="w-full border-b border-brand-night-light bg-brand-night text-brand-cream sm:w-56 sm:min-h-screen sm:border-b-0 sm:border-r">
      <div className="px-4 py-4 font-semibold">🌙 Crystal Moon Admin</div>
      <nav className="flex gap-1 px-2 pb-2 sm:flex-col">
        {LINKS.map((link) => {
          const active = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded px-3 py-2 text-sm font-medium ${
                active ? "bg-brand-moon text-brand-night" : "hover:bg-brand-night-light"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="mt-2 rounded px-3 py-2 text-left text-sm font-medium text-brand-cream/80 hover:bg-brand-night-light"
        >
          Log Out
        </button>
      </nav>
    </aside>
  );
}
