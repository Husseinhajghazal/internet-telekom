"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdPhone, MdOutlineTag, MdHome, MdSearch, MdInfoOutline } from "react-icons/md";
import { GrNotes } from "react-icons/gr";
import Button from "../../components/Button";
import { formatPhoneNumber, normalizeIndex } from "@/utils/general";

export default function InquiryPage() {
  const router = useRouter();
  const [searchMode, setSearchMode] = useState("phone"); // "code" or "phone"
  const [code, setCode] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adminNotePopup, setAdminNotePopup] = useState(null);

  const handleFetchResult = (data) => {
    if (data.adminNote) {
      setAdminNotePopup({
        note: data.adminNote,
        appIndex: data.appIndex,
      });
    } else {
      router.push(`/internet-basvuru-formu/status/${data.appIndex}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (searchMode === "code") {
        const normalized = normalizeIndex(code);
        const idx = Number(normalized);
        if (!Number.isInteger(idx) || idx < 1) {
          setError("يرجى إدخال رقم الطلب (عدد صحيح أكبر من 0).");
          setLoading(false);
          return;
        }
        const res = await fetch(
          `/api/applications/by-index/${encodeURIComponent(normalized)}`,
        );
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          setError(data.error || "تعذر العثور على الطلب.");
          setLoading(false);
          return;
        }

        handleFetchResult(data);
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

        handleFetchResult(data);
      }
    } catch (err) {
      setError("حدث خطأ، يرجى المحاولة مرة أخرى.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-row min-h-svh bg-linear-to-br from-blue-50 via-white to-cyan-50">
      <div className="flex-1 lg:w-[70%] flex flex-col items-center justify-center px-6 py-10 relative overflow-hidden shrink-0">
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
            ابحث عن حالة طلبك باستخدام رقم الطلب أو رقم الموبايل
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
                ? "bg-[#f36802] text-white shadow-md"
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
                ? "bg-[#f36802] text-white shadow-md"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <MdPhone size={18} />
            رقم الموبايل
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
                inputMode="numeric"
                autoComplete="off"
                maxLength={10}
                value={code}
                onChange={(e) => {
                  setCode(normalizeIndex(e.target.value));
                  setError(null);
                }}
                placeholder="مثال: 25"
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
                رقم الموبايل
              </label>
              <input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(formatPhoneNumber(e.target.value));
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
              className="flex-1 sm:flex-none min-w-35 flex items-center justify-center gap-2"
              disabled={loading}
            >
              <MdSearch size={22} />
              {loading ? "جاري البحث..." : "استعلم"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="large"
              className="flex-1 sm:flex-none min-w-35 flex items-center justify-center gap-2"
              onClick={() => router.push("/start")}
            >
              <MdHome size={22} />
              الصفحة الرئيسية
            </Button>
          </div>
        </form>

        <p className="text-xs text-gray-500">
          <Link
            href="/internet-basvuru-formu"
            className="text-[#18a2e3] font-medium hover:underline"
          >
            ليس لديك طلب؟ تقديم طلب جديد
          </Link>
        </p>
      </div>

      {/* Admin Note Popup Component */}
      {adminNotePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() =>
              router.push(
                `/internet-basvuru-formu/status/${adminNotePopup.appIndex}`,
              )
            }
            aria-hidden
          />
          <div className="relative w-full max-w-sm rounded-[2rem] bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 md:p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <GrNotes size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-gray-900">
                  رسالة مهمة من فريق الخدمة
                </h3>
                <p className="text-gray-600 font-medium">
                  بخصوص طلبك رقم {adminNotePopup.appIndex}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-right">
                <p className="text-gray-800 font-semibold whitespace-pre-wrap leading-relaxed">
                  {adminNotePopup.note}
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <Button
                  variant="primary"
                  className="w-full justify-center !rounded-xl"
                  onClick={() =>
                    router.push(
                      `/internet-basvuru-formu/status/${adminNotePopup.appIndex}`,
                    )
                  }
                >
                  استمرار إلى تفاصيل الطلب
                </Button>
                <a
                  href="https://wa.me/902126112122"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl transition shadow-md shadow-green-500/20"
                >
                  تواصل معنا عبر واتساب
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* Sidebar Image */}
      <div className="hidden lg:block lg:w-[30%] shrink-0">
        <div className="fixed top-0 left-0 lg:w-[30%] h-svh bg-blue-50 overflow-hidden">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/95 via-[#0f172a]/40 to-black/20 z-10 pointer-events-none"></div>
          
          {/* Decorative touches */}
          <div className="absolute bottom-16 left-10 right-10 z-20 text-white flex flex-col gap-5 drop-shadow-xl animate-fade-in-up">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              <MdInfoOutline className="w-8 h-8 text-blue-300" />
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-3 tracking-wide">استعلام عن الطلب</h3>
              <p className="text-white/80 text-sm leading-relaxed opacity-95">
                تتبع حالة طلبك بكل سهولة، نحن هنا لضمان تقديم أفضل الخدمات بكل شفافية.
              </p>
            </div>
          </div>

          <img
            src="/consulting.jpg"
            alt="Inquiry visual"
            className="w-full h-full object-cover animate-step-in-right relative z-0"
          />
        </div>
      </div>
    </div>
  );
}
