import React from "react";
import {
  FiUser,
  FiWifi,
  FiPackage,
  FiCheckCircle,
} from "react-icons/fi";
import { RiCustomerService2Fill } from "react-icons/ri";
import { RiContractFill } from "react-icons/ri";

const ProgressBar = ({ step }) => {
  const steps = [
    { id: 1, title: "البيانات الشخصية", icon: FiUser },
    { id: 2, title: "الإنترنت", icon: FiWifi },
    { id: 3, title: "نوع الخدمة", icon: RiCustomerService2Fill },
    { id: 4, title: "العقد/الإستشارة/الخدمة", icon: RiContractFill },
    { id: 5, title: "الباقة", icon: FiPackage },
    { id: 6, title: "التأكيد", icon: FiCheckCircle },
  ];

  // Clean percentage: (step-1)/(total-1) with no magic offsets
  const progressPercentage = ((step - 1) / (steps.length - 1)) * 100;

  return (
    <div className="px-4 md:px-8 py-8 md:py-10" dir="rtl">
      <div className="w-full">
        <div className="relative">
          {/* Background line — spans between the CENTER of the first and last circles */}
          <div
            className="absolute h-1 bg-gray-200 rounded-full"
            style={{
              top: "24px" /* half of 48px circle height */,
              right:
                "24px" /* half of 48px circle width — aligns to circle center */,
              left: "24px",
            }}
          />

          {/* Active progress line — fills from right (RTL) */}
          <div
            className="absolute h-1 rounded-full transition-all duration-500"
            style={{
              top: "24px",
              right: "24px",
              left: "24px",
              background: "linear-gradient(to left, #fb923c, #f59e0b)",
              // Scale the fill width relative to the track, from the right side
              clipPath: `inset(0 0 0 ${100 - progressPercentage}%)`,
            }}
          />

          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((stepItem) => {
              const isCompleted = step > stepItem.id;
              const isActive = step === stepItem.id;

              return (
                <div key={stepItem.id} className="flex flex-col items-center">
                  {/* Circle */}
                  <div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center
                      text-lg font-bold transition-all duration-300 relative z-10
                      ${
                        isCompleted
                          ? "bg-linear-to-br from-green-400 to-emerald-500 text-white shadow-lg shadow-green-400/40"
                          : isActive
                            ? "bg-linear-to-br from-orange-400 to-amber-400 text-white shadow-lg shadow-orange-400/40"
                            : "bg-gray-100 text-gray-400 border-2 border-gray-300"
                      }
                    `}
                  >
                    {isCompleted ? (
                      <span>✓</span>
                    ) : (
                      <stepItem.icon className="w-5 h-5" />
                    )}

                    {isActive && (
                      <div className="absolute inset-0 rounded-full bg-orange-400 blur-lg opacity-20" />
                    )}
                  </div>

                  {/* Label */}
                  <div className="mt-3 text-center hidden md:block">
                    <p
                      className={`text-xs font-semibold transition-all duration-300 ${
                        isActive
                          ? "text-orange-600"
                          : isCompleted
                            ? "text-green-600"
                            : "text-gray-400"
                      }`}
                    >
                      {stepItem.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      الخطوة {stepItem.id}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
