"use client";

import React from "react";
import { Field } from "formik";
import { MdSpeed, MdCheckCircle, MdWifi, MdFlashOn, MdElectricBolt, MdRocketLaunch } from "react-icons/md";

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
  },
};

const TechTypeGrid = ({ options, selectedTechType }) => {
  const getValueIcon = (value) => {
    if (value === "vdsl") return MdElectricBolt;
    if (value === "fiber") return MdFlashOn;
    if (value === "gigafiber") return MdRocketLaunch;
    return MdWifi;
  };

  return (
    <div className="flex lg:grid flex-nowrap lg:grid-cols-3 overflow-x-auto lg:overflow-visible gap-5 md:gap-6 snap-x lg:snap-none snap-mandatory pb-10 pt-4 px-3 md:px-0 w-full md:max-w-5xl mx-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {options.map((opt) => {
        const valueKey = opt.value;
        const isSelected = selectedTechType === valueKey;
        const palette = palettes[opt.color] || palettes.blue;
        const SpeedIcon = getValueIcon(opt.value);

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
                  <SpeedIcon className="w-56 h-56 text-blue-100" />
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
                      isSelected ? palette.badgeBg + " text-white shadow-xl shadow-" + opt.color + "-500/30" : palette.iconBg
                    }`}
                  >
                    <SpeedIcon className="text-3xl" />
                  </div>
                  
                  <div
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-500 ease-spring ${
                      isSelected
                        ? `border-transparent ${palette.badgeBg} scale-110 shadow-md`
                        : "border-gray-300 group-hover:border-gray-400 group-hover:scale-105"
                    }`}
                  >
                    <div className={`w-2.5 h-2.5 rounded-full bg-white transition-all duration-300 ${isSelected ? "scale-100 opacity-100" : "scale-0 opacity-0"}`} />
                  </div>
                </div>

                {/* Hero Numbers */}
                <div className="px-6 py-4 relative z-10">
                  <div className="text-xl font-extrabold text-gray-900 mb-4">{opt.title}</div>
                  <div className="flex items-baseline justify-end gap-2 mb-1">
                    <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Mbps</span>
                    <span className={`text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r ${palette.textGradient}`}>
                      {opt.speed}
                    </span>
                  </div>
                  
                  <div className="flex items-end justify-end mt-5 gap-1.5">
                    <span className="text-sm text-gray-500 font-bold mb-1.5">شهرياً / TL</span>
                    <span className={`text-4xl font-extrabold tracking-tight ${isSelected ? palette.priceText : "text-gray-900"}`}>
                      {opt.price}
                    </span>
                  </div>
                </div>

                {/* Seamless Divider */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-70 my-2 relative z-10" />

                <div className="px-6 pb-8 pt-5 relative z-10 flex-1 flex flex-col justify-center items-center opacity-70 mt-4">
                  <span className={`text-sm font-bold uppercase tracking-widest animate-pulse transition-colors ${isSelected ? palette.priceText : "text-gray-500"}`}>
                    اضغط على الباقة لرؤية التفاصيل
                  </span>
                </div>
              </div>

              {/* === BACK FACE === */}
              <div
                className={`col-start-1 row-start-1 relative flex flex-col h-full rounded-3xl border-2 bg-white/95 backdrop-blur-2xl [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden shadow-xl
                ${
                  isSelected
                    ? `${palette.activeBorder} ${palette.activeRing} ring-4 ${palette.activeBg}`
                    : "border-gray-200"
                }`}
              >
                {/* Background Shadow Icon Reversed */}
                <div className="absolute -left-12 -bottom-6 pointer-events-none transform rotate-12 z-0 opacity-[0.02]">
                  <SpeedIcon className="w-56 h-56 text-gray-900" />
                </div>

                {/* Compact Header */}
                <div className="px-5 pt-5 pb-3 relative z-10 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <div className="flex flex-col items-start justify-center gap-0.5">
                    <span className="text-base font-extrabold text-gray-600 uppercase tracking-wider">{opt.title} <span className="text-base text-purple-400">({opt.speed} Mbps)</span></span>
                    <span className={`text-xl font-black tracking-tight ${isSelected ? palette.priceText : "text-gray-800"}`}>
                      {opt.price} <span className="text-[10px] text-gray-500 font-bold tracking-normal uppercase">TL / شهرياً</span>
                    </span>
                  </div>
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-500 ${
                      isSelected ? palette.badgeBg + " text-white shadow-md shadow-" + opt.color + "-500/30" : palette.iconBg
                    }`}
                  >
                    <SpeedIcon className="text-xl" />
                  </div>
                </div>

                {/* Features List */}
                <div className="px-5 pb-6 pt-4 relative z-10 flex-1 flex flex-col justify-start">
                  <ul className="space-y-4 text-sm font-semibold text-gray-700 leading-relaxed">
                    {opt.features.map((feature, i) => (
                      <li key={i} className="flex items-start justify-end gap-3 group/item">
                        <span className={`transition-colors duration-300 ${isSelected ? 'text-gray-800' : 'text-gray-600'}`}>
                          {feature}
                        </span>
                        <MdCheckCircle className={`shrink-0 text-lg mt-0.5 transition-colors duration-300 ${isSelected ? palette.check : 'text-gray-300'}`} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          </label>
        );
      })}
    </div>
  );
};

export default TechTypeGrid;
