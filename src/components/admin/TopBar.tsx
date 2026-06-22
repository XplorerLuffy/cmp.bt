"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon, MailIcon, BellIcon } from "@/components/admin/icons";

export default function TopBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/admin/orders`);
  }

  return (
    <div className="hidden items-center gap-4 border-b border-brand-ink/10 bg-white px-6 py-3 sm:flex">
      <form onSubmit={handleSearch} className="relative w-full max-w-xs">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-ink/40" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search orders..."
          className="w-full rounded-full border border-brand-ink/10 bg-brand-tint/60 py-2 pl-9 pr-3 text-sm text-brand-ink placeholder:text-brand-ink/40 focus:border-brand-blue focus:outline-none"
        />
      </form>

      <div className="flex-1" />

      <span className="hidden text-sm font-medium text-brand-ink/60 md:inline">{today}</span>

      <button
        aria-label="Messages"
        type="button"
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-brand-ink/60 hover:bg-brand-tint"
      >
        <MailIcon className="h-5 w-5" />
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-rose px-1 text-[10px] font-semibold text-white">
          2
        </span>
      </button>

      <button
        aria-label="Notifications"
        type="button"
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-brand-ink/60 hover:bg-brand-tint"
      >
        <BellIcon className="h-5 w-5" />
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-rose px-1 text-[10px] font-semibold text-white">
          5
        </span>
      </button>
    </div>
  );
}
