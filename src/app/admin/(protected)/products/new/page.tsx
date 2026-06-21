import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-brand-ink">Add Product</h1>
      <p className="mb-6 text-sm text-brand-ink/60">Create a new product listing for the storefront.</p>
      <ProductForm />
    </div>
  );
}
