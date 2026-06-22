"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { proxyImageUrl } from "@/lib/image";

export type ProductFormInitial = {
  id?: string;
  name: string;
  description: string;
  ingredients: string;
  price: number | "";
  category: string;
  stock: number | "";
  imageUrl: string | null;
};

export default function ProductForm({ initial }: { initial?: ProductFormInitial }) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);

  const [form, setForm] = useState({
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    ingredients: initial?.ingredients ?? "",
    price: initial?.price ?? "",
    category: initial?.category ?? "",
    stock: initial?.stock ?? "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.set(key, String(value)));
    if (imageFile) formData.set("image", imageFile);

    try {
      const res = await fetch(
        isEdit ? `/api/products/${initial!.id}` : "/api/products",
        { method: isEdit ? "PATCH" : "POST", body: formData }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(typeof data.error === "string" ? data.error : "Could not save product");
        return;
      }
      router.push("/admin/products");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-xl flex-col gap-4 rounded-xl border border-brand-ink/10 bg-white p-5 shadow-sm sm:p-6"
    >
      <Field label="Name">
        <input
          required
          className="field"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
      </Field>

      <Field label="Description">
        <textarea
          required
          rows={3}
          className="field"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        />
      </Field>

      <Field label="Ingredients (optional)">
        <textarea
          rows={2}
          className="field"
          value={form.ingredients}
          onChange={(e) => setForm((f) => ({ ...f, ingredients: e.target.value }))}
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Price (Nu.)">
          <input
            required
            type="number"
            min={1}
            className="field"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value === "" ? "" : Number(e.target.value) }))}
          />
        </Field>
        <Field label="Stock Quantity">
          <input
            required
            type="number"
            min={0}
            className="field"
            value={form.stock}
            onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value === "" ? "" : Number(e.target.value) }))}
          />
        </Field>
      </div>

      <Field label="Category / Flavor Type">
        <input
          required
          className="field"
          placeholder="e.g. Chili Achaar, Mango Pickle"
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
        />
      </Field>

      <Field label={isEdit ? "Replace Image (optional)" : "Product Image"}>
        {initial?.imageUrl && (
          <Image
            src={proxyImageUrl(initial.imageUrl) ?? ""}
            alt={form.name}
            width={96}
            height={96}
            className="mb-2 h-24 w-24 rounded object-cover"
          />
        )}
        <div className="field flex items-center">
          <input
            type="file"
            accept="image/*"
            className="w-full text-sm text-brand-ink/70 file:mr-3 file:rounded-full file:border-0 file:bg-brand-blue file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-blue-dark"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          />
        </div>
      </Field>

      {error && <p className="text-sm font-medium text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-brand-ink px-6 py-3 font-semibold text-brand-tint disabled:opacity-50 sm:w-auto"
      >
        {submitting ? "Saving..." : isEdit ? "Save Changes" : "Add Product"}
      </button>

      <style>{`.field { width: 100%; border: 1px solid rgba(27,19,48,0.15); border-radius: 0.5rem; padding: 0.625rem 0.75rem; transition: border-color 0.15s ease; } .field:focus { outline: none; border-color: var(--brand-blue); }`}</style>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-medium text-brand-ink/80">{label}</span>
      {children}
    </label>
  );
}
