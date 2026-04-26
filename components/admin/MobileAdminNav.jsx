"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiList, FiStar, FiUser, FiInbox } from "react-icons/fi";
import { MdDelete, MdPerson } from "react-icons/md";

export default function MobileAdminNav({ userRole }) {
  const pathname = usePathname();

  const navItems = [
    { name: "الطلبات", href: "/panel", icon: FiList },
    { name: "المضافة", href: "/panel/added", icon: FiInbox },
  ];

  if (userRole === "ADMIN") {
    navItems.push({ name: "التقييمات", href: "/panel/reviews", icon: FiStar });
    navItems.push({ name: "المحذوفات", href: "/panel/deleted", icon: MdDelete });
    navItems.push({ name: "الموظفين", href: "/panel/employees", icon: MdPerson });
  }

  navItems.push({ name: "حسابي", href: "/panel/profile", icon: FiUser });

  return (
    <nav className="flex justify-around items-center px-1 sm:px-2 py-2 sm:py-3 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] text-[10px] sm:text-xs font-bold text-gray-500 overflow-x-auto gap-1 sm:gap-2 snap-x scrollbar-none">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/panel');
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-1.5 w-16 sm:w-20 p-2 rounded-xl transition-all shrink-0 snap-center ${
              isActive ? "text-cyan-600 bg-cyan-50 shadow-sm" : "hover:bg-slate-50 hover:text-gray-700"
            }`}
          >
            <Icon size={22} className={isActive ? "text-cyan-600 scale-110 transition-transform" : "text-gray-400"} />
            <span className="truncate w-full text-center">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}

// simple helper to avoid hydration warning for default styling
function isMobileDevice() {
    if (typeof window === "undefined") return true; 
    return window.innerWidth < 640;
}
