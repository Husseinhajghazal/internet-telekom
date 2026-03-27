"use client";

import React, { useState } from "react";
import { Field } from "formik";
import { MdSpeed, MdCheck } from "react-icons/md";

const palettes = {
  purple: {
    selectedCard: "border-purple-500/70 bg-linear-to-br from-purple-50/90 to-purple-100/60 shadow-xl shadow-purple-200/60",
    hoverCard: "border-gray-200/80 bg-white/70 hover:border-purple-300/70 hover:shadow-lg hover:shadow-purple-100/60",
    blobTop: "bg-purple-500/18",
    blobBottom: "bg-purple-400/18",
    selectedDot: "bg-purple-500 border-purple-500 shadow-lg shadow-purple-200/60",
    hoverDot: "border-gray-300 group-hover:border-purple-400/70",
    selectedIconBox: "bg-purple-500 shadow-lg shadow-purple-200/60",
    hoverIconBox: "bg-purple-100/70 group-hover:bg-purple-200/70",
    icon: "text-purple-700",
    overlay: "bg-linear-to-t from-purple-500/15 to-transparent",
    priceChip: "border-purple-100 bg-purple-50/70",
    priceText: "text-purple-900",
    focusRing: "peer-focus-visible:ring-purple-500/40",
    backGradient: "from-purple-600 to-purple-500",
    backAccent: "bg-purple-400/30",
    featureIcon: "text-purple-200",
  },
  blue: {
    selectedCard: "border-blue-500/70 bg-linear-to-br from-blue-50/90 to-cyan-50/70 shadow-xl shadow-blue-200/60",
    hoverCard: "border-gray-200/80 bg-white/70 hover:border-blue-300/70 hover:shadow-lg hover:shadow-blue-100/60",
    blobTop: "bg-blue-500/18",
    blobBottom: "bg-blue-400/18",
    selectedDot: "bg-blue-500 border-blue-500 shadow-lg shadow-blue-200/60",
    hoverDot: "border-gray-300 group-hover:border-blue-400/70",
    selectedIconBox: "bg-blue-500 shadow-lg shadow-blue-200/60",
    hoverIconBox: "bg-blue-100/70 group-hover:bg-cyan-100/70",
    icon: "text-blue-700",
    overlay: "bg-linear-to-t from-blue-500/15 to-transparent",
    priceChip: "border-blue-100 bg-blue-50/70",
    priceText: "text-blue-900",
    focusRing: "peer-focus-visible:ring-blue-500/40",
    backGradient: "from-blue-600 to-cyan-500",
    backAccent: "bg-blue-400/30",
    featureIcon: "text-blue-200",
  },
  green: {
    selectedCard: "border-emerald-500/70 bg-linear-to-br from-emerald-50/90 to-teal-50/70 shadow-xl shadow-emerald-200/60",
    hoverCard: "border-gray-200/80 bg-white/70 hover:border-emerald-300/70 hover:shadow-lg hover:shadow-emerald-100/60",
    blobTop: "bg-emerald-500/18",
    blobBottom: "bg-emerald-400/18",
    selectedDot: "bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-200/60",
    hoverDot: "border-gray-300 group-hover:border-emerald-400/70",
    selectedIconBox: "bg-emerald-500 shadow-lg shadow-emerald-200/60",
    hoverIconBox: "bg-emerald-100/70 group-hover:bg-teal-100/70",
    icon: "text-emerald-700",
    overlay: "bg-linear-to-t from-emerald-500/15 to-transparent",
    priceChip: "border-emerald-100 bg-emerald-50/70",
    priceText: "text-emerald-900",
    focusRing: "peer-focus-visible:ring-emerald-500/40",
    backGradient: "from-emerald-600 to-teal-500",
    backAccent: "bg-emerald-400/30",
    featureIcon: "text-emerald-200",
  }
};

const TechTypeGrid = ({
  options,
  selectedTechType,
}) => {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div className="flex md:grid flex-nowrap md:grid-cols-3 overflow-x-auto md:overflow-x-visible gap-6 snap-x snap-mandatory pb-2 md:max-w-4xl mx-auto">
      {options.map((opt) => {
        const valueKey = opt.value;
        const isSelected = selectedTechType === valueKey;
        const isFlipped = isSelected || hoveredCard === valueKey;
        const palette = palettes[opt.color] || palettes.blue;

        return (
          <label
            key={valueKey}
            className="cursor-pointer group shrink-0 w-64 md:w-auto snap-center perspective-card"
            onMouseEnter={() => setHoveredCard(valueKey)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <Field
              type="radio"
              name="noContractTechType"
              value={valueKey}
              className="peer sr-only"
            />

            {/* Card container — fixed height for stable flip */}
            <div
              className={`relative h-72 rounded-3xl ${palette.focusRing} peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white`}
            >
              <div className={`flip-card-inner ${isFlipped ? "flipped" : ""}`}>
                {/* ─── FRONT FACE ─── */}
                <div
                  className={`flip-card-front rounded-3xl border-2 overflow-hidden transition-all duration-500 ${
                    isSelected ? palette.selectedCard : palette.hoverCard
                  }`}
                >
                  <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className={`absolute top-0 right-0 w-32 h-32 ${palette.blobTop} rounded-full -translate-y-16 translate-x-16 blur-2xl`} />
                    <div className={`absolute bottom-0 left-0 w-24 h-24 ${palette.blobBottom} rounded-full translate-y-12 -translate-x-12 blur-2xl`} />
                  </div>

                  <div
                    className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                      isSelected ? palette.selectedDot : palette.hoverDot
                    }`}
                  >
                    {isSelected && (
                      <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold">
                        ✓
                      </div>
                    )}
                  </div>

                  <div className="relative p-6 h-full flex flex-col items-center justify-center text-center space-y-3">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${
                        isSelected ? palette.selectedIconBox : palette.hoverIconBox
                      } transition-all duration-300`}
                    >
                      <MdSpeed
                        className={`text-2xl ${
                          isSelected ? "text-white" : palette.icon
                        }`}
                      />
                    </div>

                    <div className="space-y-1.5 text-center">
                      <div className="text-3xl font-extrabold tracking-tight text-gray-900 leading-none">
                        {opt.title}
                      </div>
                      <div className="text-sm text-gray-600 font-bold pb-1.5">{opt.speed} ميغابت/ثانية</div>
                      <div className={`inline-flex items-baseline justify-center gap-1.5 rounded-xl border px-3 py-1 shadow-xs ${palette.priceChip}`}>
                        <span className={`text-base font-extrabold tracking-tight ${palette.priceText}`}>{opt.price}</span>
                        <span className={`text-[10px] font-bold ${palette.priceText}`}>TL</span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      مرر لمعرفة التفاصيل ←
                    </div>
                  </div>

                  <div
                    className={`absolute inset-0 ${palette.overlay} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none`}
                  />
                </div>

                {/* ─── BACK FACE ─── */}
                <div
                  className={`flip-card-back rounded-3xl border-2 overflow-hidden ${
                    isSelected
                      ? "border-white/40 shadow-xl"
                      : "border-white/20"
                  } bg-linear-to-br ${palette.backGradient}`}
                >
                  <div className="absolute inset-0 pointer-events-none">
                    <div className={`absolute -top-10 -right-10 w-40 h-40 ${palette.backAccent} rounded-full blur-3xl`} />
                    <div className={`absolute -bottom-10 -left-10 w-32 h-32 ${palette.backAccent} rounded-full blur-3xl`} />
                  </div>

                  {isSelected && (
                    <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-white/30 flex items-center justify-center">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                  )}

                  <div className="relative p-5 h-full flex flex-col justify-between text-white">
                    <div className="text-center">
                      <div className="text-2xl font-extrabold tracking-tight">
                        {opt.title}
                      </div>
                      <div className="text-xl font-bold mt-1">
                        {opt.speed} <span className="text-xs opacity-80">Mbps</span>
                      </div>
                    </div>

                    <div className="space-y-2.5 my-3">
                      {opt.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-2 text-right">
                          <MdCheck className={`shrink-0 mt-0.5 text-lg ${palette.featureIcon}`} />
                          <span className="text-sm font-medium leading-snug opacity-95">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="text-center">
                      <div className="inline-flex items-baseline gap-1.5 bg-white/20 backdrop-blur-sm rounded-2xl px-5 py-2.5 shadow-sm">
                        <span className="text-2xl font-extrabold">
                          {opt.price}
                        </span>
                        <span className="text-sm font-bold opacity-90">TL</span>
                      </div>
                    </div>
                  </div>
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
