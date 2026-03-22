"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "../../../../components/Button";

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "فشل تسجيل الدخول.");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("تعذر الاتصال بالخادم.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center space-y-3">
        <div className="mx-auto w-48 md:w-56">
          <img src="/full-logo.png" alt="إنترنت تيليكوم" className="w-full h-auto object-contain" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">تسجيل دخول الإدارة</h1>
          <p className="text-gray-500 text-sm mt-2">أدخل بياناتك للوصول إلى لوحة التحكم</p>
        </div>
      </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-right">
          {error && (
            <div
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 text-center"
              role="alert"
            >
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="admin-email" className="block text-sm font-semibold text-gray-700">
              البريد الإلكتروني
            </label>
            <input
              id="admin-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white/90 px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-[#18a2e3] focus:ring-2 focus:ring-[#18a2e3]/25"
              placeholder="admin@example.com"
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="admin-password" className="block text-sm font-semibold text-gray-700">
              كلمة المرور
            </label>
            <input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white/90 px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-[#18a2e3] focus:ring-2 focus:ring-[#18a2e3]/25"
              placeholder="••••••••"
              dir="ltr"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="large"
            disabled={loading}
            className="w-full !rounded-xl opacity-100 disabled:opacity-70"
          >
            {loading ? "جاري الدخول…" : "دخول"}
          </Button>
        </form>

      <p className="text-center text-sm text-gray-500">
        <Link href="/" className="text-[#18a2e3] font-medium hover:underline">
          ← العودة للموقع
        </Link>
      </p>
    </div>
  );
}
