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
      variant="secondary"
      size="medium"
      className="bg-red-500/20 px-3! group hover:bg-red-500"
      onClick={handleLogout}
    >
      <IoIosLogOut className="w-6 h-6 stroke-2 text-red-500 group-hover:text-white duration-300" />
    </Button>
  );
}
