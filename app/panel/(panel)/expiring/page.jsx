import Link from "next/link";
import { cookies } from "next/headers";
import { verifySessionToken } from "../../../../lib/admin-session";
import AdminLogoutButton from "../../../../components/admin/AdminLogoutButton";
import AdminApplicationsClient from "../../../../components/admin/AdminApplicationsClient";

export const metadata = {
  title: "طلبات ستنتهي قريباً | لوحة الإدارة",
};

export default async function ExpiringApplicationsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  const sessionUser = verifySessionToken(token);

  return (
    <div className="min-h-svh bg-linear-to-br from-slate-50 via-cyan-50/30 to-white overflow-x-hidden">
      <header className="border-b border-cyan-100/80 bg-white/90 backdrop-blur-md sticky top-0 z-20 shadow-sm shadow-cyan-500/5">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 font-bold text-gray-800 text-lg">
            <Link href="/"><img src="/logo.png" alt="Logo" className="h-9 w-auto object-contain lg:hidden" /></Link>
            <span className="lg:hidden">لوحة الإدارة</span>
            <span className="hidden lg:inline-block">لوحة الإدارة - طلبات ستنتهي قريباً</span>
          </div>
          <div className="lg:hidden">
            <AdminLogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12 text-right">
        <div className="space-y-8">
          <AdminApplicationsClient isExpiringMode userRole={sessionUser?.role} />
        </div>
      </main>
    </div>
  );
}
