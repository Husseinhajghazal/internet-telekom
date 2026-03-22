"use client";

import React from "react";
import { Field } from "formik";
import { MdSpeed } from "react-icons/md";

const palettes = {
  purple: {
    selectedCard:
      "border-purple-500 bg-linear-to-br from-purple-50 to-purple-100 shadow-purple-200",
    hoverCard:
      "border-gray-200 bg-white hover:border-purple-300 hover:shadow-purple-100",
    blobTop: "bg-purple-500",
    blobBottom: "bg-purple-400",
    selectedDot: "bg-purple-500 border-purple-500 shadow-lg",
    hoverDot: "border-gray-300 group-hover:border-purple-400",
    selectedIconBox: "bg-purple-500 shadow-lg",
    hoverIconBox: "bg-purple-100 group-hover:bg-purple-200",
    icon: "text-purple-600",
    overlay: "bg-linear-to-t from-purple-500/10 to-transparent",
  },
  blue: {
    selectedCard:
      "border-blue-500 bg-linear-to-br from-blue-50 to-blue-100 shadow-blue-200",
    hoverCard: "border-gray-200 bg-white hover:border-blue-300 hover:shadow-blue-100",
    blobTop: "bg-blue-500",
    blobBottom: "bg-blue-400",
    selectedDot: "bg-blue-500 border-blue-500 shadow-lg",
    hoverDot: "border-gray-300 group-hover:border-blue-400",
    selectedIconBox: "bg-blue-500 shadow-lg",
    hoverIconBox: "bg-blue-100 group-hover:bg-blue-200",
    icon: "text-blue-600",
    overlay: "bg-linear-to-t from-blue-500/10 to-transparent",
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

  return (
    <div className="flex md:grid flex-nowrap md:grid-cols-2 lg:grid-cols-4 overflow-x-auto md:overflow-x-visible gap-6 snap-x snap-mandatory pb-2">
      {speeds.map((speed) => {
        const valueKey = duration ? `${kind}-${duration}-${speed}` : `${kind}-${speed}`;

        return (
          <label
            key={valueKey}
            className="cursor-pointer group transform transition-all duration-300 hover:scale-105 shrink-0 w-64 md:w-auto snap-center"
          >
            <div
              className={`relative overflow-hidden rounded-3xl border-2 transition-all duration-500 shadow-xl hover:shadow-2xl ${
                selectedPackage === valueKey ? palette.selectedCard : palette.hoverCard
              }`}
            >
              <div className="absolute inset-0 opacity-5">
                <div
                  className={`absolute top-0 right-0 w-32 h-32 ${palette.blobTop} rounded-full -translate-y-16 translate-x-16`}
                ></div>
                <div
                  className={`absolute bottom-0 left-0 w-24 h-24 ${palette.blobBottom} rounded-full translate-y-12 -translate-x-12`}
                ></div>
              </div>

              <div
                className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                  selectedPackage === valueKey ? palette.selectedDot : palette.hoverDot
                }`}
              >
                {selectedPackage === valueKey && (
                  <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold animate-pulse">
                    ✓
                  </div>
                )}
              </div>

              <div className="relative p-6 text-center space-y-4">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${
                    selectedPackage === valueKey
                      ? palette.selectedIconBox
                      : palette.hoverIconBox
                  } transition-all duration-300`}
                >
                  <MdSpeed
                    className={`text-2xl ${
                      selectedPackage === valueKey ? "text-white" : palette.icon
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <div className="text-3xl font-bold text-gray-800">{speed}</div>
                  <div className="text-sm text-gray-600 font-medium">ميغابت/ثانية</div>
                </div>
              </div>

              <div
                className={`absolute inset-0 ${palette.overlay} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl`}
              ></div>
            </div>
            <Field type="radio" name="selectedPackage" value={valueKey} className="hidden" />
          </label>
        );
      })}
    </div>
  );
};

export default PackageSpeedGrid;
