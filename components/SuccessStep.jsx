import React from "react";
import Button from "./Button";
import { formatDate } from "@/utils/general";
import { MdHome, MdAddCircleOutline, MdCheckCircle } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";

const STATUS_LABELS = {
  NOT_COMPLETED: "غير مكتمل",
  UNDER_REVIEW: "قيد المراجعة",
  REJECTED: "مرفوض",
  COMPLETED: "مكتمل",
};

const SuccessStep = ({ submissionInfo }) => {
  const appIndex = submissionInfo?.appIndex ?? "------";
  const createdAtLabel = submissionInfo?.createdAt
    ? formatDate(submissionInfo.createdAt)
    : "—";
  const statusLabel = STATUS_LABELS[submissionInfo?.status] || "—";

  return (
    <div className="flex flex-row min-h-svh bg-linear-to-br from-blue-50 via-white to-cyan-50">
      <div className="flex-1 lg:w-[70%] flex flex-col items-center justify-center min-h-svh p-6 relative shrink-0">
        <div className="max-w-2xl mx-auto w-full text-center space-y-8 relative z-10">
          {/* Success Icon */}
          <div className="relative">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-linear-to-br from-green-400 to-green-600 rounded-full shadow-2xl">
              <svg
                className="w-16 h-16 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="absolute inset-0 bg-linear-to-br from-green-300/30 to-green-500/30 rounded-full animate-ping"></div>
          </div>

          {/* Success Message */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
              تم إستلام طلبك بنجاح!
            </h1>
            <p className="text-xl text-gray-600">
              شكراً لك على تقديم الطلب
            </p>
          </div>

          {/* Details */}
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <div className="text-right space-y-4">
              <div className="flex items-center justify-start gap-3">
                <span className="text-gray-700 font-medium">رقم الطلب:</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold">
                  {appIndex}
                </span>
              </div>
              <div className="flex items-center justify-start gap-3">
                <span className="text-gray-700">تاريخ الإرسال:</span>
                <span className="text-gray-600">
                  {createdAtLabel}
                </span>
              </div>
              <div className="flex items-center justify-start gap-3">
                <span className="text-gray-700">حالة الطلب:</span>
                <span className="text-amber-700 bg-amber-100 px-3 py-1 rounded-full font-semibold">
                  {statusLabel}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-right">
                ما سيحدث الآن:
              </h3>
              <div className="space-y-3 text-right">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">1</span>
                  </div>
                  <span className="text-gray-700">
                    سيتم مراجعة طلبك من قبل موظفينا
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">2</span>
                  </div>
                  <span className="text-gray-700">سنتواصل معك في أسرع وقت ممكن</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-linear-to-r from-blue-50 to-cyan-50 rounded-xl p-6">
            <div className="text-center space-y-2">
              <h4 className="text-lg font-semibold text-gray-800">
                هل تحتاج مساعدة؟
              </h4>
                  <a
                    href="https://wa.me/902126112122"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl transition shadow-md shadow-green-500/20 mt-3"
                  >
                    <FaWhatsapp size={22} />
                    تواصل معنا عبر واتساب
                  </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button variant="primary" size="large" onClick={() => window.location.reload()} className="flex items-center gap-2">
              <MdAddCircleOutline size={22} />
              طلب جديد
            </Button>
            <Button variant="secondary" size="large" onClick={() => window.location.href = '/start'} className="flex items-center gap-2">
              <MdHome size={22} />
              الصفحة الرئيسية
            </Button>
          </div>
        </div>
      </div>
      
      {/* Sidebar Image */}
      <div className="hidden lg:block lg:w-[30%] shrink-0">
        <div className="fixed top-0 left-0 lg:w-[30%] h-svh bg-blue-50 overflow-hidden">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/95 via-[#0f172a]/40 to-black/20 z-10 pointer-events-none"></div>
          
          {/* Decorative touches */}
          <div className="absolute bottom-16 left-10 right-10 z-20 text-white flex flex-col gap-5 drop-shadow-xl animate-fade-in-up">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              <MdCheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-3 tracking-wide">جارٍ المراجعة</h3>
              <p className="text-white/80 text-sm leading-relaxed opacity-95">
                نسعد بخدمتك.. طلبك في أيدٍ أمينة وسيتم التواصل معك لإنهاء باقي الإجراءات.
              </p>
            </div>
          </div>

          <img
            src="/approve.jpg"
            alt="Success visual"
            className="w-full h-full object-cover animate-step-in-right relative z-0"
          />
        </div>
      </div>
    </div>
  );
};

export default SuccessStep;
