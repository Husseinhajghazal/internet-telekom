"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdPhone, MdOutlineTag } from "react-icons/md";
import Button from "../../components/Button";

const normalizeCode = (value) =>
  String(value || "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 6);

const normalizePhone = (value = "") => {
  let formatted = value.replace(/\D/g, "");
  if (formatted.startsWith("90")) {
    formatted = formatted.substring(2);
  }
  if (formatted.startsWith("0")) {
    formatted = formatted.substring(1);
  }
  if (formatted.length > 10) {
    formatted = formatted.substring(0, 10);
  }
  let display = "0 ";
  if (formatted.length > 0) {
    display += `(${formatted.substring(0, 3)}`;
  }
  if (formatted.length > 3) {
    display += `) ${formatted.substring(3, 6)}`;
  }
  if (formatted.length > 6) {
    display += ` ${formatted.substring(6, 8)}`;
  }
  if (formatted.length > 8) {
    display += ` ${formatted.substring(8, 10)}`;
  }
  return display;
};

export default function InquiryPage() {
  const router = useRouter();
  const [searchMode, setSearchMode] = useState("phone"); // "code" or "phone"
  const [code, setCode] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (searchMode === "code") {
        const normalized = normalizeCode(code);
        if (normalized.length !== 6) {
          setError("يرجى إدخال رقم الطلب المكوّن من 6 أحرف أو أرقام.");
          setLoading(false);
          return;
        }
        router.push(`/apply/status/${normalized}`);
      } else {
        // Phone search
        const normalized = phone.replace(/\D/g, "");
        if (normalized.length < 7) {
          setError("يرجى إدخال رقم هاتف صحيح.");
          setLoading(false);
          return;
        }

        // Fetch the newest application for this phone
        const res = await fetch(
          `/api/applications/by-phone/${encodeURIComponent(normalized)}`,
        );
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          setError(data.error || "تعذر العثور على الطلب.");
          setLoading(false);
          return;
        }

        // Redirect to the status page with the app code
        router.push(`/apply/status/${data.appCode}`);
      }
    } catch (err) {
      setError("حدث خطأ، يرجى المحاولة مرة أخرى.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-svh flex flex-col items-center justify-center px-6 py-10 bg-linear-to-br from-blue-50 via-white to-cyan-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 right-10 w-32 h-32 bg-blue-200 rounded-full blur-xl" />
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-cyan-200 rounded-full blur-xl" />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            استعلام عن الطلب
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            ابحث عن حالة طلبك باستخدام رقم الطلب أو رقم الهاتف
          </p>
        </div>

        {/* Search Mode Toggle */}
        <div className="inline-flex rounded-2xl border border-gray-200 bg-gray-50 p-1">
          <button
            type="button"
            onClick={() => {
              setSearchMode("code");
              setError(null);
            }}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl transition ${
              searchMode === "code"
                ? "bg-white text-blue-600 shadow-md"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <MdOutlineTag size={18} />
            رقم الطلب
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchMode("phone");
              setError(null);
            }}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl transition ${
              searchMode === "phone"
                ? "bg-white text-blue-600 shadow-md"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <MdPhone size={18} />
            رقم الهاتف
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-right">
          {/* App Code Input */}
          {searchMode === "code" && (
            <div className="space-y-2 animate-in fade-in">
              <label
                htmlFor="app-code"
                className="block text-gray-700 font-medium"
              >
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
          )}

          {/* Phone Input */}
          {searchMode === "phone" && (
            <div className="space-y-2 animate-in fade-in">
              <label
                htmlFor="phone"
                className="block text-gray-700 font-medium"
              >
                رقم الهاتف
              </label>
              <input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(normalizePhone(e.target.value));
                  setError(null);
                }}
                placeholder="0 (5XX) XXX XX XX"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-center text-lg focus:ring-2 focus:ring-[#18a2e3] focus:border-transparent outline-none"
                dir="ltr"
              />
              {error && (
                <p className="text-red-600 text-sm text-center" role="alert">
                  {error}
                </p>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              type="submit"
              variant="primary"
              size="large"
              className="flex-1 sm:flex-none min-w-35"
              disabled={loading}
            >
              {loading ? "جاري البحث..." : "استعلم"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="large"
              className="flex-1 sm:flex-none min-w-35"
              onClick={() => router.push("/")}
            >
              الرئيسية
            </Button>
          </div>
        </form>

        <p className="text-xs text-gray-500">
          <Link
            href="/apply"
            className="text-[#18a2e3] font-medium hover:underline"
          >
            ليس لديك طلب؟ تقديم طلب جديد
          </Link>
        </p>
      </div>
    </div>
  );
}
