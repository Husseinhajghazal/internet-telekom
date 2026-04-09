"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  FaCheck,
  FaArrowLeft,
  FaCrown,
  FaGem,
  FaFireAlt,
} from "react-icons/fa";
import {
  MdSpeed,
  MdWifi,
  MdFlashOn,
  MdElectricBolt,
  MdRocketLaunch,
  MdCheckCircle,
} from "react-icons/md";
import { BsFillAirplaneFill } from "react-icons/bs";

/* ── Speed-based icon helper ── */
const getSpeedIcon = (speedStr) => {
  const speed = parseInt(speedStr, 10) || 0;
  if (speed >= 1000) return MdRocketLaunch;
  if (speed >= 500) return MdElectricBolt;
  if (speed >= 200) return FaFireAlt;
  if (speed >= 100) return MdFlashOn;
  if (speed >= 50) return BsFillAirplaneFill;
  if (speed >= 24) return MdSpeed;
  return MdWifi;
};

/* ──────────────────────────────────────────────
   No-contract packages (purple palette)
   ────────────────────────────────────────────── */
const noContractPackages = [
  {
    value: "vdsl",
    title: "VDSL",
    speed: "100",
    price: 699,
    popular: false,
    features: [
      "التسجيل مجاني تماماً",
      "التحميل غير محدود",
      "التركيب خلال 48 ساعة",
      "الراوتر تقسيط مع الفاتورة",
    ],
  },
  {
    value: "fiber",
    title: "Fiber",
    speed: "100",
    price: 699,
    popular: true,
    features: [
      "التسجيل مجاني تماماً",
      "التحميل غير محدود",
      "التركيب خلال 48 ساعة",
      "الراوترات الفايبر مجاناً",
    ],
  },
  {
    value: "gigafiber",
    title: "GigaFiber",
    speed: "1000",
    price: 699,
    popular: false,
    features: [
      "التسجيل مجاني تماماً",
      "التحميل غير محدود",
      "التركيب خلال 48 ساعة",
      "الراوترات الفايبر مجاناً",
    ],
  },
];

/* purple palette for no-contract */
const purplePalette = {
  iconBg: "bg-purple-100 text-purple-600",
  badgeBg: "bg-purple-500",
  textGradient: "from-purple-600 to-fuchsia-500",
  backGradient: "bg-gradient-to-br from-purple-600 to-fuchsia-600",
  priceText: "text-purple-700",
};

/* ──────────────────────────────────────────────
   With-contract: Family & VIP
   ────────────────────────────────────────────── */
const contractPackages = [
  {
    category: "باقات الإنترنت العائلي والاقتصادي",
    subtitle: "البنية التحتية لجوك تيليكوم",
    icon: FaCrown,
    iconBg: "bg-emerald-100 text-emerald-600",
    badgeBg: "bg-emerald-500",
    textGradient: "from-emerald-600 to-teal-500",
    backGradient: "bg-gradient-to-br from-emerald-600 to-teal-600",
    priceText: "text-emerald-700",
    speeds: [
      { speed: "24", price: "650", duration: "18 شهر", features: ["الفاتورة حقيقية وثابتة", "التحميل غير محدود", "التسجيل مجاني تماماً", "التركيب خلال 48 ساعة", "راوتر بتقنية الجيل الخامس"] },
      { speed: "50", price: "675", duration: "18 شهر", features: ["الفاتورة حقيقية وثابتة", "التحميل غير محدود", "التسجيل مجاني تماماً", "التركيب خلال 48 ساعة", "راوتر بتقنية الجيل الخامس"] },
      { speed: "100", price: "700", duration: "18 شهر", features: ["الفاتورة حقيقية وثابتة", "التحميل غير محدود", "التسجيل مجاني تماماً", "التركيب خلال 48 ساعة", "راوتر بتقنية الجيل الخامس"] },
    ],
  },
  {
    category: "باقات الإنترنت الأقوى والأسرع",
    subtitle: "البنية التحتية لترك تيليكوم",
    icon: FaGem,
    iconBg: "bg-blue-100 text-blue-600",
    badgeBg: "bg-blue-500",
    textGradient: "from-blue-600 to-cyan-500",
    backGradient: "bg-gradient-to-br from-blue-600 to-cyan-600",
    priceText: "text-blue-700",
    speeds: [
      { speed: "200", price: "800", duration: "18 شهر", features: ["الفاتورة حقيقية وثابتة", "التحميل غير محدود", "التسجيل مجاني تماماً", "التركيب خلال 48 ساعة", "راوتر بتقنية الجيل السادس"] },
      { speed: "500", price: "900", duration: "18 شهر", features: ["الفاتورة حقيقية وثابتة", "التحميل غير محدود", "التسجيل مجاني تماماً", "التركيب خلال 48 ساعة", "راوتر بتقنية الجيل السادس"] },
      { speed: "1000", price: "1000", duration: "18 شهر", features: ["الفاتورة حقيقية وثابتة", "التحميل غير محدود", "التسجيل مجاني تماماً", "التركيب خلال 48 ساعة", "راوتر بتقنية الجيل السادس"] },
    ],
  },
];

/* ══════════════════════════════════════════════
   Flipping Card Component (shared by both tabs)
   ══════════════════════════════════════════════ */
const FlippingCard = ({
  speed,
  price,
  title,
  features,
  palette,
  popular,
}) => {
  const SpeedIcon = getSpeedIcon(speed);

  return (
    <div className="group relative [perspective:2000px] transition-transform duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] rounded-3xl">
      {/* popular badge */}
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30">
          <span className="px-4 py-1 rounded-full bg-gradient-to-l from-[#f36802] to-[#ffb245] text-white text-xs font-bold shadow-lg shadow-[#f36802]/20">
            الأكثر طلباً
          </span>
        </div>
      )}

      {/* 3D Flipping Container */}
      <div className="relative grid w-full h-full rounded-3xl transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">

        {/* === FRONT FACE === */}
        <div className="col-start-1 row-start-1 relative flex flex-col h-full rounded-3xl border-2 border-transparent bg-white/70 backdrop-blur-xl [backface-visibility:hidden] overflow-hidden shadow-md hover:border-gray-200">
          {/* Background Shadow Icon */}
          <div className="absolute -right-12 -bottom-6 pointer-events-none transform -rotate-12 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 z-0">
            <SpeedIcon className="w-56 h-56 text-gray-100/80" />
          </div>

          {/* Glowing Blob */}
          <div className={`absolute -top-16 -right-16 w-48 h-48 rounded-full mix-blend-multiply blur-3xl transition-all duration-700 pointer-events-none opacity-0 group-hover:opacity-15 bg-gradient-to-br ${palette.textGradient}`} />

          {/* Header: Icon */}
          <div className="px-6 pt-6 pb-2 flex justify-between items-start relative z-10">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${palette.iconBg}`}>
              <SpeedIcon className="text-3xl" />
            </div>
          </div>

          {/* Speed Number */}
          <div className="px-6 py-4 relative z-10">
            <div className="flex items-baseline justify-end gap-2 mb-1">
              <span className="text-sm font-bold text-gray-500 uppercase">Mbps</span>
              <span className={`text-8xl font-black tracking-tighter bg-clip-text p-2 text-transparent bg-gradient-to-r ${palette.textGradient}`}>
                {speed}
              </span>
            </div>

            <div className="flex items-end justify-end mt-5 gap-1.5">
              <span className="text-sm text-gray-500 font-bold mb-1.5">شهرياً / TL</span>
              <span className="text-5xl font-extrabold tracking-tight text-gray-900">
                {price}
              </span>
            </div>

            {title && (
              <div className="mt-3 text-left">
                <span className={`text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r ${palette.textGradient}`}>
                  {title}
                </span>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-70 my-2 relative z-10" />

          {/* CTA hint */}
          <div className="px-6 pb-8 pt-5 relative z-10 flex-1 flex flex-col justify-center items-center opacity-70 mt-4">
            <span className="text-sm font-bold uppercase animate-pulse text-gray-500">
              اضغط هنا لرؤية تفاصيل أكثر
            </span>
          </div>
        </div>

        {/* === BACK FACE === */}
        <div className={`col-start-1 row-start-1 relative flex flex-col h-full rounded-3xl border-2 border-transparent ${palette.backGradient} [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden shadow-xl`}>
          {/* Background Shadow Icon  */}
          <div className="absolute -left-12 -bottom-6 pointer-events-none transform rotate-12 z-0 opacity-10">
            <SpeedIcon className="w-56 h-56 text-white" />
          </div>

          {/* Compact Header */}
          <div className="px-5 pt-5 pb-3 relative z-10 border-b border-white/20 flex justify-between items-center bg-black/10">
            <div className="flex flex-col items-start justify-center">
              <span className="flex items-baseline justify-start gap-1 text-2xl font-black tracking-tighter text-white">
                <span className="text-base font-bold text-white/70 uppercase">Mbps</span>
                <span>{speed}</span>
              </span>
              <span className="text-lg font-extrabold text-white flex items-center gap-1">
                <span className="text-[12px] text-white/70 font-bold tracking-normal uppercase">شهرياً / TL</span>
                {price}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white/20 text-white">
              <SpeedIcon className="text-xl" />
            </div>
          </div>

          {/* Features List */}
          <div className="px-5 pb-6 pt-4 relative z-10 flex-1 flex flex-col justify-start">
            <ul className="space-y-4 text-sm font-semibold text-white leading-relaxed">
              {features.map((feature, i) => (
                <li key={i} className="flex items-start justify-start gap-3">
                  <MdCheckCircle className="shrink-0 text-lg mt-0.5 text-white" />
                  <span className="text-white/90">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA button on back */}
          <div className="px-5 pb-5 relative z-10">
            <Link
              href="/internet-basvuru-formu"
              className="block w-full py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white text-center font-bold text-sm transition-all duration-300 backdrop-blur-sm"
            >
              سجّل الآن ←
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   Main Section
   ══════════════════════════════════════════════ */
const PackagesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [tab, setTab] = useState("no-contract");

  return (
    <section id="packages" className="py-20 md:py-28 bg-white relative overflow-hidden">
      {/* bg decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#18a2e3]/[0.03] rounded-full blur-[150px]" />

      {/* animated glow orbs */}
      <motion.div
        animate={{ scale: [1, 1.25, 1], opacity: [0.08, 0.14, 0.08] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute z-[1] top-20 right-20 w-[400px] h-[400px] bg-[#f36802] rounded-full blur-[160px]"
      />
      <motion.div
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.06, 0.12, 0.06] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute z-[1] bottom-20 left-10 w-[350px] h-[350px] bg-[#18a2e3] rounded-full blur-[140px]"
      />

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
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#18a2e3]/10 text-[#18a2e3] text-sm font-semibold mb-4">
            الباقات والأسعار
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
            اختر الباقة{" "}
            <span className="bg-gradient-to-l from-[#18a2e3] to-[#5898b7] bg-clip-text text-transparent">
              المناسبة لك
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            باقات مرنة تناسب جميع الاحتياجات سواء بعقد أو بدون عقد
          </p>
        </motion.div>

        {/* tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex bg-gray-100 rounded-2xl p-1.5">
            <button
              onClick={() => setTab("no-contract")}
              className={`relative px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                tab === "no-contract"
                  ? "text-white shadow-lg bg-gradient-to-l from-[#f36802] to-[#ffb245]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "no-contract" && (
                <motion.span
                  layoutId="pkg-tab"
                  className="absolute inset-0 bg-gradient-to-l from-[#18a2e3] to-[#5898b7] rounded-xl -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              بدون عقد
            </button>
            <button
              onClick={() => setTab("with-contract")}
              className={`relative px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                tab === "with-contract"
                  ? "text-white shadow-lg bg-gradient-to-l from-[#f36802] to-[#ffb245]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "with-contract" && (
                <motion.span
                  layoutId="pkg-tab"
                  className="absolute inset-0 bg-gradient-to-l from-[#18a2e3] to-[#5898b7] rounded-xl -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              مع عقد اشتراك
            </button>
          </div>
        </motion.div>

        {/* content */}
        <AnimatePresence mode="wait">
          {tab === "no-contract" ? (
            <motion.div
              key="no-contract"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <NoContractCards />
            </motion.div>
          ) : (
            <motion.div
              key="with-contract"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <WithContractCards />
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link
            href="/internet-basvuru-formu"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-[#ffb245] font-bold text-lg hover:scale-105 transition-all duration-300"
          >
            سجّل الآن واحصل على باقتك
            <FaArrowLeft className="text-sm" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════
   No-contract cards (purple flipping design)
   ═══════════════════════════════════════════ */
const NoContractCards = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
    {noContractPackages.map((pkg, i) => (
      <motion.div
        key={pkg.value}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 * i }}
      >
        <FlippingCard
          speed={pkg.speed}
          price={pkg.price}
          title={`${pkg.title} — بدون عقد`}
          features={pkg.features}
          palette={purplePalette}
          popular={pkg.popular}
        />
      </motion.div>
    ))}
  </div>
);

/* ═══════════════════════════════════════════
   With-contract cards (green + blue flipping)
   ═══════════════════════════════════════════ */
const WithContractCards = () => (
  <div className="max-w-5xl mx-auto space-y-12">
    {contractPackages.map((group, gi) => (
      <div key={gi}>
        {/* section header */}
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-xl ${group.iconBg.split(" ")[0]} flex items-center justify-center`}>
            <group.icon size={18} className={group.iconBg.split(" ")[1]} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{group.category}</h3>
            <p className="text-sm text-gray-400">{group.subtitle}</p>
          </div>
        </div>

        {/* speed cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {group.speeds.map((item, i) => (
            <motion.div
              key={`${gi}-${item.speed}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * i }}
            >
              <FlippingCard
                speed={item.speed}
                price={item.price}
                title={`عقد ${item.duration}`}
                features={item.features}
                palette={{
                  iconBg: group.iconBg,
                  badgeBg: group.badgeBg,
                  textGradient: group.textGradient,
                  backGradient: group.backGradient,
                  priceText: group.priceText,
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    ))}

    {/* disclaimer */}
    <div className="bg-[#18a2e3]/5 rounded-2xl p-5 border border-[#18a2e3]/10 text-center">
      <p className="text-sm text-gray-600 leading-relaxed">
        الأسعار تختلف حسب مدة العقد والسرعة المختارة. تواصل معنا للحصول على أفضل عرض يناسب احتياجاتك مع استشارة مجانية.
      </p>
    </div>
  </div>
);

export default PackagesSection;
