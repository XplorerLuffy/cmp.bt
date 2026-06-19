export function generateOrderNumber(): string {
  const now = new Date();
  const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
    now.getDate()
  ).padStart(2, "0")}`;
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `CMP-${datePart}-${randomPart}`;
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT_VERIFICATION: "Pending Payment Verification",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export const ORDER_STATUS_FLOW = [
  "PENDING_PAYMENT_VERIFICATION",
  "CONFIRMED",
  "PROCESSING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

export const DZONGKHAGS = [
  "Thimphu",
  "Paro",
  "Punakha",
  "Wangdue Phodrang",
  "Chukha (Phuentsholing)",
  "Samtse",
  "Haa",
  "Bumthang",
  "Trongsa",
  "Mongar",
  "Trashigang",
  "Trashiyangtse",
  "Pemagatshel",
  "Samdrup Jongkhar",
  "Sarpang",
  "Tsirang",
  "Dagana",
  "Zhemgang",
  "Lhuentse",
  "Gasa",
];
