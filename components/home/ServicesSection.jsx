"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  FaWifi,
  FaTools,
  FaComments,
  FaArrowLeft,
  FaHeadset,
  FaServer,
  FaCog,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";

const services = [
  {
    icon: FaWifi,
    title: "تقديم على إنترنت",
    description:
      "احصل على خط إنترنت جديد بسرعات تصل حتى 1000 ميجابت. خيارات مرنة بعقد أو بدون عقد مع أفضل الأسعار وتركيب خلال 48 ساعة.",
    color: "#f36802",
    bgLight: "rgba(243,104,2,0.08)",
    link: "/internet-basvuru-formu",
    linkText: "قدّم الآن",
  },
  {
    icon: FaTools,
    title: "خدمات تقنية",
    description:
      "نقل الخط، تجميد الاشتراك، تغيير الملكية، تجديد العقد، وحل كافة المشكلات الفنية. فريقنا المتخصص جاهز لمساعدتك.",
    color: "#5898b7",
    bgLight: "rgba(88,152,183,0.08)",
    link: "/start",
    linkText: "اطلب الخدمة",
  },
  {
    icon: FaComments,
    title: "استشارات",
    description:
      "استشارة مجانية حول أفضل باقة تناسب احتياجاتك، فحص البنية التحتية في منطقتك، ومقارنة العروض المتاحة مع دعم كامل بالعربية.",
    color: "#ffb245",
    bgLight: "rgba(255,178,69,0.08)",
    link: "/inquiry",
    linkText: "استشرنا مجاناً",
  },
];

/* ── floating background icons ── */
const floatingIcons = [
  { Icon: FaHeadset, size: 28, top: "12%", right: "8%", delay: 0, duration: 20 },
  { Icon: FaServer, size: 24, top: "65%", right: "88%", delay: 2, duration: 18 },
  { Icon: FaCog, size: 22, top: "25%", right: "55%", delay: 4, duration: 22 },
  { Icon: FaEnvelope, size: 26, top: "70%", right: "15%", delay: 1, duration: 16 },
  { Icon: FaPhoneAlt, size: 20, top: "40%", right: "75%", delay: 3, duration: 24 },
];

const ServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" className="py-20 md:py-28 bg-white relative overflow-hidden">
      {/* subtle bg decoration */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#18a2e3]/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#5898b7]/5 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3" />

      {/* ── floating icons ── */}
      {floatingIcons.map((item, i) => (
        <motion.div
          key={i}
          className="absolute z-[2] pointer-events-none"
          style={{
            top: item.top,
            right: item.right,
            color: "rgba(88,152,183,0.12)",
          }}
          animate={{
            y: [0, -20, 0, 15, 0],
            x: [0, 12, 0, -8, 0],
            rotate: [0, 8, 0, -8, 0],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            delay: item.delay,
            ease: "easeInOut",
          }}
        >
          <item.Icon size={item.size} />
        </motion.div>
      ))}

      <div ref={ref} className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {/* section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#18a2e3]/10 text-[#18a2e3] text-sm font-semibold mb-4">
            خدماتنا
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
            الخدمات التي{" "}
            <span className="bg-gradient-to-l from-[#18a2e3] to-[#5898b7] bg-clip-text text-transparent">
              نقدمها لكم
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            حلول متكاملة تغطي جميع احتياجاتكم من خدمات الإنترنت في تركيا
          </p>
        </motion.div>

        {/* cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 * i }}
            >
              <div className="group relative h-full bg-white rounded-3xl border border-gray-100 p-8 hover:border-transparent hover:shadow-2xl hover:shadow-black/[0.06] transition-all duration-500 overflow-hidden">
                {/* hover gradient bg */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
                  style={{
                    background: `linear-gradient(135deg, ${service.bgLight}, transparent 60%)`,
                  }}
                />

                {/* top accent line */}
                <div
                  className="absolute top-0 right-8 left-8 h-[3px] rounded-b-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                  style={{ backgroundColor: service.color }}
                />

                <div className="relative z-10">
                  {/* icon */}
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: service.bgLight }}
                  >
                    <service.icon
                      size={28}
                      style={{ color: service.color }}
                    />
                  </div>

                  {/* title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {service.title}
                  </h3>

                  {/* description */}
                  <p className="text-gray-500 leading-relaxed mb-6 text-sm">
                    {service.description}
                  </p>

                  {/* link */}
                  <Link
                    href={service.link}
                    className="inline-flex items-center gap-2 font-semibold text-sm transition-all duration-300 group-hover:gap-3"
                    style={{ color: service.color }}
                  >
                    {service.linkText}
                    <FaArrowLeft className="text-xs" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
