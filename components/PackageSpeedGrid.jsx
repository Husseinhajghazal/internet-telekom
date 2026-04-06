"use client";

import React from "react";
import { Field } from "formik";
import { MdSpeed, MdCheckCircle, MdWifi, MdFlashOn, MdElectricBolt, MdRocketLaunch } from "react-icons/md";
import { BsFillAirplaneFill } from "react-icons/bs";
import { FaFireAlt } from "react-icons/fa";
import { PRICES_TL, PACKAGE_FEATURES } from "@/utils/data"

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

const PackageSpeedGrid = ({
  kind,
  duration,
  speeds,
  theme = "blue",
  selectedPackage,
}) => {
  const palette = palettes[theme] || palettes.blue;

  const getStaticPriceTl = (speed) => {
    const price = PRICES_TL?.[kind]?.[String(duration)]?.[String(speed)];
    return typeof price === "number" ? price : 0;
  };

  const getSpeedIcon = (speedStr) => {
    const speed = parseInt(speedStr, 10) || 0;
    if (speed >= 1000) return MdRocketLaunch;
    if (speed >= 500) return MdElectricBolt;
    if (speed >= 200) return FaFireAlt;
    if (speed >= 100) return MdFlashOn;
    if (speed >= 50) return MdSpeed;
    if (speed >= 24) return BsFillAirplaneFill;
    return MdWifi;
  };

  return (
    <div className="flex lg:grid flex-nowrap lg:grid-cols-2 xl:grid-cols-3 overflow-x-auto lg:overflow-visible gap-5 md:gap-6 snap-x lg:snap-none snap-mandatory pb-10 pt-4 px-6 lg:px-2 w-full scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {speeds.map((speed) => {
        const valueKey = duration
          ? `${kind}-${duration}-${speed}`
          : `${kind}-${speed}`;
        const priceTl = getStaticPriceTl(speed);
        const isSelected = selectedPackage === valueKey;
        const displayPrice = priceTl ? priceTl : "—";
        const features = PACKAGE_FEATURES[kind]?.[speed] || [];
        const SpeedIcon = getSpeedIcon(speed);

        return (
          <label
            key={valueKey}
            className="group relative cursor-pointer shrink-0 w-[85vw] sm:w-[320px] lg:w-auto snap-center"
          >
            <Field
              type="radio"
              name="selectedPackage"
              value={valueKey}
              className="peer sr-only"
            />
            
            {/* Main Interactive Card */}
            <div
              className={`relative flex flex-col h-full rounded-3xl border-2 bg-white/70 backdrop-blur-xl transition-all duration-500 ease-out transform group-hover:-translate-y-2 group-hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] overflow-hidden
              ${
                isSelected
                  ? `${palette.activeBorder} ${palette.activeRing} ring-4 ${palette.activeBg} shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]`
                  : "border-transparent shadow-lg hover:border-gray-200"
              }`}
            >
              {/* Giant Shadow Icon */}
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
                    isSelected ? palette.badgeBg + " text-white shadow-xl shadow-" + theme + "-500/30" : palette.iconBg
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

              {/* Hero Numbers (Speed) */}
              <div className="px-6 py-4 relative z-10 text-right">
                <div className="flex items-baseline justify-end gap-2 mb-1">
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">ميغابت/ثانية</span>
                  <span className={`text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r ${palette.textGradient}`}>
                    {speed}
                  </span>
                </div>
                
                <div className="flex items-end justify-end mt-5 gap-1.5">
                  <span className="text-sm text-gray-500 font-bold mb-1.5">شهر / TL</span>
                  <span className={`text-4xl font-extrabold tracking-tight ${isSelected ? palette.priceText : "text-gray-900"}`}>
                    {displayPrice}
                  </span>
                </div>
              </div>

              {/* Seamless Divider */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-70 my-2" />

              {/* Premium Features List */}
              <div className="px-6 pb-8 pt-5 relative z-10 flex-1 flex flex-col justify-end">
                <ul className="space-y-3.5">
                  {features.map((feature, i) => (
                    <li key={i} className="flex items-start justify-end gap-3 text-right group/item">
                      <span className={`text-sm font-semibold leading-relaxed transition-colors duration-300 ${isSelected ? 'text-gray-800' : 'text-gray-600 group-hover/item:text-gray-900'}`}>
                        {feature}
                      </span>
                      <MdCheckCircle className={`shrink-0 text-xl mt-0.5 transition-colors duration-300 ${isSelected ? palette.check : 'text-gray-300 group-hover/item:text-gray-400'}`} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </label>
        );
      })}
    </div>
  );
};

export default PackageSpeedGrid;
