"use client";

import React from "react";
import { Field } from "formik";
import { motion, AnimatePresence } from "framer-motion";
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
  onClick,
}) => {
  const sizeClass = size === "large" ? "h-60 md:h-64" : "h-44";
  const gapClass = size === "large" ? "gap-4" : "gap-3";

  const colorClasses = {
    red: {
      selected: "border-red-500 bg-red-50 ring-4 ring-red-500/20 shadow-red-500/10",
      hover: "hover:border-red-300 hover:shadow-xl",
      icon: "text-red-500",
      check: "bg-red-500 border-red-500",
      glow: "from-red-500/20 to-transparent",
    },
    green: {
      selected: "border-green-500 bg-green-50 ring-4 ring-green-500/20 shadow-green-500/10",
      hover: "hover:border-green-300 hover:shadow-xl",
      icon: "text-green-500",
      check: "bg-green-500 border-green-500",
      glow: "from-green-500/20 to-transparent",
    },
    blue: {
      selected: "border-blue-500 bg-blue-50 ring-4 ring-blue-500/20 shadow-blue-500/10",
      hover: "hover:border-blue-300 hover:shadow-xl",
      icon: "text-blue-500",
      check: "bg-blue-500 border-blue-500",
      glow: "from-blue-500/20 to-transparent",
    },
    purple: {
      selected: "border-purple-500 bg-purple-50 ring-4 ring-purple-500/20 shadow-purple-500/10",
      hover: "hover:border-purple-300 hover:shadow-xl",
      icon: "text-purple-500",
      check: "bg-purple-500 border-purple-500",
      glow: "from-purple-500/20 to-transparent",
    },
    orange: {
      selected: "border-orange-500 bg-orange-50 ring-4 ring-orange-500/20 shadow-orange-500/10",
      hover: "hover:border-orange-300 hover:shadow-xl",
      icon: "text-orange-500",
      check: "bg-orange-500 border-orange-500",
      glow: "from-orange-500/20 to-transparent",
    },
    indigo: {
      selected: "border-indigo-500 bg-indigo-50 ring-4 ring-indigo-500/20 shadow-indigo-500/10",
      hover: "hover:border-indigo-300 hover:shadow-xl",
      icon: "text-indigo-500",
      check: "bg-indigo-500 border-indigo-500",
      glow: "from-indigo-500/20 to-transparent",
    },
  };

  const cls = colorClasses[color];

  return (
    <label className={`cursor-pointer group block w-full ${className}`} onClick={onClick}>
      <motion.div
        layout
        initial={false}
        animate={{
          scale: selected ? 1.02 : 1,
          y: selected ? -4 : 0,
        }}
        whileHover={{ scale: selected ? 1.03 : 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={`relative overflow-hidden ${sizeClass} rounded-3xl border-2 flex flex-col items-center justify-center ${gapClass} p-6 transition-colors duration-300 ${
          selected
            ? `${cls.selected} shadow-[0_15px_40px_-10px_rgba(0,0,0,0.1)]`
            : `border-gray-200 bg-white shadow-sm ring-0 ${cls.hover}`
        }`}
      >
        {/* Fancy Glow Background inside card */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className={`absolute inset-0 bg-gradient-to-tr ${cls.glow} pointer-events-none`}
            />
          )}
        </AnimatePresence>

        {/* Animated Checkmark Bubble */}
        <motion.div
          initial={false}
          animate={{
            scale: selected ? 1 : 0.8,
            opacity: selected ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 25, delay: 0.05 }}
          className={`absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center border-2 transition-colors duration-300 z-20 ${
            selected ? cls.check : "border-transparent"
          }`}
        >
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>

        {/* Placeholder circle when not selected */}
        <div
          className={`absolute top-4 right-4 w-7 h-7 rounded-full border-2 transition-all duration-300 z-10 ${
            selected ? "opacity-0 scale-50" : "border-gray-200 group-hover:border-gray-300"
          }`}
        />

        {/* Animated Icon */}
        <motion.div
          initial={false}
          animate={{ scale: selected ? 1.08 : 1, y: selected ? -4 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className={`text-5xl ${cls.icon} relative z-10`}
        >
          {typeof Icon == "string" ? (
            <LottieAnimation
              path={Icon}
              width={100}
              height={100}
              className="inline-block drop-shadow-md"
            />
          ) : (
            <Icon size={60} />
          )}
        </motion.div>

        {/* Text Details */}
        <span
          className={`${titleSize} font-bold tracking-tight transform transition-colors duration-300 ${
            selected ? "text-gray-900" : "text-gray-700 group-hover:text-gray-900"
          } ${centerTitle ? "text-center" : ""} relative z-10`}
        >
          {title}
        </span>

        <p
          className={`${descriptionSize} font-medium relative z-10 transition-colors duration-300 ${
            selected ? "text-gray-600" : "text-gray-400 group-hover:text-gray-500"
          } text-center max-w-[90%]`}
        >
          {description}
        </p>
      </motion.div>
      <Field type="radio" name={name} value={value} className="hidden" />
    </label>
  );
};

export default Card;
