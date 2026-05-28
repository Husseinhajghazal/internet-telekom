"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FaQuoteRight } from "react-icons/fa";
import ScrollRow from "./ScrollRow";

const staticReviews = [
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
    service: "إشتراك بدون عقد - Fiber",
  },
];

const ReviewsSection = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const [reviews, setReviews] = React.useState(staticReviews);

  React.useEffect(() => {
    fetch("/api/reviews?limit=12&page=1")
      .then((res) => res.json())
      .then((data) => {
        if (data?.reviews?.length > 0) setReviews(data.reviews);
      })
      .catch(console.error);
  }, []);

  const reversedReviews = [...reviews].reverse();

  return (
    <section
      id="reviews"
      className="py-12 md:py-20 bg-white relative overflow-hidden"
    >
      {/* bg */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#18a2e3]/[0.03] rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#5898b7]/[0.03] rounded-full blur-[120px]" />

      {/* animated glow orbs */}
      <div className="absolute z-[1] top-1/3 left-20 w-[350px] h-[350px] bg-[#ffb245] rounded-full blur-[150px] animate-glow-pulse opacity-10" />
      <div className="absolute z-[1] bottom-1/4 right-10 w-[300px] h-[300px] bg-[#18a2e3] rounded-full blur-[130px] animate-glow-pulse-alt opacity-10" />

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
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
            ماذا يقول{" "}
            <span className="bg-gradient-to-l from-[#18a2e3] to-[#5898b7] bg-clip-text text-transparent">
              عملاؤنا عن شركتنا
            </span>
          </h2>
          <p className="text-gray-500 md:text-lg max-w-xl mx-auto">
            ثقة آلاف العملاء هي أعظم شهادة على جودة خدماتنا
          </p>
        </motion.div>

        {/* ── infinite scroll rows ── */}
        <div className="space-y-6">
          <ScrollRow items={reviews} direction="right" speed={40} />
          <ScrollRow items={reversedReviews} direction="left" speed={45} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center mt-10 px-4"
        >
          <a
            href="/reviews"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#18a2e3] border border-[#18a2e3]/30 px-6 py-2.5 rounded-2xl hover:bg-[#18a2e3]/5 hover:border-[#18a2e3]/60 transition"
          >
            عرض كل التقييمات
            <span className="text-base leading-none">←</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ReviewsSection;
