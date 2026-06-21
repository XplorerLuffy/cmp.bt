import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/session";
import AdminSidebar from "@/components/AdminSidebar";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen flex-col sm:flex-row">
      <AdminSidebar />
      <main className="min-w-0 flex-1 bg-brand-tint p-4 sm:p-8">{children}</main>
    </div>
  );
}
