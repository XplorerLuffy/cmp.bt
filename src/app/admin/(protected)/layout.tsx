import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/session";
import AdminSidebar from "@/components/AdminSidebar";
import TopBar from "@/components/admin/TopBar";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen flex-col sm:flex-row">
      <Suspense fallback={null}>
        <AdminSidebar />
      </Suspense>
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="min-w-0 flex-1 bg-brand-tint p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
