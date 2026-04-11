"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../Button";
import { IoIosLogOut } from "react-icons/io";
import AdminConfirmDialog from "./AdminConfirmDialog";

export default function AdminLogoutButton() {
  const router = useRouter();

  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/panel/logout", { method: "POST" });
    router.push("/panel/login");
    router.refresh();
  };

  return (
    <>
      <Button
        type="button"
        variant="icon"
        size="medium"
        className="px-3! hover:bg-red-100"
        onClick={() => setShowConfirm(true)}
      >
        <IoIosLogOut className="w-6 h-6 stroke-2 text-red-600" />
      </Button>
      
      <AdminConfirmDialog
        open={showConfirm}
        kind="reject"
        title="تسجيل الخروج"
        message="هل أنت متأكد أنك تريد تسجيل الخروج من لوحة التحكم؟"
        confirmLabel="نعم، تسجيل الخروج"
        cancelLabel="إلغاء"
        onConfirm={handleLogout}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
