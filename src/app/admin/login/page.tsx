"use client";

import { useState } from "react";
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
    <div className="flex min-h-screen items-center justify-center bg-brand-ink px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl bg-white p-8 shadow-lg"
      >
        <h1 className="mb-1 text-xl font-bold text-brand-ink">Crystal Moon Admin</h1>
        <p className="mb-6 text-sm text-brand-ink/60">Sign in to manage your store</p>

        <label className="mb-3 block">
          <span className="mb-1 block text-sm font-medium text-brand-ink/80">Email</span>
          <input
            required
            type="email"
            className="w-full rounded-lg border border-brand-ink/20 p-2.5"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="mb-4 block">
          <span className="mb-1 block text-sm font-medium text-brand-ink/80">Password</span>
          <input
            required
            type="password"
            className="w-full rounded-lg border border-brand-ink/20 p-2.5"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {error && <p className="mb-3 text-sm font-medium text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-brand-ink py-2.5 font-semibold text-brand-tint disabled:opacity-50"
        >
          {submitting ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
