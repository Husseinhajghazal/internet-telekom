"use client";

import React from "react";
import { MdRefresh } from "react-icons/md";
import PackageSpeedGrid from "./PackageSpeedGrid";
import LottieAnimation from "./LottieAnimation";

const PackageSection = ({
  accent = "blue",
  title,
  description,
  durations,
  selectedDuration,
  onDurationChange,
  speeds,
  packageKind,
  selectedPackage,
}) => {
  const isGreen = accent === "green";
  const ringClass = isGreen
    ? "from-green-400 to-green-600"
    : "from-blue-400 to-blue-600";
  const titleClass = isGreen ? "text-green-600" : "text-blue-600";
  const iconClass = isGreen ? "text-green-500" : "text-blue-500";
  const dividerClass = isGreen
    ? "from-green-400 to-green-600"
    : "from-blue-400 to-blue-600";
  const switcherBorderClass = isGreen ? "border-green-200/70" : "border-blue-200/70";
  const selectedButtonClass = isGreen
    ? "bg-linear-to-r from-green-500 to-green-400 text-white shadow-green-200/70"
    : "bg-linear-to-r from-blue-500 to-cyan-400 text-white shadow-blue-200/70";
  const idleButtonClass = isGreen
    ? "text-green-800 hover:bg-green-50/70"
    : "text-blue-800 hover:bg-blue-50/70";

  return (
    <section className="relative overflow-hidden">
      <div
        className={`absolute -top-16 left-1/2 h-40 w-80 -translate-x-1/2 bg-linear-to-br ${ringClass} opacity-10 blur-3xl pointer-events-none`}
        aria-hidden="true"
      />

      <div className="relative py-6 md:py-8 space-y-7 md:space-y-8">
        <div className="text-center space-y-4">
          {
            packageKind === 'family' ? (
              <LottieAnimation
                path="/animations/Troubleshooting.json"
                width={250}
                height={150}
                className="inline-block"
                loop={true}
              />
            ) : (
              <LottieAnimation
              path="/animations/Businessman%20flies%20up%20with%20rocket.json"
              width={250}
              height={150}
              className="inline-block"
              loop={true}
            />
            )
          }
          <h3 className={`text-xl md:text-3xl font-bold ${titleClass}`}>{title}</h3>
          <p className="text-gray-600 md:text-lg max-w-2xl mx-auto">{description}</p>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <h4 className="text-lg md:text-2xl font-semibold text-gray-800 inline-flex items-center gap-2 justify-center">
              <MdRefresh className={iconClass} />
              عقد إشتراك
            </h4>
            <div
              className={`w-28 h-1 bg-linear-to-r ${dividerClass} mx-auto mt-2 rounded-full`}
            />
          </div>

          <div className="flex justify-center">
            <div
              className={`inline-flex rounded-2xl border ${switcherBorderClass} bg-white/70 shadow-sm p-1 gap-1.5`}
              role="group"
              aria-label="اختيار مدة العقد"
            >
              {durations.map((durationOption) => {
                const isSelected = selectedDuration === durationOption.value;
                return (
                  <button
                    key={durationOption.value}
                    type="button"
                    onClick={() => onDurationChange(durationOption.value)}
                    aria-pressed={isSelected}
                    className={`cursor-pointer px-4 py-2.5 md:px-6 md:py-3 rounded-xl text-sm md:text-lg font-bold transition-all duration-200 ${
                      isSelected ? selectedButtonClass : idleButtonClass
                    } ${isSelected ? "hover:opacity-95" : "border border-transparent"} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                      isGreen ? "focus-visible:ring-green-500/40 focus-visible:ring-offset-white" : "focus-visible:ring-blue-500/40 focus-visible:ring-offset-white"
                    }`}
                  >
                    {durationOption.label}
                  </button>
                );
              })}
            </div>
          </div>

          <PackageSpeedGrid
            kind={packageKind}
            duration={selectedDuration}
            speeds={speeds}
            theme={accent}
            selectedPackage={selectedPackage}
          />
        </div>
      </div>
    </section>
  );
};

export default PackageSection;
