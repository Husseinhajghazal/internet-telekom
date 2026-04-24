"use client";

import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { FaGlobeAmericas } from "react-icons/fa";
import { HiCalendarDays, HiBuildingOffice2 } from "react-icons/hi2";
import { FaUserTie, FaYoutube } from "react-icons/fa";
import { SiTurkishairlines } from "react-icons/si";

const highlights = [
  { icon: HiCalendarDays, label: "تأسست عام", value: "01/05/2015" },
  { icon: HiBuildingOffice2, label: "المقر الرئيسي", value: "إسطنبول" },
  { icon: SiTurkishairlines, label: "التغطية", value: "كامل تركيا" },
  { icon: FaUserTie, label: "المدير العام", value: "أ. مهند التاجر" },
];

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [playVideo, setPlayVideo] = useState(false);

  return (
    <section
      id="about"
      className="py-12 md:py-20 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #f8fbff 0%, #eef5fb 50%, #f0f7fc 100%)",
      }}
    >
      {/* decorative */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[#18a2e3]/[0.04] rounded-full blur-[120px]" />
      <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-[#5898b7]/[0.04] rounded-full blur-[100px]" />

      {/* animated glow orbs */}
      <div className="absolute z-[1] top-1/4 right-1/4 w-[400px] h-[400px] bg-[#18a2e3] rounded-full blur-[150px] animate-glow-pulse opacity-10" />
      <div className="absolute z-[1] bottom-1/4 left-1/3 w-[350px] h-[350px] bg-[#f36802] rounded-full blur-[140px] animate-glow-pulse-alt opacity-10" />

      {/* big background icon */}
      <div className="absolute z-[1] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <FaGlobeAmericas className="w-[400px] h-[400px] text-[#18a2e3]/[0.05]" />
      </div>

      <div ref={ref} className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12 px-4"
        >
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
            من هي {" "}
            <span className="bg-gradient-to-l from-[#18a2e3] to-[#5898b7] bg-clip-text text-transparent">
              شركة إنترنت تيليكوم؟
            </span>
            <p className="text-gray-500 text-sm md:text-lg max-w-xl mx-auto mt-3 font-semibold">
              لماذا نحن الخيار الأفضل في تركيا؟
            </p>
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 px-4 md:px-8 items-center">
          {/* left - visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative">
              {/* main logo card */}
              <p className="flex items-center justify-center gap-2 text-lg font-semibold text-gray-700 mb-4">
                <FaYoutube className="text-2xl text-red-500" />
                شاهد الفيديو أدناه للمزيد من التفاصيل
              </p>
              <div className="bg-white rounded-3xl shadow-xl shadow-black/[0.04] border border-gray-100/80">
                <div className="relative w-full h-[300px] md:h-[350px]">
                  {!playVideo ? (
                    <div
                      className="absolute inset-0 bg-gray-200 rounded-3xl cursor-pointer group flex items-center justify-center overflow-hidden"
                      onClick={() => setPlayVideo(true)}
                    >
                      <img
                        src="https://img.youtube.com/vi/lyav1Uz9DVI/maxresdefault.jpg"
                        alt="تعرف علينا"
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="w-16 h-16 bg-[#18a2e3]/90 rounded-full flex items-center justify-center z-10 shadow-lg group-hover:scale-110 transition-all duration-300 group-hover:bg-[#f36802]">
                        <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[14px] border-l-white border-b-8 border-b-transparent ml-1" />
                      </div>
                    </div>
                  ) : (
                    <iframe
                      className="rounded-3xl w-full h-full"
                      src="https://www.youtube.com/embed/lyav1Uz9DVI?autoplay=1"
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* right - text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <div className="space-y-4 text-gray-500 leading-relaxed text-[15px] mb-8">
              <p>
                تأسست شركة إنترنت تيليكوم عام 2015، وهي من أولى الشركات الرائدة في تقديم خدمات الإنترنت المنزلي للجالية العربية في تركيا. نعمل على توفير اتصال مستقر وسريع يلبّي احتياجات الأفراد والعائلات، مع التركيز على الجودة والأسعار المناسبة.
              </p>
              <p>
                يقع مقرنا الرئيسي في إسطنبول، ومنها انطلقنا لتوسيع نطاق خدماتنا لتشمل كامل الولايات التركية، بهدف إيصال الإنترنت عالي السرعة إلى أكبر عدد ممكن من المشتركين بكفاءة وموثوقية.
              </p>
              <p>
                نحن نؤمن أن خدمة الإنترنت ليست مجرد اشتراك، بل تجربة متكاملة تبدأ من تقديم الإستشارة المجانية المناسبة، مرورًا بعملية التركيب السريعة، وصولًا إلى دعم فني مستمر باللغة العربية وخيارات تعاقد مرنة تناسب جميع احتياجات عملائنا.
              </p>
            </div>

            {/* info grid */}
            <div className="grid grid-cols-2 gap-4">
              {highlights.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + 0.1 * i }}
                  className="flex items-center gap-3 bg-[#f2f2f2] rounded-xl p-3 border border-gray-100 shadow-sm"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#18a2e3]/10 flex items-center justify-center flex-shrink-0">
                    <item.icon size={20} className="text-[#18a2e3]" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">{item.label}</div>
                    <div className="text-sm font-bold text-gray-900">
                      {item.value}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
