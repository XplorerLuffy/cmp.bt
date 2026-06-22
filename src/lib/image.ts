/** Routes a stored product image through our own /api/images proxy instead of hot-linking the Supabase domain directly. */
export function proxyImageUrl(imageUrl: string | null): string | null {
  if (!imageUrl) return null;
  const fileName = imageUrl.split("/").pop();
  if (!fileName) return null;
  return `/api/images/${fileName}`;
}
