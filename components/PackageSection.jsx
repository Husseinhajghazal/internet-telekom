"use client";

import React from "react";
import { MdRefresh, MdWifi } from "react-icons/md";
import PackageSpeedGrid from "./PackageSpeedGrid";

const PackageSection = ({
  accent = "blue",
  title,
  description,
  durationLabel,
  durations,
  selectedDuration,
  onDurationChange,
  speeds,
  packageKind,
  selectedPackage,
}) => {
  const isPurple = accent === "purple";
  const ringClass = isPurple
    ? "from-purple-400 to-purple-600"
    : "from-blue-400 to-blue-600";
  const titleClass = isPurple ? "text-purple-600" : "text-blue-600";
  const iconClass = isPurple ? "text-purple-500" : "text-blue-500";
  const dividerClass = isPurple
    ? "from-purple-400 to-purple-600"
    : "from-blue-400 to-blue-600";
  const switcherBorderClass = isPurple ? "border-purple-200" : "border-blue-200";
  const selectedButtonClass = isPurple ? "bg-purple-500 text-white shadow" : "bg-blue-500 text-white shadow";
  const idleButtonClass = isPurple
    ? "text-purple-700 hover:bg-purple-50"
    : "text-blue-700 hover:bg-blue-50";

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div
          className={`inline-flex items-center justify-center w-16 h-16 bg-linear-to-br ${ringClass} rounded-full shadow-lg`}
        >
          <MdWifi className="text-white text-2xl" />
        </div>
        <h3 className={`text-xl md:text-3xl font-bold ${titleClass}`}>{title}</h3>
        <p className="text-gray-600 md:text-lg max-w-2xl mx-auto">{description}</p>
      </div>

      <div className="space-y-6">
        <div className="text-center">
          <h4 className="text-lg md:text-2xl font-semibold text-gray-700 inline-flex items-center gap-2">
            <MdRefresh className={iconClass} />
            عقد اشتراك مدة {durationLabel}
          </h4>
          <div
            className={`w-24 h-1 bg-linear-to-r ${dividerClass} mx-auto mt-2 rounded-full`}
          ></div>
        </div>

        <div className="flex justify-center">
          <div
            className={`inline-flex rounded-2xl border ${switcherBorderClass} bg-white shadow-sm p-1.5 gap-1.5`}
          >
            {durations.map((durationOption) => (
              <button
                key={durationOption.value}
                type="button"
                onClick={() => onDurationChange(durationOption.value)}
                className={`cursor-pointer px-6 py-3 rounded-xl text-base md:text-lg font-bold transition-all duration-200 ${
                  selectedDuration === durationOption.value
                    ? selectedButtonClass
                    : idleButtonClass
                }`}
              >
                {durationOption.label}
              </button>
            ))}
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
  );
};

export default PackageSection;
