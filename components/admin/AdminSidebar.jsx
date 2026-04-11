"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiList, FiChevronRight, FiChevronLeft, FiStar, FiUser } from "react-icons/fi";
import { MdDelete, MdPerson } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import { useRouter } from "next/navigation";
import AdminConfirmDialog from "./AdminConfirmDialog";

export default function AdminSidebar({ userRole, userName }) {
  // Read state from localStorage if available, defaulting to false, doing this in useEffect to avoid hydration mismatch
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("adminSidebarCollapsed");
    if (stored) setIsCollapsed(JSON.parse(stored));
  }, []);

  const toggleCollapse = () => {
    const newVal = !isCollapsed;
    setIsCollapsed(newVal);
    localStorage.setItem("adminSidebarCollapsed", JSON.stringify(newVal));
  };

  const handleLogout = async () => {
    await fetch("/api/panel/logout", { method: "POST" });
    router.push("/panel/login");
    router.refresh();
  };

  const navItems = [
    { name: "جميع الطلبات", href: "/panel", icon: FiList },
  ];

  if (userRole === "ADMIN") {
    navItems.push({ name: "الطلبات المحذوفة", href: "/panel/deleted", icon: MdDelete });
    navItems.push({ name: "إدارة الموظفين", href: "/panel/employees", icon: MdPerson });
    navItems.push({ name: "التقييمات", href: "/panel/reviews", icon: FiStar });
  }

  navItems.push({ name: "الملف الشخصي", href: "/panel/profile", icon: FiUser });

  // While not mounted, keep default width to avoid flicker
  const sidebarWidth = !mounted ? "w-72" : isCollapsed ? "w-20 lg:w-24" : "w-72";

  return (
    <aside
      className={`relative bg-white/95 backdrop-blur-2xl flex flex-col h-svh sticky top-0 border-l border-gray-100 shadow-[0_0_40px_rgba(0,0,0,0.03)] z-50 transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${sidebarWidth}`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleCollapse}
        className="absolute -left-4 top-10 w-9 h-9 bg-white border border-gray-200 shadow-md shadow-cyan-500/10 rounded-full flex items-center justify-center text-cyan-500 hover:text-cyan-700 hover:scale-110 hover:shadow-cyan-500/20 transition-all duration-300 z-10 outline-none"
      >
        {isCollapsed ? <FiChevronLeft size={20} className="-ml-0.5" /> : <FiChevronRight size={20} className="ml-0.5" />}
      </button>

      <div className={`flex flex-col items-center justify-center border-b border-gray-100/80 shrink-0 transition-all duration-500 ${isCollapsed ? "h-24 px-2" : "h-28 px-6"}`}>
        <div className="relative w-full h-12 flex items-center justify-center">
          <img 
            src="/logo.png" 
            alt="Logo Icon" 
            className={`absolute h-8 lg:h-9 w-auto object-contain transition-all duration-500 ${isCollapsed ? "opacity-100 scale-100" : "opacity-0 scale-50"}`} 
          />
          <img 
            src="/full-logo.png" 
            alt="Full Logo" 
            className={`absolute h-10 lg:h-12 w-auto object-contain transition-all duration-500 ${isCollapsed ? "opacity-0 scale-50" : "opacity-100 scale-100"}`} 
          />
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
        <div
          className={`grid transition-all duration-500 ease-in-out ${
            isCollapsed ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100 mb-2"
          }`}
        >
          <div className="overflow-hidden">
            <div className="text-[10px] sm:text-xs font-extrabold text-gray-400 px-3 uppercase tracking-wider whitespace-nowrap">
              القائمة الرئيسية
            </div>
          </div>
        </div>
        
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/panel');
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              title={isCollapsed ? item.name : undefined}
              className={`group flex items-center py-3 rounded-xl transition-all duration-300 font-bold ${
                isActive
                  ? "bg-cyan-50 text-cyan-700"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              } ${isCollapsed ? "px-0 justify-center mx-2" : "px-4 mx-3"}`}
            >
              <div className={`flex items-center justify-center shrink-0 transition-transform ${isCollapsed && !isActive ? "group-hover:scale-110" : ""}`}>
                <Icon size={22} className={isActive ? "text-cyan-700" : "text-gray-400"} />
              </div>
              
              <div 
                className={`flex items-center overflow-hidden transition-all duration-300 ${
                  isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100 mr-3"
                }`}
              >
                <span className="whitespace-nowrap">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className={`p-4 border-t border-gray-100 shrink-0 transition-all duration-500`}>
        <button
          onClick={() => setShowLogoutConfirm(true)}
          title={isCollapsed ? "تسجيل الخروج" : undefined}
          className={`group relative flex items-center py-4 text-red-500 font-bold rounded-2xl hover:bg-red-50 hover:text-red-600 transition-all duration-300 overflow-hidden ${
            isCollapsed ? "px-0 justify-center w-full" : "px-5 w-full"
          }`}
        >
          <div className="relative flex items-center justify-center z-10 shrink-0 transition-transform duration-300 group-hover:-translate-x-1">
            <IoIosLogOut size={26} className="stroke-2" />
          </div>
          
          <div 
            className={`flex items-center overflow-hidden transition-all duration-500 z-10 ${
              isCollapsed ? "w-0 opacity-0" : "w-32 opacity-100 mr-4"
            }`}
          >
            <span className="whitespace-nowrap">تسجيل الخروج</span>
          </div>
        </button>
      </div>

      <AdminConfirmDialog
        open={showLogoutConfirm}
        kind="reject"
        title="تسجيل الخروج"
        message="هل أنت متأكد أنك تريد تسجيل الخروج من لوحة التحكم؟"
        confirmLabel="نعم، تسجيل الخروج"
        cancelLabel="إلغاء"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </aside>
  );
}
