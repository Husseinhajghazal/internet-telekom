"use client";

import React from "react";
import { motion } from "framer-motion";
import FlippingCard from "./FlippingCard";

const noContractPackages = [
  {
    value: "vdsl",
    title: "VDSL",
    speed: "100",
    price: 949,
    popular: false,
    features: [
      "توفير 1370  ليرة أجور التركيب",
      "الفاتورة حقيقية وثابتة",
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
    price: 949,
    popular: true,
    features: [
      "توفير 1370  ليرة أجور التركيب",
      "الفاتورة حقيقية وثابتة",
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
    price: 949,
    popular: false,
    features: [
      "توفير 1370  ليرة أجور التركيب",
      "الفاتورة حقيقية وثابتة",
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
  backGradient: "bg-linear-to-br from-purple-600 to-fuchsia-600",
  priceText: "text-purple-700",
};

const NoContractCards = () => (
  <div className="flex md:grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto overflow-x-auto overflow-y-hidden md:overflow-visible pt-3 pb-6 md:pt-0 md:pb-0 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
    {noContractPackages.map((pkg, i) => (
      <motion.div
        key={pkg.value}
        className="flex-shrink-0 w-[75vw] md:w-[85vw] max-w-[320px] md:w-auto md:max-w-none snap-center"
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
