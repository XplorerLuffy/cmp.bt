"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-brand-night">Contact Us</h1>

      <div className="mb-8 grid gap-3 text-brand-night/80 sm:grid-cols-3">
        <p>📞 +975 17 123 456</p>
        <p>✉️ hello@cmp.bt</p>
        <p>📍 Thimphu, Bhutan</p>
      </div>

      {status === "success" ? (
        <p className="rounded-lg bg-green-50 p-4 font-medium text-green-700">
          Thanks for reaching out! We&apos;ll get back to you soon.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            required
            placeholder="Your Name"
            className="rounded-lg border border-brand-night/20 p-3"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <input
            required
            type="email"
            placeholder="Your Email"
            className="rounded-lg border border-brand-night/20 p-3"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
          <textarea
            required
            rows={4}
            placeholder="Your Message"
            className="rounded-lg border border-brand-night/20 p-3"
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          />
          <button
            type="submit"
            disabled={status === "submitting"}
            className="rounded-full bg-brand-night py-3 font-semibold text-brand-cream disabled:opacity-50"
          >
            {status === "submitting" ? "Sending..." : "Send Message"}
          </button>
          {status === "error" && (
            <p className="text-sm font-medium text-red-600">
              Something went wrong. Please try again or call us directly.
            </p>
          )}
        </form>
      )}
    </div>
  );
}
