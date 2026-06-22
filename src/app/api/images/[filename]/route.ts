import { NextResponse } from "next/server";
import { downloadProductImage } from "@/lib/storage";

export async function GET(_request: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;
  if (!/^[\w-]+\.jpg$/.test(filename)) {
    return NextResponse.json({ error: "Invalid file name" }, { status: 400 });
  }

  const { data, error } = await downloadProductImage(filename);
  if (error || !data) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  const buffer = new Uint8Array(await data.arrayBuffer());

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
