import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken } from "../../../lib/admin-session";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import MobileAdminNav from "../../../components/admin/MobileAdminNav";
import PreventClose from "../../../components/admin/PreventClose";
import SessionHeartbeat from "../../../components/admin/SessionHeartbeat";
import { NavigationGuardProvider } from "../../../components/admin/NavigationGuardContext";

export default async function AdminPanelLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  const sessionUser = verifySessionToken(token);
  if (!sessionUser) {
    redirect("/panel/login");
  }

  return (
    <NavigationGuardProvider>
      <div className="flex bg-slate-50 min-h-svh text-right pb-20 lg:pb-0" dir="rtl">
        <PreventClose />
        <SessionHeartbeat />
        {/* Desktop Sidebar */}
        <div className="hidden lg:block shrink-0 z-30">
          <AdminSidebar userRole={sessionUser.role} userName={sessionUser.fullName} />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden relative">
          {children}
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-100 pb-safe">
           <MobileAdminNav userRole={sessionUser.role} />
        </div>
      </div>
    </NavigationGuardProvider>
  );
}
