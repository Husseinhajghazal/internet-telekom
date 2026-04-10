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
    service: "اشتراك بدون عقد - Fiber",
  },
];

const ReviewsSection = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const [reviews, setReviews] = React.useState(staticReviews);

  React.useEffect(() => {
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          setReviews(data);
        }
      })
      .catch((err) => console.log(err));
  }, []);

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
      <div
        className="absolute z-[1] top-1/3 left-20 w-[350px] h-[350px] bg-[#ffb245] rounded-full blur-[150px] animate-glow-pulse opacity-10"
      />
      <div
        className="absolute z-[1] bottom-1/4 right-10 w-[300px] h-[300px] bg-[#18a2e3] rounded-full blur-[130px] animate-glow-pulse-alt opacity-10"
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
          <p className="text-gray-500 md:text-lg max-w-xl mx-auto">
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
