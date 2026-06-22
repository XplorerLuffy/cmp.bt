import { ORDER_STATUS_LABELS } from "@/lib/orders";

export const STATUS_STYLES: Record<string, string> = {
  PENDING_PAYMENT_VERIFICATION: "bg-accent-amber-tint text-accent-amber",
  CONFIRMED: "bg-brand-blue/10 text-brand-blue-dark",
  PROCESSING: "bg-brand-blue/10 text-brand-blue-dark",
  OUT_FOR_DELIVERY: "bg-accent-amber-tint text-accent-amber",
  DELIVERED: "bg-accent-green-tint text-accent-green",
  CANCELLED: "bg-accent-rose-tint text-accent-rose",
};

// Border + text variant used for the inline select on the orders list page,
// kept in sync with STATUS_STYLES above so colors match the badge.
export const STATUS_SELECT_STYLES: Record<string, string> = {
  PENDING_PAYMENT_VERIFICATION: "border-accent-amber/40 bg-accent-amber-tint text-accent-amber",
  CONFIRMED: "border-brand-blue/30 bg-brand-blue/10 text-brand-blue-dark",
  PROCESSING: "border-brand-blue/30 bg-brand-blue/10 text-brand-blue-dark",
  OUT_FOR_DELIVERY: "border-accent-amber/40 bg-accent-amber-tint text-accent-amber",
  DELIVERED: "border-accent-green/40 bg-accent-green-tint text-accent-green",
  CANCELLED: "border-accent-rose/40 bg-accent-rose-tint text-accent-rose",
};

export function getStatusStyle(status: string): string {
  return STATUS_STYLES[status] ?? "bg-brand-ink/5 text-brand-ink/70";
}

export function getStatusSelectStyle(status: string): string {
  return STATUS_SELECT_STYLES[status] ?? "border-brand-ink/15 bg-brand-ink/5 text-brand-ink/70";
}

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusStyle(status)}`}
    >
      {ORDER_STATUS_LABELS[status] ?? status}
    </span>
  );
}
