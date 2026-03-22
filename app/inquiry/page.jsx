"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "../../components/Button";

const normalizeCode = (value) =>
  String(value || "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 6);

export default function InquiryPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    const normalized = normalizeCode(code);
    if (normalized.length !== 6) {
      setError("يرجى إدخال رقم الطلب المكوّن من 6 أحرف أو أرقام.");
      return;
    }
    router.push(`/apply/status/${normalized}`);
  };

  return (
    <div className="min-h-svh flex flex-col items-center justify-center px-6 py-10 bg-linear-to-br from-blue-50 via-white to-cyan-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 right-10 w-32 h-32 bg-blue-200 rounded-full blur-xl" />
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-cyan-200 rounded-full blur-xl" />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">استعلام عن الطلب</h1>
          <p className="text-gray-600 text-sm md:text-base">
            أدخل رقم الطلب (6 خانات) الظاهر لك بعد التقديم لمتابعة حالة الطلب
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-right">
          <div className="space-y-2">
            <label htmlFor="app-code" className="block text-gray-700 font-medium">
              رقم الطلب
            </label>
            <input
              id="app-code"
              type="text"
              inputMode="text"
              autoComplete="off"
              autoCapitalize="characters"
              maxLength={6}
              value={code}
              onChange={(e) => {
                setCode(normalizeCode(e.target.value));
                setError(null);
              }}
              placeholder="مثال: A1B2C3"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-center text-xl font-mono tracking-widest focus:ring-2 focus:ring-[#18a2e3] focus:border-transparent outline-none"
              dir="ltr"
            />
            {error && (
              <p className="text-red-600 text-sm text-center" role="alert">
                {error}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button type="submit" variant="primary" size="large" className="flex-1 sm:flex-none min-w-[140px]">
              استعلام
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="large"
              className="flex-1 sm:flex-none min-w-[140px]"
              onClick={() => router.push("/")}
            >
              الرئيسية
            </Button>
          </div>
        </form>

        <p className="text-xs text-gray-500">
          <Link href="/apply" className="text-[#18a2e3] font-medium hover:underline">
            ليس لديك رقم طلب؟ تقديم طلب جديد
          </Link>
        </p>
      </div>
    </div>
  );
}
