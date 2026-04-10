"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaCrown, FaGem } from "react-icons/fa";
import FlippingCard from "./FlippingCard";

const contractPackages = [
  {
    category: "باقات الإنترنت العائلي والاقتصادي",
    subtitle: "البنية التحتية لجوك تيليكوم",
    icon: FaCrown,
    iconBg: "bg-emerald-100 text-emerald-600",
    badgeBg: "bg-emerald-500",
    textGradient: "from-emerald-600 to-teal-500",
    backGradient: "bg-gradient-to-br from-emerald-600 to-teal-600",
    priceText: "text-emerald-700",
    speeds: [
      { speed: "24", price: "650", duration: "18 شهر", features: ["الفاتورة حقيقية وثابتة", "التحميل غير محدود", "التسجيل مجاني تماماً", "التركيب خلال 48 ساعة", "راوتر بتقنية الجيل الخامس"] },
      { speed: "50", price: "675", duration: "18 شهر", features: ["الفاتورة حقيقية وثابتة", "التحميل غير محدود", "التسجيل مجاني تماماً", "التركيب خلال 48 ساعة", "راوتر بتقنية الجيل الخامس"] },
      { speed: "100", price: "700", duration: "18 شهر", features: ["الفاتورة حقيقية وثابتة", "التحميل غير محدود", "التسجيل مجاني تماماً", "التركيب خلال 48 ساعة", "راوتر بتقنية الجيل الخامس"] },
    ],
  },
  {
    category: "باقات الإنترنت الأقوى والأسرع",
    subtitle: "البنية التحتية لترك تيليكوم",
    icon: FaGem,
    iconBg: "bg-blue-100 text-blue-600",
    badgeBg: "bg-blue-500",
    textGradient: "from-blue-600 to-cyan-500",
    backGradient: "bg-gradient-to-br from-blue-600 to-cyan-600",
    priceText: "text-blue-700",
    speeds: [
      { speed: "200", price: "800", duration: "18 شهر", features: ["الفاتورة حقيقية وثابتة", "التحميل غير محدود", "التسجيل مجاني تماماً", "التركيب خلال 48 ساعة", "راوتر بتقنية الجيل السادس"] },
      { speed: "500", price: "900", duration: "18 شهر", features: ["الفاتورة حقيقية وثابتة", "التحميل غير محدود", "التسجيل مجاني تماماً", "التركيب خلال 48 ساعة", "راوتر بتقنية الجيل السادس"] },
      { speed: "1000", price: "1000", duration: "18 شهر", features: ["الفاتورة حقيقية وثابتة", "التحميل غير محدود", "التسجيل مجاني تماماً", "التركيب خلال 48 ساعة", "راوتر بتقنية الجيل السادس"] },
    ],
  },
];

const WithContractCards = () => (
  <div className="max-w-5xl mx-auto space-y-12">
    {contractPackages.map((group, gi) => (
      <div key={gi}>
        {/* section header */}
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-xl ${group.iconBg.split(" ")[0]} flex items-center justify-center`}>
            <group.icon size={18} className={group.iconBg.split(" ")[1]} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{group.category}</h3>
            <p className="text-sm text-gray-400">{group.subtitle}</p>
          </div>
        </div>

        {/* speed cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {group.speeds.map((item, i) => (
            <motion.div
              key={`${gi}-${item.speed}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * i }}
            >
              <FlippingCard
                speed={item.speed}
                price={item.price}
                title={`عقد ${item.duration}`}
                features={item.features}
                palette={{
                  iconBg: group.iconBg,
                  badgeBg: group.badgeBg,
                  textGradient: group.textGradient,
                  backGradient: group.backGradient,
                  priceText: group.priceText,
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    ))}

    {/* disclaimer */}
    <div className="bg-[#18a2e3]/5 rounded-2xl p-5 border border-[#18a2e3]/10 text-center">
      <p className="text-sm text-gray-600 leading-relaxed">
        الأسعار تختلف حسب مدة العقد والسرعة المختارة. تواصل معنا للحصول على أفضل عرض يناسب احتياجاتك مع استشارة مجانية.
      </p>
    </div>
  </div>
);

export default WithContractCards;
