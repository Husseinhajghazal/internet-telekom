"use client";

import React, { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FaCrown, FaGem, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaInfoCircle } from "react-icons/fa";
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
        price: "860",
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
        price: "860",
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
        speed: "100",
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
        speed: "200",
        price: "960",
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
        price: "1110",
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
        price: "1210",
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
        price: "800",
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
        price: "800",
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
        speed: "50",
        price: "850",
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
        speed: "100",
        price: "850",
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
        speed: "200",
        price: "1000",
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
        speed: "500",
        price: "1050",
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
        speed: "1000",
        price: "1150",
        duration: "18 شهر",
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

const ContractGroup = ({ group }) => {
  const durations = Array.from(
    new Set(group.speeds.map((s) => s.duration)),
  ).sort();
  const [selectedDuration, setSelectedDuration] = useState(durations[0]);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const filteredSpeeds = group.speeds.filter(
    (s) => s.duration === selectedDuration,
  );
  const isGreen = group.category.includes("العائلي");
  const switcherBorderClass = isGreen
    ? "border-emerald-200"
    : "border-blue-200";
  const selectedButtonClass = isGreen
    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
    : "bg-blue-500 text-white shadow-md shadow-blue-500/30";
  const idleButtonClass = "text-gray-600 hover:bg-black/5 hover:text-gray-900";
  const detailsButtonClass = isGreen
    ? "from-emerald-600 via-teal-500 to-emerald-600 shadow-emerald-500/30 hover:shadow-emerald-500/40 focus-visible:ring-emerald-400/60"
    : "from-blue-600 via-cyan-500 to-blue-600 shadow-blue-500/30 hover:shadow-blue-500/40 focus-visible:ring-blue-400/60";
  const detailsHeaderClass = isGreen
    ? "text-emerald-800 bg-emerald-50 border-emerald-100"
    : "text-blue-800 bg-blue-50 border-blue-100";
  const detailsTextClass = isGreen ? "text-emerald-900/80" : "text-blue-900/80";
  const detailsText = isGreen
    ? "الشركة الرائدة التي استطاعت منذ تأسيسها عام 2012 أن تثبت كفاءتها كواحدة من أسرع مزودي خدمات الإنترنت نمواً في تركيا. تتميز الشركة بتقديم حلول اقتصادية وذكية تناسب ميزانيات الجميع، مع التركيز العالي على خدمات الألياف الضوئية (Fiber) والإنترنت اللاسلكي عالي السرعة. تقدم الشركة باقات مرنة ومتنوعة تلبي احتياجات الاستخدام المنزلي والتجاري، وتعتمد في نجاحها على بنية تحتية قوية تضمن استقرار الإشارة وسهولة الإجراءات الفنية. ومن خلال شراكتنا معهم، نضمن لكم الوصول إلى أفضل عروض مع ميزة الدعم الفني المتكامل باللغة العربية، لتجربة اشتراك تجمع بين التوفير والجودة في كافة الولايات التركية."
    : "الشركة الأم والمشغل الوطني الأول والأكبر في تركيا، والذي يمتلك إرثاً عريقاً يمتد لأكثر من 180 عاماً. تتميز الشركة بامتلاكها لأضخم بنية تحتية للألياف الضوئية (Fiber) تغطي كافة الولايات والقرى التركية، مما يضمن لكم استقراراً فائقاً في الاتصال وتغطية لا تضاهى. تقدم حلولاً متكاملة تشمل الإنترنت المنزلي عالي السرعة، خدمات الهاتف المحمول، والقنوات التلفزيونية الرقمية، مع الالتزام بتطوير التكنولوجيا الرقمية لتناسب احتياجات العصر. ومن خلالنا، نسهل لكم الوصول إلى هذه الخدمات العالمية بمرونة تامة ودعم فني متخصص، لنضمن بقاءكم على اتصال دائم بأعلى معايير الجودة والكفاءة.";

  return (
    <div>
      {/* section header */}
      <div className="flex items-center gap-3 mb-8">
        <div
          className={`w-14 h-14 rounded-2xl ${group.iconBg.split(" ")[0]} flex items-center justify-center`}
        >
          <group.icon size={24} className={group.iconBg.split(" ")[1]} />
        </div>
        <div className="flex items-center flex-col gap-2">
          <h3 className="text-xl font-bold text-gray-900">{group.category}</h3>
          <div className="flex items-center gap-1">
            <p className="text-sm text-gray-400">{group.subtitle}</p>
            <button
              type="button"
              onClick={() => setIsDetailsOpen(true)}
              className={`group relative inline-flex items-center gap-1.5 overflow-hidden rounded-xl px-3 py-1.5 text-xs font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white bg-linear-to-r bg-[length:200%_100%] hover:bg-[position:100%_0] shrink-0 ${detailsButtonClass}`}
            >
              <span className="absolute inset-0 -z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-linear-to-r from-white/0 via-white/25 to-white/0 translate-x-[-120%] group-hover:translate-x-[120%]" />
              <FaInfoCircle className="relative z-10 h-3 w-3" />
              <span className="relative z-10">معلومات إضافية</span>
            </button>
          </div>
        </div>
      </div>

      {/* Switcher */}
      {durations.length > 1 && (
        <div className="flex justify-center mb-6">
          <div
            className={`inline-flex rounded-2xl border ${switcherBorderClass} bg-white/70 shadow-sm p-1 gap-1.5`}
            role="group"
          >
            {durations.map((durationOption) => {
              const isSelected = selectedDuration === durationOption;
              let displayLabel = durationOption;
              if (durationOption === "12 شهر") displayLabel = "سنة";
              if (durationOption === "24 شهر") displayLabel = "سنتين";

              return (
                <button
                  key={durationOption}
                  type="button"
                  onClick={() => setSelectedDuration(durationOption)}
                  className={`cursor-pointer px-4 py-2.5 md:px-6 md:py-3 rounded-xl text-sm md:text-lg font-bold transition-all duration-200 ${
                    isSelected ? selectedButtonClass : idleButtonClass
                  } border border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                    isGreen
                      ? "focus-visible:ring-emerald-500/40"
                      : "focus-visible:ring-blue-500/40"
                  }`}
                >
                  عقد {displayLabel}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Cards Scroll */}
      <div className="mt-4">
        <InfiniteScrollRow
          speeds={filteredSpeeds}
          group={group}
          key={selectedDuration}
        />
      </div>

      {isDetailsOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
            onClick={() => setIsDetailsOpen(false)}
          >
            <div
              className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border overflow-hidden"
              onClick={(event) => event.stopPropagation()}
            >
              <div
                className={`flex items-center justify-between px-5 py-4 border-b ${detailsHeaderClass}`}
              >
                <h4 className="text-lg font-extrabold flex items-center gap-2">
                  <FaInfoCircle className="w-4 h-4" />
                  التفاصيل والميزات
                </h4>
                <button
                  type="button"
                  onClick={() => setIsDetailsOpen(false)}
                  className="text-2xl leading-none hover:opacity-80"
                  aria-label="إغلاق"
                >
                  ×
                </button>
              </div>
              <div
                className={`p-5 text-justify leading-relaxed text-sm md:text-base ${detailsTextClass}`}
              >
                {detailsText}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

const WithContractCards = () => (
  <div className="max-w-5xl mx-auto space-y-12">
    {contractPackages.map((group, gi) => (
      <ContractGroup key={gi} group={group} />
    ))}
  </div>
);

export default WithContractCards;
