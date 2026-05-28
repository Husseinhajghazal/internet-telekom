"use client";

import React from "react";
import { createPortal } from "react-dom";
import { Field } from "formik";
import {
  MdCheckCircle,
  MdWifi,
  MdFlashOn,
  MdElectricBolt,
  MdRocketLaunch,
} from "react-icons/md";
import { HiArrowLeft } from "react-icons/hi";
import { FaInfoCircle } from "react-icons/fa";

const palettes = {
  purple: {
    activeRing: "ring-purple-500/50",
    activeBorder: "border-purple-400",
    activeBg: "bg-purple-50/60",
    badgeBg: "bg-purple-500",
    textGradient: "from-purple-600 to-fuchsia-500",
    iconBg: "bg-purple-100 text-purple-600",
    check: "text-purple-500",
    priceText: "text-purple-700",
    backGradient: "bg-gradient-to-br from-purple-600 to-fuchsia-600",
    backCheck: "text-white",
  },
  blue: {
    activeRing: "ring-blue-500/50",
    activeBorder: "border-blue-400",
    activeBg: "bg-blue-50/60",
    badgeBg: "bg-blue-500",
    textGradient: "from-blue-600 to-cyan-500",
    iconBg: "bg-blue-100 text-blue-600",
    check: "text-blue-500",
    priceText: "text-blue-700",
    backGradient: "bg-gradient-to-br from-blue-600 to-cyan-600",
    backCheck: "text-white",
  },
  green: {
    activeRing: "ring-emerald-500/50",
    activeBorder: "border-emerald-400",
    activeBg: "bg-emerald-50/60",
    badgeBg: "bg-emerald-500",
    textGradient: "from-emerald-600 to-teal-500",
    iconBg: "bg-emerald-100 text-emerald-600",
    check: "text-emerald-500",
    priceText: "text-emerald-700",
    backGradient: "bg-gradient-to-br from-emerald-600 to-teal-600",
    backCheck: "text-white",
  },
};

const TechTypeGrid = ({ options, selectedTechType, detailsText }) => {
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
  const getValueIcon = (value) => {
    if (value === "vdsl") return MdElectricBolt;
    if (value === "fiber") return MdFlashOn;
    if (value === "gigafiber") return MdRocketLaunch;
    return MdWifi;
  };
  return (
    <>
      <div className="flex items-center gap-3 mb-8">
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
            {detailsText && (
              <button
                type="button"
                onClick={() => setIsDetailsOpen(true)}
                className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-xl px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-purple-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white bg-linear-to-r from-purple-600 via-fuchsia-500 to-purple-600 bg-[length:200%_100%] hover:bg-[position:100%_0] shrink-0"
              >
                <span className="absolute inset-0 -z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-linear-to-r from-white/0 via-white/25 to-white/0 translate-x-[-120%] group-hover:translate-x-[120%]" />
                <FaInfoCircle className="relative z-10 h-3 w-3" />
                <span className="relative z-10">معلومات إضافية</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex lg:grid flex-nowrap lg:grid-cols-3 overflow-x-auto overflow-y-hidden lg:overflow-visible gap-5 md:gap-6 snap-x lg:snap-none snap-mandatory pb-10 pt-4 px-3 md:px-0 w-full md:max-w-5xl mx-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {options.map((opt) => {
          const valueKey = opt.value;
          const isSelected = selectedTechType === valueKey;
          const palette = palettes[opt.color] || palettes.blue;
          const SpeedIcon = getValueIcon(opt.value);
          const oldPrice = opt.price
            ? Math.ceil(parseInt(opt.price, 10) / 0.65)
            : null;

          return (
            <label
              key={valueKey}
              className="group relative cursor-pointer shrink-0 w-[75vw] sm:w-[320px] lg:w-auto snap-center [perspective:2000px] transition-transform duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] rounded-3xl"
            >
              <Field
                type="radio"
                name="noContractTechType"
                value={valueKey}
                className="peer sr-only"
              />

              {/* 3D Flipping Container */}
              <div
                className={`relative grid w-full h-full rounded-3xl transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] [transform-style:preserve-3d] 
              ${isSelected ? "[transform:rotateY(180deg)]" : "group-hover:[transform:rotateY(180deg)]"}`}
              >
                {/* === FRONT FACE === */}
                <div
                  className={`col-start-1 row-start-1 relative flex flex-col h-full rounded-3xl border-2 bg-white/70 backdrop-blur-xl [backface-visibility:hidden] overflow-hidden shadow-md transition-all duration-500
                ${
                  isSelected
                    ? `${palette.activeBorder} ${palette.activeRing} ring-4 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]`
                    : "border-transparent hover:border-gray-200"
                }`}
                >
                  {/* Background Shadow Icon */}
                  <div className="absolute -right-12 -bottom-6 pointer-events-none transform -rotate-12 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 z-0">
                    <SpeedIcon className="w-56 h-56 text-gray-100/80" />
                  </div>
                  {/* Subtle Glowing Blob */}
                  <div
                    className={`absolute -top-16 -right-16 w-48 h-48 rounded-full mix-blend-multiply blur-3xl transition-all duration-700 pointer-events-none
                  ${isSelected ? "opacity-30 scale-125 bg-gradient-to-br " + palette.textGradient : "opacity-0 group-hover:opacity-15 bg-gradient-to-br " + palette.textGradient}`}
                  />

                  {/* Header: Icon & Radio Bubble */}
                  <div className="px-6 pt-6 pb-2 flex justify-between items-start relative z-10">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors duration-500 ${
                        isSelected
                          ? palette.badgeBg +
                            " text-white shadow-xl shadow-" +
                            opt.color +
                            "-500/30"
                          : palette.iconBg
                      }`}
                    >
                      <SpeedIcon className="text-3xl" />
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {oldPrice && (
                        <span className="inline-flex items-center gap-1 bg-red-500 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-lg shadow-red-500/40 tracking-wide animate-pulse">
                          خصم 35%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Hero Numbers */}
                  <div className="px-6 py-4 relative z-10">
                    <div className="text-xl font-extrabold text-gray-900 mb-4">
                      {opt.title}
                    </div>
                    <div className="flex items-baseline justify-end gap-2 mb-1">
                      <span className="text-sm font-bold text-gray-500 uppercase">
                        Mbps
                      </span>
                      <span
                        className={`text-8xl font-black tracking-tighter p-2 bg-clip-text text-transparent bg-gradient-to-r ${palette.textGradient}`}
                      >
                        {opt.speed}
                      </span>
                    </div>

                    <div className="flex items-end justify-end mt-5 gap-1.5">
                      <span className="text-sm text-gray-500 font-bold mb-1.5">
                        شهرياً / TL
                      </span>
                      <div className="flex flex-col items-end gap-0.5">
                        {oldPrice && (
                          <span className="text-2xl text-red-400 line-through font-bold leading-none">
                            {oldPrice}
                          </span>
                        )}
                        <span
                          className={`text-5xl font-extrabold tracking-tight ${isSelected ? palette.priceText : "text-gray-900"}`}
                        >
                          {opt.price}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Seamless Divider */}
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-70 my-2 relative z-10" />

                  <div className="px-6 pb-8 pt-5 relative z-10 flex-1 flex flex-col justify-center items-center opacity-70 mt-4">
                    <span
                      className={`text-sm font-bold uppercase animate-pulse transition-colors ${isSelected ? palette.priceText : "text-gray-500"}`}
                    >
                      اضغط هنا لرؤية تفاصيل أكثر
                    </span>
                  </div>
                </div>

                {/* === BACK FACE (Colorful Premium) === */}
                <div
                  className={`col-start-1 row-start-1 relative flex flex-col h-full rounded-3xl [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden shadow-2xl transition-all duration-300
                ${palette.backGradient}
                ${
                  isSelected
                    ? `border-2 ${palette.activeBorder} ring-4 ${palette.activeRing}`
                    : "border border-white/20"
                }`}
                >
                  {/* background image */}
                  <div
                    className="absolute w-48 inset-0 opacity-[0.15] bg-contain bg-no-repeat bg-top-center mt-5 mr-15 pointer-events-none"
                    style={{ backgroundImage: "url('/internet-meter-3.png')" }}
                  />

                  {/* subtle dot-grid texture */}
                  <div
                    className="absolute inset-0 opacity-[0.08]"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, white 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />

                  {/* top-right glow orb */}
                  <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/25 rounded-full blur-3xl pointer-events-none" />
                  {/* bottom-left glow orb */}
                  <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-black/20 rounded-full blur-2xl pointer-events-none" />

                  <div className="relative z-10 p-6 flex flex-col gap-4 flex-1">
                    {/* speed + icon row */}
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-white/50 text-[10px] font-bold uppercase tracking-[0.15em]">
                          السرعة
                        </span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-white font-black text-5xl tracking-tight leading-none">
                            {opt.speed}
                          </span>
                          <span className="text-white/50 text-sm font-bold self-end mb-0.5">
                            Mbps
                          </span>
                        </div>
                      </div>
                      <div className="w-13 h-13 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center p-3 backdrop-blur-sm">
                        <SpeedIcon className="text-3xl text-white" />
                      </div>
                    </div>

                    {/* title */}
                    <div className="text-white font-bold text-base">
                      {opt.title}
                    </div>

                    {/* price chip */}
                    <div className="flex items-center justify-between bg-black/20 border border-white/15 rounded-2xl px-4 py-3 backdrop-blur-sm">
                      <div className="flex flex-col gap-1">
                        <span className="text-white/60 text-xs font-semibold">
                          الإشتراك الشهري
                        </span>
                        {oldPrice && (
                          <span className="inline-flex items-center bg-red-500/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full w-fit">
                            خصم 35%
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-0.5">
                        {oldPrice && (
                          <span className="text-white/50 text-lg font-bold line-through leading-none">
                            {oldPrice} TL
                          </span>
                        )}
                        <div className="flex items-baseline gap-1">
                          <span className="text-white font-black text-2xl tracking-tight">
                            {opt.price}
                          </span>
                          <span className="text-white/50 text-xs font-bold">
                            TL
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* divider */}
                    <div className="h-px w-full bg-white/15" />

                    {/* features */}
                    <ul className="space-y-2.5 flex-1">
                      {opt.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
                            <MdCheckCircle className="text-white text-xs" />
                          </div>
                          <span className="text-white/85 text-sm font-medium leading-snug">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Visual CTA Button */}
                    <div className="mt-auto pt-2 w-full">
                      <div className="w-full bg-white rounded-2xl px-4 py-3.5 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200">
                        <span
                          className={`font-extrabold text-sm ${palette.priceText}`}
                        >
                          تم الإختيار بنجاح
                        </span>
                        <HiArrowLeft
                          className={`w-4 h-4 ${palette.priceText}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </label>
          );
        })}
      </div>

      {detailsText &&
        isDetailsOpen &&
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
                {detailsText}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default TechTypeGrid;
