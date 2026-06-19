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
    <div>
      <div className="border-b border-brand-night/10 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-chili">
            Get in Touch
          </p>
          <h1 className="font-display text-3xl font-medium text-brand-night sm:text-4xl">
            Contact Us
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          <ContactCard icon="📞" label="Phone" value="+975 17 123 456" />
          <ContactCard icon="✉️" label="Email" value="hello@cmp.bt" />
          <ContactCard icon="📍" label="Location" value="Thimphu, Bhutan" />
        </div>

        {status === "success" ? (
          <p className="rounded-xl bg-green-50 p-4 font-medium text-green-700">
            Thanks for reaching out! We&apos;ll get back to you soon.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              required
              placeholder="Your Name"
              className="rounded-xl border border-brand-night/15 p-3"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <input
              required
              type="email"
              placeholder="Your Email"
              className="rounded-xl border border-brand-night/15 p-3"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
            <textarea
              required
              rows={4}
              placeholder="Your Message"
              className="rounded-xl border border-brand-night/15 p-3"
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            />
            <button
              type="submit"
              disabled={status === "submitting"}
              className="rounded-full bg-brand-night py-3.5 font-display font-semibold text-brand-cream transition hover:bg-brand-night-light disabled:opacity-50"
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
    </div>
  );
}

function ContactCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-brand-night/10 bg-white p-4 text-center">
      <div className="mb-1 text-2xl">{icon}</div>
      <p className="text-xs uppercase tracking-wide text-brand-night/50">{label}</p>
      <p className="font-medium text-brand-night">{value}</p>
    </div>
  );
}
