"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { GridIcon, ReceiptIcon, BoxIcon, LogoutIcon } from "@/components/admin/icons";
import { ORDER_STATUS_LABELS } from "@/lib/orders";

const ORDER_CHILDREN = Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => ({
  href: `/admin/orders?status=${value}`,
  status: value,
  label,
}));

const LINKS: {
  href: string;
  label: string;
  Icon: typeof GridIcon;
  children?: { href: string; status: string; label: string }[];
}[] = [
  { href: "/admin", label: "Dashboard", Icon: GridIcon },
  { href: "/admin/orders", label: "Orders", Icon: ReceiptIcon, children: ORDER_CHILDREN },
  { href: "/admin/products", label: "Products", Icon: BoxIcon },
];

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeStatus = searchParams.get("status");
  const [expanded, setExpanded] = useState<string | null>(
    pathname.startsWith("/admin/orders") ? "/admin/orders" : null
  );

  return (
    <nav className="flex flex-1 flex-col gap-1 px-3">
      {LINKS.map((link) => {
        const sectionActive = pathname === link.href || pathname.startsWith(link.href + "/");
        const isExpanded = expanded === link.href;
        const hasChildren = !!link.children?.length;

        return (
          <div key={link.href}>
            <div className="flex items-center">
              <Link
                href={link.href}
                onClick={() => {
                  if (hasChildren) setExpanded(isExpanded ? null : link.href);
                  onNavigate?.();
                }}
                className={`flex flex-1 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  sectionActive && !hasChildren
                    ? "bg-accent-amber text-brand-ink shadow-sm"
                    : sectionActive
                      ? "bg-accent-amber/15 text-accent-amber"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <link.Icon className="h-5 w-5 shrink-0" />
                <span className="flex-1">{link.label}</span>
                {hasChildren && (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className={`h-4 w-4 shrink-0 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                  >
                    <path
                      d="M9 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </Link>
            </div>
            {hasChildren && isExpanded && (
              <div className="mt-1 mb-1 flex flex-col gap-0.5 border-l border-white/10 pl-4">
                {link.children!.map((child) => {
                  const childActive = sectionActive && activeStatus === child.status;
                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => onNavigate?.()}
                      className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                        childActive ? "text-accent-amber" : "text-white/55 hover:text-white"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                          childActive ? "bg-accent-amber" : "bg-white/30"
                        }`}
                      />
                      <span className="truncate">{child.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export default function AdminSidebar() {
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
      <div className="flex items-center justify-between border-b border-white/10 bg-admin-sidebar px-4 py-3 text-white sm:hidden">
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
        <div className="border-b border-white/10 bg-admin-sidebar pb-3 sm:hidden">
          <NavList onNavigate={() => setOpen(false)} />
          <div className="px-3">
            <button
              onClick={handleLogout}
              className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-white/70 hover:bg-white/10"
            >
              <LogoutIcon className="h-5 w-5 shrink-0" />
              Log Out
            </button>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden min-h-screen w-64 flex-col bg-admin-sidebar text-white sm:flex">
        <div className="px-4 pt-5">
          <div className="flex items-center gap-3 rounded-xl bg-admin-sidebar-light px-3 py-3">
            <Image src="/logo.png" alt="Crystal Moon Products" width={36} height={36} className="rounded-full" />
            <div className="flex flex-col leading-tight">
              <span className="font-semibold">Crystal Moon</span>
              <span className="text-xs text-white/50">Admin Panel</span>
            </div>
          </div>
        </div>
        <div className="mx-4 mt-4 mb-2 border-t border-white/10" />
        <NavList />
        <div className="px-3 pb-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white"
          >
            <LogoutIcon className="h-5 w-5 shrink-0" />
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
}
