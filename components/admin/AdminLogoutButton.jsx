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
    <Button
      type="button"
      variant="icon"
      size="medium"
      className="px-3! hover:bg-red-100"
      onClick={handleLogout}
    >
      <IoIosLogOut className="w-6 h-6 stroke-2 text-red-600" />
    </Button>
  );
}
