import { NextResponse } from "next/server";
import sharp from "sharp";
import { downloadProductImage } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get("token") !== "ckm9oyster30") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const fileName = url.searchParams.get("file");
  if (!fileName) {
    return NextResponse.json({ error: "missing file param" }, { status: 400 });
  }

  const { data, error } = await downloadProductImage(fileName);
  if (error || !data) {
    return NextResponse.json({ step: "download", error: String(error) }, { status: 200 });
  }

  const ab = await data.arrayBuffer();
  const bytes = new Uint8Array(ab);
  const hex = (n: number) =>
    Array.from(bytes.slice(0, n))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(" ");
  const tailHex = Array.from(bytes.slice(-4))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(" ");

  let meta: unknown = null;
  let sharpError: string | null = null;
  try {
    meta = await sharp(Buffer.from(ab)).metadata();
  } catch (e) {
    sharpError = String(e);
  }

  // Also fetch the raw public URL directly (bypassing supabase-js download)
  // to tell whether corruption is at upload (storage bad) or download (path bad).
  const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${fileName}`;
  let publicFirst16Hex: string | null = null;
  let publicByteLength: number | null = null;
  let publicLooksLikeJpeg: boolean | null = null;
  let publicError: string | null = null;
  try {
    const r = await fetch(publicUrl);
    const pab = new Uint8Array(await r.arrayBuffer());
    publicByteLength = pab.length;
    publicFirst16Hex = Array.from(pab.slice(0, 16))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(" ");
    publicLooksLikeJpeg = pab[0] === 0xff && pab[1] === 0xd8;
  } catch (e) {
    publicError = String(e);
  }

  return NextResponse.json({
    fileName,
    download: {
      blobType: data.type,
      blobSize: data.size,
      byteLength: bytes.length,
      first16Hex: hex(16),
      last4Hex: tailHex,
      looksLikeJpeg: bytes[0] === 0xff && bytes[1] === 0xd8,
      sharpMeta: meta,
      sharpError,
    },
    publicUrl: {
      byteLength: publicByteLength,
      first16Hex: publicFirst16Hex,
      looksLikeJpeg: publicLooksLikeJpeg,
      error: publicError,
    },
  });
}
