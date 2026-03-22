import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken } from "../../../../lib/admin-session";
import LoginForm from "./LoginForm";

export default async function AdminLoginPage() {
  const cookieStore = await cookies();
  if (verifySessionToken(cookieStore.get("admin_session")?.value)) {
    redirect("/admin");
  }

  return (
    <div className="min-h-svh flex">
      {/* Image panel — desktop */}
      <div className="hidden lg:block lg:w-1/2 relative min-h-svh">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/admin.jpg)" }}
        />
        <div className="absolute inset-0 bg-linear-to-br from-slate-900/75 via-[#0d4f7c]/55 to-[#18a2e3]/35" />
        <div className="absolute bottom-10 left-10 right-10 text-white text-right space-y-2">
          <p className="text-lg font-semibold opacity-95">إنترنت تيليكوم</p>
          <p className="text-sm opacity-80 max-w-md">لوحة إدارة آمنة لإدارة الطلبات والخدمات</p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-linear-to-br from-slate-50 via-white to-cyan-50/80 relative">
        <div className="absolute inset-0 lg:hidden opacity-30 pointer-events-none">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url(/admin.jpg)" }}
          />
          <div className="absolute inset-0 bg-linear-to-b from-white/90 via-white/85 to-cyan-50/95" />
        </div>
        <div className="relative z-10 w-full flex justify-center">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
