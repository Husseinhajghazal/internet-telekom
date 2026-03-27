"use client";

import React from "react";
import { Field } from "formik";
import LottieAnimation from "./LottieAnimation";

const Card = ({
  name,
  value,
  selected,
  icon: Icon,
  title,
  description,
  size = "large",
  color = "blue",
  titleSize = "text-2xl",
  descriptionSize = "text-sm",
  centerTitle = false,
  className = "",
}) => {
  const sizeClass = size === "large" ? "h-60 md:h-64" : "h-44";
  const gapClass = size === "large" ? "gap-4" : "gap-3";

  const colorClasses = {
    red: {
      selected: "border-red-500 bg-red-50",
      hover: "hover:border-red-300",
      icon: "text-red-500",
      check: "bg-red-500 border-red-500",
    },
    green: {
      selected: "border-green-500 bg-green-50",
      hover: "hover:border-green-300",
      icon: "text-green-500",
      check: "bg-green-500 border-green-500",
    },
    blue: {
      selected: "border-blue-500 bg-blue-50",
      hover: "hover:border-blue-300",
      icon: "text-blue-500",
      check: "bg-blue-500 border-blue-500",
    },
    purple: {
      selected: "border-purple-500 bg-purple-50",
      hover: "hover:border-purple-300",
      icon: "text-purple-500",
      check: "bg-purple-500 border-purple-500",
    },
    orange: {
      selected: "border-orange-500 bg-orange-50",
      hover: "hover:border-orange-300",
      icon: "text-orange-500",
      check: "bg-orange-500 border-orange-500",
    },
    indigo: {
      selected: "border-indigo-500 bg-indigo-50",
      hover: "hover:border-indigo-300",
      icon: "text-indigo-500",
      check: "bg-indigo-500 border-indigo-500",
    },
  };

  const cls = colorClasses[color];

  return (
    <label className={`cursor-pointer group  ${className}`}>
      <div
        className={`relative ${sizeClass} rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center ${gapClass} p-6 ${
          selected
            ? `${cls.selected} shadow-lg scale-105`
            : `border-gray-200 bg-white ${cls.hover} hover:shadow-md`
        }`}
      >
        <div
          className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 transition-all ${
            selected ? cls.check : "border-gray-300"
          }`}
        >
          {selected && (
            <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold">
              ✓
            </div>
          )}
        </div>

        <div className={`text-5xl ${cls.icon}`}>
          {typeof Icon == 'string' ?
          <LottieAnimation
            path={Icon}
            width={100}
            height={100}
            className="inline-block"
          />
          :
          <Icon size={60} />

        }
        </div>

        <span
          className={`${titleSize} font-bold text-gray-800 ${centerTitle ? "text-center" : ""}`}
        >
          {title}
        </span>

        <p className={`${descriptionSize} text-gray-600 text-center`}>
          {description}
        </p>
      </div>
      <Field type="radio" name={name} value={value} className="hidden" />
    </label>
  );
};

export default Card;
