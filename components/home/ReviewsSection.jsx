"use client";

import React, { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { FaStar, FaQuoteRight } from "react-icons/fa";

const reviews = [
  {
    name: "أحمد المحمد",
    rating: 5,
    comment:
      "خدمة ممتازة وسريعة! تم تركيب الإنترنت خلال يومين فقط. الدعم الفني بالعربية ساعدني كثيراً في اختيار الباقة المناسبة.",
    service: "تقديم على إنترنت فايبر",
  },
  {
    name: "سارة العلي",
    rating: 5,
    comment:
      "أفضل شركة تعاملت معها في تركيا. نقلت خطي لعنوان جديد بكل سلاسة وبدون أي مشاكل. شكراً لفريق الدعم المتميز!",
    service: "نقل خط لعنوان آخر",
  },
  {
    name: "محمد الحسن",
    rating: 4,
    comment:
      "سرعة الإنترنت ممتازة والأسعار مناسبة جداً. أنصح الجميع بالتعامل معهم. الباقة بدون عقد أعطتني مرونة كبيرة.",
    service: "اشتراك بدون عقد - Fiber",
  },
  {
    name: "فاطمة الزهراء",
    rating: 5,
    comment:
      "استشارة مجانية ساعدتني أختار الباقة الصح. الفريق متعاون جداً وصبور في الشرح. تجربة رائعة من البداية للنهاية.",
    service: "استشارة مجانية",
  },
  {
    name: "عبدالله كريم",
    rating: 5,
    comment:
      "جمّدت اشتراكي لمدة شهرين بسبب السفر وتم إعادة التفعيل فوراً عند عودتي. خدمة محترمة وتواصل سهل بالعربية.",
    service: "تجميد خط الإنترنت",
  },
  {
    name: "نور الهدى",
    rating: 4,
    comment:
      "GigaFiber سرعة خيالية! ألعاب أونلاين وبث مباشر بدون أي تقطيع. سعيدة جداً بالخدمة والسعر مقارنة بالشركات الأخرى.",
    service: "اشتراك بدون عقد - GigaFiber",
  },
  {
    name: "خالد الراشد",
    rating: 5,
    comment:
      "نقلت ملكية الخط من صديقي لاسمي بكل سهولة. الإجراءات كانت بسيطة والفريق تابع معي خطوة بخطوة حتى اكتمل كل شيء.",
    service: "نقل ملكية خط الإنترنت",
  },
  {
    name: "ريم الأحمد",
    rating: 5,
    comment:
      "أكثر شيء أعجبني هو الشفافية في الأسعار. لا رسوم مخفية ولا مفاجآت بالفاتورة. تجربة ممتازة وأنصح فيها الجميع.",
    service: "اشتراك بدون عقد - VDSL",
  },
];

/* ── single review card ── */
const ReviewCard = ({ review }) => (
  <div style={{ flexShrink: 0, width: 380 }}>
    <div className="relative h-full bg-white rounded-2xl border border-gray-100 p-6 hover:border-[#18a2e3]/15 hover:shadow-xl hover:shadow-black/[0.04] transition-all duration-500">
      {/* quote icon */}
      <div className="absolute top-5 left-5 text-[#18a2e3]/10">
        <FaQuoteRight size={28} />
      </div>

      {/* stars */}
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, j) => (
          <FaStar
            key={j}
            size={14}
            className={
              j < review.rating ? "text-amber-400" : "text-gray-200"
            }
          />
        ))}
      </div>

      {/* comment */}
      <p className="text-gray-600 text-sm leading-relaxed mb-6 min-h-[80px]">
        {review.comment}
      </p>

      {/* divider */}
      <div className="w-full h-px bg-gray-100 mb-4" />

      {/* user info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-bl from-[#18a2e3] to-[#5898b7] flex items-center justify-center text-white font-bold text-sm">
          {review.name.charAt(0)}
        </div>
        <div>
          <div className="text-sm font-bold text-gray-900">
            {review.name}
          </div>
          <div className="text-xs text-gray-400">{review.service}</div>
        </div>
      </div>
    </div>
  </div>
);

/* ── Scrolling row component ── */
const ScrollRow = ({ items, direction = "right", speed = 40 }) => {
  const trackRef = useRef(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    // Calculate the width of one set of items
    const totalChildren = el.children.length;
    const halfCount = totalChildren / 2;
    let singleSetWidth = 0;
    for (let i = 0; i < halfCount; i++) {
      singleSetWidth += el.children[i].offsetWidth + 24; // 24px = gap
    }

    // Create the keyframes dynamically (reversed for RTL)
    const name = `scroll-${direction}-${Date.now()}`;
    const fromX = direction === "right" ? singleSetWidth : 0;
    const toX = direction === "right" ? 0 : singleSetWidth;

    const styleEl = document.createElement("style");
    styleEl.textContent = `
      @keyframes ${name} {
        from { transform: translateX(${fromX}px); }
        to { transform: translateX(${toX}px); }
      }
    `;
    document.head.appendChild(styleEl);

    el.style.animation = `${name} ${speed}s linear infinite`;

    return () => {
      document.head.removeChild(styleEl);
    };
  }, [direction, speed]);

  return (
    <div style={{ overflow: "hidden", position: "relative" }}>
      {/* fade edges */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 100,
          background: "linear-gradient(to left, white, transparent)",
          zIndex: 10,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 100,
          background: "linear-gradient(to right, white, transparent)",
          zIndex: 10,
          pointerEvents: "none",
        }}
      />

      <div
        ref={trackRef}
        style={{
          display: "flex",
          gap: 24,
          width: "max-content",
          willChange: "transform",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.animationPlayState = "paused";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.animationPlayState = "running";
        }}
      >
        {items.map((review, i) => (
          <ReviewCard key={`set1-${i}`} review={review} />
        ))}
        {items.map((review, i) => (
          <ReviewCard key={`set2-${i}`} review={review} />
        ))}
      </div>
    </div>
  );
};

const ReviewsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const reversedReviews = [...reviews].reverse();

  return (
    <section
      id="reviews"
      className="py-20 md:py-28 bg-white relative overflow-hidden"
    >
      {/* bg */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#18a2e3]/[0.03] rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#5898b7]/[0.03] rounded-full blur-[120px]" />

      {/* animated glow orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.14, 0.08] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        className="absolute z-[1] top-1/3 left-20 w-[350px] h-[350px] bg-[#ffb245] rounded-full blur-[150px]"
      />
      <motion.div
        animate={{ scale: [1.15, 1, 1.15], opacity: [0.06, 0.12, 0.06] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute z-[1] bottom-1/4 right-10 w-[300px] h-[300px] bg-[#18a2e3] rounded-full blur-[130px]"
      />

      {/* big background icon */}
      <div className="absolute z-[1] top-1/2 right-20 -translate-y-1/2 pointer-events-none">
        <FaQuoteRight className="w-[350px] h-[350px] text-[#18a2e3]/[0.05]" />
      </div>

      <div ref={ref} className="relative z-10">
        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 px-4"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-[#18a2e3] text-sm font-semibold mb-4">
            آراء عملائنا
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
            ماذا يقول{" "}
            <span className="bg-gradient-to-l from-[#18a2e3] to-[#5898b7] bg-clip-text text-transparent">
              عملاؤنا عنّا
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            ثقة آلاف العملاء هي أعظم شهادة على جودة خدماتنا
          </p>
        </motion.div>

        {/* ── infinite scroll rows ── */}
        <div className="space-y-6">
          <ScrollRow items={reviews} direction="right" speed={40} />
          <ScrollRow items={reversedReviews} direction="left" speed={45} />
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
