import AdminLogoutButton from "../../../components/admin/AdminLogoutButton";
import AdminApplicationsClient from "../../../components/admin/AdminApplicationsClient";

export default function AdminDashboardPage() {
  return (
    <div className="min-h-svh bg-linear-to-br from-slate-50 via-cyan-50/30 to-white overflow-x-hidden">
      <header className="border-b border-cyan-100/80 bg-white/90 backdrop-blur-md sticky top-0 z-20 shadow-sm shadow-cyan-500/5">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="" className="h-9 w-auto object-contain" />
              لوحة الإدارة
          </div>
          <AdminLogoutButton />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12 text-right">
        <div className="space-y-8">
          <AdminApplicationsClient />
        </div>
      </main>
    </div>
  );
}
