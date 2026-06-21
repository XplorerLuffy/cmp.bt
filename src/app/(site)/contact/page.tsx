"use client";

import { useState } from "react";
import { motion } from "framer-motion";

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
      <div className="border-b border-brand-ink/10 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto max-w-3xl px-4 py-12 text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-blue">
            Get in Touch
          </p>
          <h1 className="font-display text-3xl font-medium text-brand-ink sm:text-4xl">
            Contact Us
          </h1>
        </motion.div>
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
              className="rounded-xl border border-brand-ink/15 p-3"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <input
              required
              type="email"
              placeholder="Your Email"
              className="rounded-xl border border-brand-ink/15 p-3"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
            <textarea
              required
              rows={4}
              placeholder="Your Message"
              className="rounded-xl border border-brand-ink/15 p-3"
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            />
            <button
              type="submit"
              disabled={status === "submitting"}
              className="rounded-full bg-brand-ink py-3.5 font-display font-semibold text-brand-tint transition hover:bg-brand-blue-light disabled:opacity-50"
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
    <div className="rounded-xl border border-brand-ink/10 bg-white p-4 text-center">
      <div className="mb-1 text-2xl">{icon}</div>
      <p className="text-xs uppercase tracking-wide text-brand-ink/50">{label}</p>
      <p className="font-medium text-brand-ink">{value}</p>
    </div>
  );
}
