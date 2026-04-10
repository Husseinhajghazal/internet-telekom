"use client";

import React from "react";
import { motion } from "framer-motion";
import FlippingCard from "./FlippingCard";

const noContractPackages = [
  {
    value: "vdsl",
    title: "VDSL",
    speed: "100",
    price: 699,
    popular: false,
    features: [
      "التسجيل مجاني تماماً",
      "التحميل غير محدود",
      "التركيب خلال 48 ساعة",
      "الراوتر تقسيط مع الفاتورة",
    ],
  },
  {
    value: "fiber",
    title: "Fiber",
    speed: "100",
    price: 699,
    popular: true,
    features: [
      "التسجيل مجاني تماماً",
      "التحميل غير محدود",
      "التركيب خلال 48 ساعة",
      "الراوترات الفايبر مجاناً",
    ],
  },
  {
    value: "gigafiber",
    title: "GigaFiber",
    speed: "1000",
    price: 699,
    popular: false,
    features: [
      "التسجيل مجاني تماماً",
      "التحميل غير محدود",
      "التركيب خلال 48 ساعة",
      "الراوترات الفايبر مجاناً",
    ],
  },
];

const purplePalette = {
  iconBg: "bg-purple-100 text-purple-600",
  badgeBg: "bg-purple-500",
  textGradient: "from-purple-600 to-fuchsia-500",
  backGradient: "bg-gradient-to-br from-purple-600 to-fuchsia-600",
  priceText: "text-purple-700",
};

const NoContractCards = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
    {noContractPackages.map((pkg, i) => (
      <motion.div
        key={pkg.value}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 * i }}
      >
        <FlippingCard
          speed={pkg.speed}
          price={pkg.price}
          title={`${pkg.title} — بدون عقد`}
          features={pkg.features}
          palette={purplePalette}
          popular={pkg.popular}
        />
      </motion.div>
    ))}
  </div>
);

export default NoContractCards;
