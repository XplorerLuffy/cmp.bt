"use client";

import { useState } from "react";
import Image from "next/image";
import { proxyImageUrl } from "@/lib/image";

export default function ProductThumb({
  imageUrl,
  name,
  size,
}: {
  imageUrl: string | null;
  name: string;
  size: number;
}) {
  const [failed, setFailed] = useState(false);

  if (!imageUrl || failed) {
    return (
      <span
        className="flex shrink-0 items-center justify-center rounded-lg bg-brand-ink/5 text-xs font-semibold text-brand-ink/40"
        style={{ width: size, height: size }}
      >
        {name.slice(0, 1).toUpperCase()}
      </span>
    );
  }

  return (
    <Image
      src={proxyImageUrl(imageUrl) ?? ""}
      alt={name}
      width={size}
      height={size}
      unoptimized
      onError={() => setFailed(true)}
      className="shrink-0 rounded-lg object-cover"
      style={{ width: size, height: size }}
    />
  );
}
