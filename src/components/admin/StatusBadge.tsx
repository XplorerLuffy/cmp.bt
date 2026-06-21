import { ORDER_STATUS_LABELS } from "@/lib/orders";

const STATUS_STYLES: Record<string, string> = {
  PENDING_PAYMENT_VERIFICATION: "bg-accent-amber-tint text-accent-amber",
  CONFIRMED: "bg-brand-blue/10 text-brand-blue-dark",
  PROCESSING: "bg-brand-blue/10 text-brand-blue-dark",
  OUT_FOR_DELIVERY: "bg-accent-amber-tint text-accent-amber",
  DELIVERED: "bg-accent-green-tint text-accent-green",
  CANCELLED: "bg-accent-rose-tint text-accent-rose",
};

export default function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? "bg-brand-ink/5 text-brand-ink/70";
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${style}`}
    >
      {ORDER_STATUS_LABELS[status] ?? status}
    </span>
  );
}
