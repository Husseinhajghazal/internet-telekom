"use client";

import React, { useRef, useEffect } from "react";
import { FaCrown, FaGem, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import FlippingCard from "./FlippingCard";

function InfiniteScrollRow({ speeds, group }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.scrollLeft = el.scrollWidth / 3;

    const onScroll = () => {
      const third = el.scrollWidth / 3;
      if (el.scrollLeft < 10) el.scrollLeft += third;
      else if (el.scrollLeft > third * 2 - 10) el.scrollLeft -= third;
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scroll = (dir) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  const tripled = [...speeds, ...speeds, ...speeds];

  return (
    <div className="relative">
      {/* left arrow */}
      <button
        onClick={() => scroll(-1)}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-30 -translate-x-1 w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-md border border-gray-100 text-gray-600 hover:text-gray-900 hover:shadow-lg transition-all"
        aria-label="السابق"
      >
        <FaChevronLeft size={14} />
      </button>

      <div
        ref={ref}
        dir="ltr"
        className="flex gap-5 overflow-x-auto pb-4 px-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {tripled.map((item, i) => (
          <div key={i} dir="rtl" className="shrink-0 w-65">
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
          </div>
        ))}
      </div>

      {/* right arrow */}
      <button
        onClick={() => scroll(1)}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-30 translate-x-1 w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-md border border-gray-100 text-gray-600 hover:text-gray-900 hover:shadow-lg transition-all"
        aria-label="التالي"
      >
        <FaChevronRight size={14} />
      </button>
    </div>
  );
}

const contractPackages = [
  {
    category: "باقات الإنترنت العائلي والاقتصادي",
    subtitle: "البنية التحتية لجوك تيليكوم",
    icon: FaCrown,
    iconBg: "bg-emerald-100 text-emerald-600",
    badgeBg: "bg-emerald-500",
    textGradient: "from-emerald-600 to-teal-500",
    backGradient: "bg-linear-to-br from-emerald-600 to-teal-600",
    priceText: "text-emerald-700",
    speeds: [
      {
        speed: "16",
        price: "625",
        duration: "18 شهر",
        features: [
          "الفاتورة حقيقية وثابتة",
          "التحميل غير محدود",
          "التسجيل مجاني تماماً",
          "التركيب خلال 48 ساعة",
          "راوتر بتقنية الجيل الخامس",
        ],
      },
      {
        speed: "24",
        price: "650",
        duration: "18 شهر",
        features: [
          "الفاتورة حقيقية وثابتة",
          "التحميل غير محدود",
          "التسجيل مجاني تماماً",
          "التركيب خلال 48 ساعة",
          "راوتر بتقنية الجيل الخامس",
        ],
      },
      {
        speed: "50",
        price: "675",
        duration: "18 شهر",
        features: [
          "الفاتورة حقيقية وثابتة",
          "التحميل غير محدود",
          "التسجيل مجاني تماماً",
          "التركيب خلال 48 ساعة",
          "راوتر بتقنية الجيل الخامس",
        ],
      },
      {
        speed: "100",
        price: "700",
        duration: "18 شهر",
        features: [
          "الفاتورة حقيقية وثابتة",
          "التحميل غير محدود",
          "التسجيل مجاني تماماً",
          "التركيب خلال 48 ساعة",
          "راوتر بتقنية الجيل الخامس",
        ],
      },
      {
        speed: "16",
        price: "675",
        duration: "24 شهر",
        features: [
          "الفاتورة حقيقية وثابتة",
          "التحميل غير محدود",
          "التسجيل مجاني تماماً",
          "التركيب خلال 48 ساعة",
          "راوتر بتقنية الجيل الخامس",
        ],
      },
      {
        speed: "24",
        price: "700",
        duration: "24 شهر",
        features: [
          "الفاتورة حقيقية وثابتة",
          "التحميل غير محدود",
          "التسجيل مجاني تماماً",
          "التركيب خلال 48 ساعة",
          "راوتر بتقنية الجيل الخامس",
        ],
      },
      {
        speed: "50",
        price: "725",
        duration: "24 شهر",
        features: [
          "الفاتورة حقيقية وثابتة",
          "التحميل غير محدود",
          "التسجيل مجاني تماماً",
          "التركيب خلال 48 ساعة",
          "راوتر بتقنية الجيل الخامس",
        ],
      },
      {
        speed: "100",
        price: "750",
        duration: "24 شهر",
        features: [
          "الفاتورة حقيقية وثابتة",
          "التحميل غير محدود",
          "التسجيل مجاني تماماً",
          "التركيب خلال 48 ساعة",
          "راوتر بتقنية الجيل الخامس",
        ],
      },
    ],
  },
  {
    category: "باقات الإنترنت الأقوى والأسرع",
    subtitle: "البنية التحتية لترك تيليكوم",
    icon: FaGem,
    iconBg: "bg-blue-100 text-blue-600",
    badgeBg: "bg-blue-500",
    textGradient: "from-blue-600 to-cyan-500",
    backGradient: "bg-linear-to-br from-blue-600 to-cyan-600",
    priceText: "text-blue-700",
    speeds: [
      {
        speed: "16",
        price: "710",
        duration: "12 شهر",
        features: [
          "الفاتورة حقيقية وثابتة",
          "التحميل غير محدود",
          "التسجيل مجاني تماماً",
          "التركيب خلال 48 ساعة",
          "راوتر بتقنية الجيل السادس",
        ],
      },
      {
        speed: "24",
        price: "710",
        duration: "12 شهر",
        features: [
          "الفاتورة حقيقية وثابتة",
          "التحميل غير محدود",
          "التسجيل مجاني تماماً",
          "التركيب خلال 48 ساعة",
          "راوتر بتقنية الجيل السادس",
        ],
      },
      {
        speed: "50",
        price: "760",
        duration: "12 شهر",
        features: [
          "الفاتورة حقيقية وثابتة",
          "التحميل غير محدود",
          "التسجيل مجاني تماماً",
          "التركيب خلال 48 ساعة",
          "راوتر بتقنية الجيل السادس",
        ],
      },
      {
        speed: "100",
        price: "760",
        duration: "12 شهر",
        features: [
          "الفاتورة حقيقية وثابتة",
          "التحميل غير محدود",
          "التسجيل مجاني تماماً",
          "التركيب خلال 48 ساعة",
          "راوتر بتقنية الجيل السادس",
        ],
      },
      {
        speed: "200",
        price: "810",
        duration: "12 شهر",
        features: [
          "الفاتورة حقيقية وثابتة",
          "التحميل غير محدود",
          "التسجيل مجاني تماماً",
          "التركيب خلال 48 ساعة",
          "راوتر بتقنية الجيل السادس",
        ],
      },
      {
        speed: "500",
        price: "910",
        duration: "12 شهر",
        features: [
          "الفاتورة حقيقية وثابتة",
          "التحميل غير محدود",
          "التسجيل مجاني تماماً",
          "التركيب خلال 48 ساعة",
          "راوتر بتقنية الجيل السادس",
        ],
      },
      {
        speed: "1000",
        price: "1010",
        duration: "12 شهر",
        features: [
          "الفاتورة حقيقية وثابتة",
          "التحميل غير محدود",
          "التسجيل مجاني تماماً",
          "التركيب خلال 48 ساعة",
          "راوتر بتقنية الجيل السادس",
        ],
      },
      {
        speed: "16",
        price: "700",
        duration: "18 شهر",
        features: [
          "الفاتورة حقيقية وثابتة",
          "التحميل غير محدود",
          "التسجيل مجاني تماماً",
          "التركيب خلال 48 ساعة",
          "راوتر بتقنية الجيل السادس",
        ],
      },
      {
        speed: "24",
        price: "700",
        duration: "12 شهر",
        features: [
          "الفاتورة حقيقية وثابتة",
          "التحميل غير محدود",
          "التسجيل مجاني تماماً",
          "التركيب خلال 48 ساعة",
          "راوتر بتقنية الجيل السادس",
        ],
      },
      {
        speed: "50",
        price: "750",
        duration: "12 شهر",
        features: [
          "الفاتورة حقيقية وثابتة",
          "التحميل غير محدود",
          "التسجيل مجاني تماماً",
          "التركيب خلال 48 ساعة",
          "راوتر بتقنية الجيل السادس",
        ],
      },
      {
        speed: "100",
        price: "750",
        duration: "12 شهر",
        features: [
          "الفاتورة حقيقية وثابتة",
          "التحميل غير محدود",
          "التسجيل مجاني تماماً",
          "التركيب خلال 48 ساعة",
          "راوتر بتقنية الجيل السادس",
        ],
      },
      {
        speed: "200",
        price: "800",
        duration: "12 شهر",
        features: [
          "الفاتورة حقيقية وثابتة",
          "التحميل غير محدود",
          "التسجيل مجاني تماماً",
          "التركيب خلال 48 ساعة",
          "راوتر بتقنية الجيل السادس",
        ],
      },
      {
        speed: "500",
        price: "900",
        duration: "12 شهر",
        features: [
          "الفاتورة حقيقية وثابتة",
          "التحميل غير محدود",
          "التسجيل مجاني تماماً",
          "التركيب خلال 48 ساعة",
          "راوتر بتقنية الجيل السادس",
        ],
      },
      {
        speed: "1000",
        price: "1000",
        duration: "12 شهر",
        features: [
          "الفاتورة حقيقية وثابتة",
          "التحميل غير محدود",
          "التسجيل مجاني تماماً",
          "التركيب خلال 48 ساعة",
          "راوتر بتقنية الجيل السادس",
        ],
      },
    ],
  },
];

const WithContractCards = () => (
  <div className="max-w-5xl mx-auto space-y-12">
    {contractPackages.map((group, gi) => (
      <div key={gi}>
        {/* section header */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className={`w-10 h-10 rounded-xl ${group.iconBg.split(" ")[0]} flex items-center justify-center`}
          >
            <group.icon size={18} className={group.iconBg.split(" ")[1]} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {group.category}
            </h3>
            <p className="text-sm text-gray-400">{group.subtitle}</p>
          </div>
        </div>

        <InfiniteScrollRow speeds={group.speeds} group={group} />
      </div>
    ))}
  </div>
);

export default WithContractCards;
