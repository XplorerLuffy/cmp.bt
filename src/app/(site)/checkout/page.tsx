"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { formatBTN } from "@/lib/format";
import { DZONGKHAGS } from "@/lib/orders";

const BANK_DETAILS = {
  bankName: "Bank of Bhutan Ltd.",
  accountName: "Crystal Moon Products",
  accountNumber: "1234567890123",
};

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    dzongkhag: "",
    address: "",
    email: "",
    paymentMethod: "COD" as "COD" | "BANK_TRANSFER",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (form.customerName.trim().length < 2) next.customerName = "Name is required";
    const phoneClean = form.phone.replace(/[\s-]/g, "");
    if (!/^(\+?975)?[17][67]\d{6}$/.test(phoneClean)) {
      next.phone = "Enter a valid Bhutan phone number (e.g. 17123456)";
    }
    if (!form.dzongkhag) next.dzongkhag = "Please select your Dzongkhag/town";
    if (form.address.trim().length < 5) next.address = "Delivery address is required";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Enter a valid email";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    if (items.length === 0) {
      setServerError("Your cart is empty.");
      return;
    }
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(typeof data.error === "string" ? data.error : "Could not place order. Please check your details.");
        return;
      }
      clear();
      router.push(`/checkout/confirmation/${data.orderNumber}`);
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 font-display text-2xl font-medium text-brand-night">Checkout</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full Name" error={errors.customerName}>
            <input
              className="input"
              value={form.customerName}
              onChange={(e) => update("customerName", e.target.value)}
            />
          </Field>
          <Field label="Phone Number" error={errors.phone}>
            <input
              className="input"
              placeholder="17123456"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
          </Field>
        </div>

        <Field label="Dzongkhag / Town" error={errors.dzongkhag}>
          <select
            className="input"
            value={form.dzongkhag}
            onChange={(e) => update("dzongkhag", e.target.value)}
          >
            <option value="">Select your Dzongkhag</option>
            {DZONGKHAGS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Delivery Address" error={errors.address}>
          <textarea
            className="input"
            rows={3}
            placeholder="Street, landmark, etc."
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
          />
        </Field>

        <Field label="Email (optional)" error={errors.email}>
          <input
            className="input"
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </Field>

        <div>
          <span className="mb-2 block text-sm font-medium text-brand-night/80">Payment Method</span>
          <div className="flex flex-col gap-3 sm:flex-row">
            <PaymentOption
              label="Cash on Delivery"
              description="Pay when your order arrives"
              selected={form.paymentMethod === "COD"}
              onClick={() => update("paymentMethod", "COD")}
            />
            <PaymentOption
              label="Bank Transfer"
              description="Transfer now, we verify manually"
              selected={form.paymentMethod === "BANK_TRANSFER"}
              onClick={() => update("paymentMethod", "BANK_TRANSFER")}
            />
          </div>
        </div>

        {form.paymentMethod === "BANK_TRANSFER" && (
          <div className="rounded-xl border border-brand-moon bg-brand-moon-soft/40 p-4 text-sm">
            <p className="mb-2 font-display font-semibold text-brand-night">Bank Account Details</p>
            <p>Bank: {BANK_DETAILS.bankName}</p>
            <p>Account Name: {BANK_DETAILS.accountName}</p>
            <p>Account Number: {BANK_DETAILS.accountNumber}</p>
            <p className="mt-2 text-brand-night/70">
              Please make the transfer and place your order. Your order will be marked
              &quot;Pending Payment Verification&quot; until we confirm receipt.
            </p>
          </div>
        )}

        <Field label="Order Notes (optional)">
          <textarea
            className="input"
            rows={2}
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
          />
        </Field>

        <div className="rounded-xl border border-brand-night/10 bg-white p-4">
          <div className="flex justify-between font-display font-semibold text-brand-night">
            <span>Subtotal ({items.length} item{items.length !== 1 ? "s" : ""})</span>
            <span className="text-brand-chili">{formatBTN(subtotal)}</span>
          </div>
        </div>

        {serverError && <p className="text-sm font-medium text-red-600">{serverError}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-brand-night py-3.5 font-display font-semibold text-brand-cream transition hover:bg-brand-night-light disabled:opacity-50"
        >
          {submitting ? "Placing Order..." : "Place Order"}
        </button>
      </form>

      <style>{`.input { width: 100%; border: 1px solid rgba(21,16,42,0.15); border-radius: 0.75rem; padding: 0.625rem 0.75rem; background: white; }`}</style>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-medium text-brand-night/80">{label}</span>
      {children}
      {error && <span className="text-xs font-medium text-red-600">{error}</span>}
    </label>
  );
}

function PaymentOption({
  label,
  description,
  selected,
  onClick,
}: {
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-xl border p-3 text-left transition ${
        selected ? "border-brand-night bg-brand-night/5" : "border-brand-night/15"
      }`}
    >
      <p className="font-display font-semibold text-brand-night">{label}</p>
      <p className="text-xs text-brand-night/60">{description}</p>
    </button>
  );
}
