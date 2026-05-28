"use client";

import React, { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useInView } from "framer-motion";
import { MdElectricBolt } from "react-icons/md";
import { FaFileContract } from "react-icons/fa";
import { HiLightningBolt } from "react-icons/hi";
import { FaInfoCircle } from "react-icons/fa";
import { MdRocketLaunch } from "react-icons/md";

import NoContractCards from "./NoContractCards";
import WithContractCards from "./WithContractCards";

const PackagesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <section
      id="packages"
      className="py-12 md:py-20 bg-white relative overflow-hidden"
    >
      {/* bg decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#18a2e3]/[0.03] rounded-full blur-[150px]" />

      {/* animated glow orbs */}
      <div className="absolute z-[1] top-20 right-20 w-[400px] h-[400px] bg-[#f36802] rounded-full blur-[160px] animate-glow-pulse opacity-10" />
      <div className="absolute z-[1] bottom-20 left-10 w-[350px] h-[350px] bg-[#18a2e3] rounded-full blur-[140px] animate-glow-pulse-alt opacity-10" />

      {/* big background icon */}
      <div className="absolute z-[1] top-1/2 left-20 -translate-y-1/2 pointer-events-none">
        <MdElectricBolt className="w-[400px] h-[400px] text-[#18a2e3]/[0.05]" />
      </div>

      <div ref={ref} className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
            اختر الباقة{" "}
            <span className="bg-linear-to-l from-[#18a2e3] to-[#5898b7] bg-clip-text text-transparent">
              المناسبة لك
            </span>
          </h2>
          <p className="text-gray-500 md:text-lg max-w-xl mx-auto">
            باقات مرنة تناسب جميع الإحتياجات
          </p>
        </motion.div>

        {/* No Contract Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-linear-to-l from-purple-200 to-transparent" />
            <div className="flex items-center gap-3 bg-linear-to-l from-purple-50 to-fuchsia-50 border border-purple-100 rounded-2xl px-5 py-2.5 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-linear-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center shadow-md">
                <HiLightningBolt className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-bold bg-linear-to-l from-purple-600 to-fuchsia-500 bg-clip-text text-transparent whitespace-nowrap">
                بدون عقد إشتراك
              </span>
            </div>
            <div className="flex-1 h-px bg-linear-to-r from-fuchsia-200 to-transparent" />
          </div>

          <div className="max-w-5xl mx-auto flex items-center gap-3 mb-8">
            <div
              className={`w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center`}
            >
              <MdRocketLaunch size={24} className={"text-purple-600"} />
            </div>
            <div className="flex items-center flex-col gap-2">
              <h3 className="text-xl font-bold text-gray-900">
                باقات الإنترنت المسبق الدفع
              </h3>
              <div className="flex items-center gap-1">
                <p className="text-sm text-gray-400">البنية التحتية لترك نت</p>
                <button
                  type="button"
                  onClick={() => setIsDetailsOpen(true)}
                  className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-xl px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-purple-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white bg-linear-to-r from-purple-600 via-fuchsia-500 to-purple-600 bg-[length:200%_100%] hover:bg-[position:100%_0] shrink-0"
                >
                  <span className="absolute inset-0 -z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-linear-to-r from-white/0 via-white/25 to-white/0 translate-x-[-120%] group-hover:translate-x-[120%]" />
                  <FaInfoCircle className="relative z-10 h-3 w-3" />
                  <span className="relative z-10">معلومات إضافية</span>
                </button>
              </div>
            </div>
          </div>

          <NoContractCards />
        </motion.div>

        {/* With Contract Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-linear-to-l from-emerald-200 to-transparent" />
            <div className="flex items-center gap-3 bg-linear-to-l from-emerald-50 to-emerald-50 border border-emerald-100 rounded-2xl px-5 py-2.5 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-linear-to-br from-emerald-500 to-emerald-500 flex items-center justify-center shadow-md">
                <FaFileContract className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-bold bg-linear-to-l from-emerald-600 to-emerald-500 bg-clip-text text-transparent whitespace-nowrap">
                مع عقد إشتراك
              </span>
            </div>
            <div className="flex-1 h-px bg-linear-to-r from-emerald-200 to-transparent" />
          </div>
          <WithContractCards />
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        ></motion.div>
      </div>

      {isDetailsOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
            onClick={() => setIsDetailsOpen(false)}
          >
            <div
              className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-purple-100 bg-purple-50">
                <h4 className="text-lg font-extrabold text-purple-800 flex items-center gap-2">
                  <FaInfoCircle className="w-4 h-4" />
                  التفاصيل والميزات
                </h4>
                <button
                  type="button"
                  onClick={() => setIsDetailsOpen(false)}
                  className="text-purple-700 hover:text-purple-900 text-2xl leading-none"
                  aria-label="إغلاق"
                >
                  ×
                </button>
              </div>
              <div className="p-5 text-justify text-purple-900/80 leading-relaxed text-sm md:text-base">
                نحن نضع بين أيديكم أقوى حلول الإنترنت المنزلي في تركيا بسرعات
                فائقة تصل إلى 1000 ميجابت عبر تقنية الألياف الضوئية (Fiber)،
                لتستمتعوا بتجربة فريدة للألعاب والبث المباشر بدقة 4K دون انقطاع.
                نمنحكم الحرية الكاملة في اختيار باقاتكم بدون عقود التزام سنوية
                أو غرامات فسخ عقد، مع ضمان إنترنت مفتوح بالكامل بدون حصة استخدام
                أو تناقص في السرعة طوال الشهر. كما نتميز بالشفافية المُطلقة في
                الفواتير مع خيار تثبيت السعر لمدة عام، ونتكفل بكافة إجراءات
                انتقالكم من شركاتكم الحالية إلينا بكل سلاسة، مدعومين بفريقنا
                الفني الذي يخدمكم باللغة العربية على مدار الساعة لضمان تجربة
                تواصل رقمية لا تشوبها شائبة.
              </div>
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
};

export default PackagesSection;
