import { z } from "zod";

// Bhutanese mobile numbers: 8 digits, starting with 17 or 77 (mobile) or 16 (some operators),
// optionally prefixed with +975 or 975.
const BHUTAN_PHONE_REGEX = /^(\+?975)?[17][67]\d{6}$/;

export function isValidBhutanPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s-]/g, "");
  return BHUTAN_PHONE_REGEX.test(cleaned);
}

export const checkoutSchema = z.object({
  customerName: z.string().trim().min(2, "Name is required"),
  phone: z
    .string()
    .trim()
    .refine(isValidBhutanPhone, "Enter a valid Bhutan phone number (e.g. 17123456)"),
  dzongkhag: z.string().trim().min(1, "Please select your Dzongkhag/town"),
  address: z.string().trim().min(5, "Delivery address is required"),
  email: z.string().trim().email().optional().or(z.literal("")),
  paymentMethod: z.enum(["COD", "BANK_TRANSFER"]),
  notes: z.string().trim().optional().or(z.literal("")),
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().min(1),
      })
    )
    .min(1, "Cart is empty"),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z.string().trim().email("Enter a valid email"),
  message: z.string().trim().min(10, "Message is too short"),
});

export const productSchema = z.object({
  name: z.string().trim().min(2),
  description: z.string().trim().min(5),
  ingredients: z.string().trim().optional().or(z.literal("")),
  price: z.coerce.number().int().positive(),
  category: z.string().trim().min(1),
  stock: z.coerce.number().int().min(0),
});
