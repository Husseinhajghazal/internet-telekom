"use client";

import React from "react";
import { Field } from "formik";
import { MdSpeed } from "react-icons/md";
import { PRICES_TL } from "@/utils/data";

const palettes = {
  purple: {
    selectedCard:
      "border-purple-500/70 bg-linear-to-br from-purple-50/90 to-purple-100/60 shadow-xl shadow-purple-200/60",
    hoverCard:
      "border-gray-200/80 bg-white/70 hover:border-purple-300/70 hover:shadow-lg hover:shadow-purple-100/60",
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
  },
  blue: {
    selectedCard:
      "border-blue-500/70 bg-linear-to-br from-blue-50/90 to-cyan-50/70 shadow-xl shadow-blue-200/60",
    hoverCard:
      "border-gray-200/80 bg-white/70 hover:border-blue-300/70 hover:shadow-lg hover:shadow-blue-100/60",
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
    const price =
      PRICES_TL?.[kind]?.[String(duration)]?.[String(speed)];
    return typeof price === "number" ? price : 0;
  };

  return (
    <div className="flex md:grid flex-nowrap md:grid-cols-2 lg:grid-cols-4 overflow-x-auto md:overflow-x-visible gap-6 snap-x snap-mandatory pb-2">
      {speeds.map((speed) => {
        const valueKey = duration ? `${kind}-${duration}-${speed}` : `${kind}-${speed}`;
        const priceTl = getStaticPriceTl(speed);
        const isSelected = selectedPackage === valueKey;
        const displayPrice = priceTl ? priceTl : "—";

        return (
          <label
            key={valueKey}
            className="cursor-pointer group shrink-0 w-64 md:w-auto snap-center motion-safe:transition motion-safe:hover:-translate-y-0.5"
          >
            <Field
              type="radio"
              name="selectedPackage"
              value={valueKey}
              className="peer sr-only"
            />

            <div
              className={`relative overflow-hidden rounded-3xl border-2 transition-all duration-500 ${
                isSelected ? palette.selectedCard : palette.hoverCard
              } ${palette.focusRing} peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white`}
            >
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div
                  className={`absolute top-0 right-0 w-32 h-32 ${palette.blobTop} rounded-full -translate-y-16 translate-x-16 blur-2xl`}
                ></div>
                <div
                  className={`absolute bottom-0 left-0 w-24 h-24 ${palette.blobBottom} rounded-full translate-y-12 -translate-x-12 blur-2xl`}
                ></div>
              </div>

              <div
                className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                  isSelected ? palette.selectedDot : palette.hoverDot
                }`}
              >
                {isSelected ? (
                  <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold animate-pulse">
                    ✓
                  </div>
                ) : null}
              </div>

              <div className="relative p-6 text-center space-y-3">
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

                <div className="space-y-1.5">
                  <div className="text-4xl font-extrabold tracking-tight text-gray-900">
                    {speed}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">ميغابت/ثانية</div>
                  <div
                    className={`mt-2 inline-flex items-baseline justify-center gap-2 rounded-2xl border px-4 py-2 shadow-sm ${palette.priceChip} ${
                      isSelected ? "shadow-md" : ""
                    }`}
                  >
                    <span
                      className={`text-lg font-extrabold tracking-tight ${palette.priceText}`}
                    >
                      {displayPrice}
                    </span>
                    <span className={`text-sm font-bold ${palette.priceText}`}>TL</span>
                  </div>
                </div>
              </div>

              <div
                className={`absolute inset-0 ${palette.overlay} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl`}
              ></div>
            </div>
          </label>
        );
      })}
    </div>
  );
};

export default PackageSpeedGrid;
