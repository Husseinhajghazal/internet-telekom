"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUsers,
  FaGlobeAmericas,
} from "react-icons/fa";

const highlights = [
  { icon: FaCalendarAlt, label: "تأسست عام", value: "01/05/2015" },
  { icon: FaMapMarkerAlt, label: "المقر الرئيسي", value: "إسطنبول" },
  { icon: FaGlobeAmericas, label: "التغطية", value: "كامل تركيا" },
  { icon: FaUsers, label: "المدير العام", value: "أ. مهند التاجر" },
];

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [playVideo, setPlayVideo] = useState(false);

  return (
    <section
      id="about"
      className="py-20 md:py-28 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #f8fbff 0%, #eef5fb 50%, #f0f7fc 100%)",
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

      <div ref={ref} className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* left - visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative">
              {/* main logo card */}
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

              {/* floating stats cards */}
              <div className="absolute -top-6 -left-4 bg-white rounded-2xl p-4 shadow-lg shadow-black/[0.06] border border-gray-100 animate-float-icon">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#18a2e3]/10 flex items-center justify-center">
                    <FaUsers size={16} className="text-[#18a2e3]" />
                  </div>
                  <div>
                    <div className="text-lg font-black text-gray-900">+50K</div>
                    <div className="text-xs text-gray-400">عميل سعيد</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-4 bg-white rounded-2xl p-4 shadow-lg shadow-black/[0.06] border border-gray-100 animate-float-icon" style={{ animationDelay: "1s" }}>
                <div className="flex items-center gap-3">
                  <div>
                    <Image
                      src="/full-logo.png"
                      alt="إنترنت تيليكوم"
                      width={150}
                      height={75}
                      className="object-contain"
                      priority
                    />
                  </div>
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
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#18a2e3]/10 text-[#18a2e3] text-sm font-semibold mb-4">
              من نحن
            </span>

            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
              أولى الشركات العربية
              <br />
              <span className="mt-2 bg-gradient-to-l from-[#18a2e3] to-[#5898b7] bg-clip-text text-transparent">
                لخدمات الإنترنت في تركيا
              </span>
            </h2>

            <div className="space-y-4 text-gray-500 leading-relaxed text-[15px] mb-8">
              <p>
                تأسست إنترنت تيليكوم في عام 2015 لتكون الجسر الموثوق والآمن الذي يربطكم إرثٌ من الثقة والريادة.. نُسخره لخدمتكم المنزلي في تركيا. على مدار أكثر من عقد من الزمان، نجحنا في ترسيخ مكانتنا كشركة معتمدة تقدم حلولاً متكاملة تجمع بين الجودة والسعر المنافس.
              </p>
              <p>
                يتمركز مقرنا الرئيسي في مدينة إسطنبول، ومنها انطلقنا لنوسع نطاق خدماتنا حتى شملت فروعنا كافة الولايات التركية، لضمان وصول الإنترنت عالي السرعة لكل بيت بجودة واحترافية لا تُضاهى.
              </p>
              <p>
                نحن لا نقدم مجرد اشتراك إنترنت، بل نوفر تجربة مستخدم متكاملة تبدأ من الاستشارة المجانية والتركيب السريع، وصولاً إلى خيارات تعاقد مرنة مع دعم فني واستشاري متواصل باللغة العربية على مدار الساعة.
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
                  className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100 shadow-sm"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#18a2e3]/10 flex items-center justify-center flex-shrink-0">
                    <item.icon size={14} className="text-[#18a2e3]" />
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
