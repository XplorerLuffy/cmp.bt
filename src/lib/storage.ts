import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import { randomUUID } from "crypto";

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "product-images";

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Supabase storage is not configured (missing env vars)");
  }
  return createClient(url, key);
}

/** Resizes/compresses an uploaded product image and stores it in Supabase Storage. Returns the public URL. */
export async function uploadProductImage(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const optimized = await sharp(buffer)
    .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toBuffer();

  const fileName = `${randomUUID()}.jpg`;
  const supabase = getSupabaseAdmin();

  // Wrap the bytes in a Blob. Passing a raw Node Buffer here makes storage-js
  // coerce the body through a UTF-8 string conversion, replacing every
  // non-ASCII byte with U+FFFD and corrupting the stored JPEG.
  const blob = new Blob([new Uint8Array(optimized)], { type: "image/jpeg" });
  const { error } = await supabase.storage.from(BUCKET).upload(fileName, blob, {
    contentType: "image/jpeg",
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
  return data.publicUrl;
}

export async function deleteProductImage(imageUrl: string): Promise<void> {
  const fileName = imageUrl.split("/").pop();
  if (!fileName) return;
  const supabase = getSupabaseAdmin();
  await supabase.storage.from(BUCKET).remove([fileName]);
}

export async function downloadProductImage(fileName: string) {
  const supabase = getSupabaseAdmin();
  return supabase.storage.from(BUCKET).download(fileName);
}
