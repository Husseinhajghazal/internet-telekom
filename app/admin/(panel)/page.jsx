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
          {/* <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-start gap-3">
              <span
                className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-md"
                style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})` }}
              >
                <MdAdminPanelSettings size={24} />
              </span>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                  مرحباً بك
                </h1>
                <p className="text-gray-600 leading-relaxed mt-2 text-sm md:text-base max-w-xl">
                  إدارة طلبات العملاء — عرض، تفاصيل، رفض أو إكمال الطلب.
                </p>
              </div>
            </div>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl cursor-pointer font-bold transition hover:opacity-95 text-sm shrink-0 text-white shadow-md"
              style={{ background: `linear-gradient(to left, ${ACCENT}, ${ACCENT_DARK})` }}
            >
              <MdHome size={20} />
              الموقع الرئيسي
            </Link>
          </div> */}

          <AdminApplicationsClient />
        </div>
      </main>
    </div>
  );
}
