"use client";

import { useRouter } from "next/navigation";
import Button from "../Button";
import { IoIosLogOut } from "react-icons/io";
export default function AdminLogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <Button type="button" variant="secondary" size="medium" className="flex items-center gap-2" onClick={handleLogout}>
      <IoIosLogOut className="w-5 h-5 stroke-2 text-red-500" />
      تسجيل الخروج
    </Button>
  );
}
