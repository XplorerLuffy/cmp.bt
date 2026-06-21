"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      router.push("/admin");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-ink px-4">
      <div className="glow-orb -left-20 -top-20 h-72 w-72 bg-brand-blue/40" />
      <div className="glow-orb -bottom-24 -right-16 h-72 w-72 bg-brand-blue-light/30" />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <Image
            src="/logo.png"
            alt="Crystal Moon Products"
            width={56}
            height={56}
            className="mb-3 rounded-full"
          />
          <h1 className="text-xl font-bold text-brand-ink">Crystal Moon Admin</h1>
          <p className="mt-1 text-sm text-brand-ink/60">Sign in to manage your store</p>
        </div>

        <label className="mb-3 block">
          <span className="mb-1 block text-sm font-medium text-brand-ink/80">Email</span>
          <input
            required
            type="email"
            className="w-full rounded-lg border border-brand-ink/15 p-2.5 transition-colors focus:border-brand-blue focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="mb-4 block">
          <span className="mb-1 block text-sm font-medium text-brand-ink/80">Password</span>
          <input
            required
            type="password"
            className="w-full rounded-lg border border-brand-ink/15 p-2.5 transition-colors focus:border-brand-blue focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {error && <p className="mb-3 text-sm font-medium text-accent-rose">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-brand-blue py-2.5 font-semibold text-white transition-colors hover:bg-brand-blue-dark disabled:opacity-50"
        >
          {submitting ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
