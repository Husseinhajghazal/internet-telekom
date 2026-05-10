"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import GuardedLink from "./GuardedLink";
import { FiStar, FiUser, FiInbox, FiClock, FiWifi } from "react-icons/fi";
import { MdDelete, MdMiscellaneousServices, MdPerson } from "react-icons/md";

export default function MobileAdminNav({ userRole }) {
  const pathname = usePathname();
  const [expiringCount, setExpiringCount] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const CACHE_KEY = "adminExpiringCount";
    const TTL = 6 * 60 * 60 * 1000;
    const fetchCount = async () => {
      try {
        const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
        if (cached && Date.now() - cached.ts < TTL) {
          if (!cancelled) setExpiringCount(cached.count);
          return;
        }
        const res = await fetch("/api/panel/applications?view=expiring&page=1");
        if (!res.ok) return;
        const json = await res.json();
        const count = json.total ?? 0;
        localStorage.setItem(CACHE_KEY, JSON.stringify({ count, ts: Date.now() }));
        if (!cancelled) setExpiringCount(count);
      } catch {}
    };
    fetchCount();
    return () => {
      cancelled = true;
    };
  }, []);

  const navItems = [
    { name: "إنترنت", href: "/panel", icon: FiWifi },
    { name: "خدمات", href: "/panel/services", icon: MdMiscellaneousServices },
    { name: "المضافة", href: "/panel/added", icon: FiInbox },
    { name: "تجديد", href: "/panel/expiring", icon: FiClock },
  ];

  if (userRole === "ADMIN") {
    navItems.push({ name: "التقييمات", href: "/panel/reviews", icon: FiStar });
    navItems.push({
      name: "المحذوفات",
      href: "/panel/deleted",
      icon: MdDelete,
    });
    navItems.push({
      name: "الموظفين",
      href: "/panel/employees",
      icon: MdPerson,
    });
  }

  navItems.push({ name: "حسابي", href: "/panel/profile", icon: FiUser });

  return (
    <nav className="flex justify-around items-center px-1 sm:px-2 py-2 sm:py-3 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] text-[10px] sm:text-xs font-bold text-gray-500 overflow-x-auto gap-1 sm:gap-2 snap-x scrollbar-none">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (pathname.startsWith(item.href) && item.href !== "/panel");
        const Icon = item.icon;
        const showBadge =
          item.href === "/panel/expiring" &&
          expiringCount !== null &&
          expiringCount > 0;
        return (
          <GuardedLink
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-1.5 w-16 sm:w-20 p-2 rounded-xl transition-all shrink-0 snap-center ${
              isActive
                ? "text-cyan-600 bg-cyan-50 shadow-sm"
                : "hover:bg-slate-50 hover:text-gray-700"
            }`}
          >
            <div className="relative">
              <Icon
                size={22}
                className={
                  isActive
                    ? "text-cyan-600 scale-110 transition-transform"
                    : "text-gray-400"
                }
              />
              {showBadge && (
                <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 rounded-full bg-amber-500 text-white text-[9px] font-extrabold flex items-center justify-center ring-2 ring-white shadow-sm">
                  {expiringCount > 99 ? "99+" : expiringCount}
                </span>
              )}
            </div>
            <span className="truncate w-full text-center">{item.name}</span>
          </GuardedLink>
        );
      })}
    </nav>
  );
}
