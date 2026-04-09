"use client";

import React, { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import {
  FaFileContract,
  FaHeadset,
  FaRocket,
  FaShieldAlt,
  FaLanguage,
  FaMoneyBillWave,
  FaCogs,
  FaClock,
  FaWifi,
  FaGlobe,
  FaBolt,
  FaSatelliteDish,
} from "react-icons/fa";

const features = [
  {
    icon: FaFileContract,
    title: "بدون عقود التزام",
    description: "حرية كاملة بدون غرامات فسخ أو التزام بعقد سنوي",
    gradient: "from-[#f36802] to-[#ffb245]",
  },
  {
    icon: FaRocket,
    title: "سرعات فائقة",
    description: "سرعات تصل حتى 1000 ميجابت عبر تقنية الألياف الضوئية",
    gradient: "from-[#5898b7] to-[#3a7a9d]",
  },
  {
    icon: FaHeadset,
    title: "دعم فني 24/7",
    description: "فريق متخصص جاهز لمساعدتك في أي وقت على مدار الساعة",
    gradient: "from-[#0e7bac] to-[#18a2e3]",
  },
  {
    icon: FaLanguage,
    title: "دعم بالعربية",
    description: "تواصل مع فريقنا بلغتك العربية بكل سهولة وراحة",
    gradient: "from-[#18a2e3] to-[#5898b7]",
  },
  {
    icon: FaMoneyBillWave,
    title: "أسعار منافسة",
    description: "باقات تبدأ من 699 ليرة مع شفافية كاملة بدون رسوم خفية",
    gradient: "from-[#ffb245] to-[#f36802]",
  },
  {
    icon: FaClock,
    title: "تركيب سريع",
    description: "تركيب وتفعيل الخدمة خلال 48 ساعة فقط من تاريخ التسجيل",
    gradient: "from-[#f36802] to-[#e8890a]",
  },
  {
    icon: FaShieldAlt,
    title: "موثوقية عالية",
    description: "شركة معتمدة منذ 2015 مع آلاف العملاء الراضين",
    gradient: "from-[#0e7bac] to-[#5898b7]",
  },
  {
    icon: FaCogs,
    title: "خدمات شاملة",
    description: "نقل، تجميد، تغيير ملكية وكافة الخدمات اللوجستية بسلاسة",
    gradient: "from-[#18a2e3] to-[#3a7a9d]",
  },
];

/* ── floating background icons ── */
const floatingIcons = [
  { Icon: FaWifi, size: 26, top: "15%", right: "10%", delay: 0, duration: 18 },
  { Icon: FaGlobe, size: 32, top: "60%", right: "85%", delay: 2, duration: 22 },
  { Icon: FaShieldAlt, size: 20, top: "30%", right: "50%", delay: 4, duration: 20 },
  { Icon: FaBolt, size: 24, top: "75%", right: "20%", delay: 1, duration: 16 },
  { Icon: FaSatelliteDish, size: 28, top: "45%", right: "70%", delay: 3, duration: 24 },
  { Icon: FaRocket, size: 22, top: "20%", right: "35%", delay: 5, duration: 19 },
];

/* ── single feature card ── */
const FeatureCard = ({ feature }) => (
  <div style={{ flexShrink: 0, width: 280 }}>
    <div className="group relative h-full bg-white rounded-2xl p-6 border border-gray-100/80 hover:border-transparent hover:shadow-xl hover:shadow-black/[0.05] transition-all duration-500 overflow-hidden">
      {/* background shadow icon - left side */}
      <div className="absolute -left-10 -bottom-4 pointer-events-none transform rotate-12 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 z-0">
        <feature.icon className="w-36 h-36 text-gray-100/80" />
      </div>

      {/* hover top glow */}
      <div
        className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-bl ${feature.gradient} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500`}
      />

      <div className="relative z-10">
        {/* icon */}
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-bl ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}
        >
          <feature.icon size={20} className="text-white" />
        </div>

        {/* text */}
        <h3 className="text-base font-bold text-gray-900 mb-2">
          {feature.title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed">
          {feature.description}
        </p>
      </div>
    </div>
  </div>
);

/* ── scrolling row ── */
const ScrollRow = ({ items, speed = 35 }) => {
  const trackRef = useRef(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const totalChildren = el.children.length;
    const halfCount = totalChildren / 2;
    let singleSetWidth = 0;
    for (let i = 0; i < halfCount; i++) {
      singleSetWidth += el.children[i].offsetWidth + 24;
    }

    const name = `features-scroll-${Date.now()}`;
    const styleEl = document.createElement("style");
    styleEl.textContent = `
      @keyframes ${name} {
        from { transform: translateX(${singleSetWidth}px); }
        to { transform: translateX(0px); }
      }
    `;
    document.head.appendChild(styleEl);
    el.style.animation = `${name} ${speed}s linear infinite`;

    return () => {
      document.head.removeChild(styleEl);
    };
  }, [speed]);

  return (
    <div style={{ overflow: "hidden", position: "relative" }}>
      {/* fade edges */}
      <div
        style={{
          position: "absolute", right: 0, top: 0, bottom: 0, width: 100,
          background: "linear-gradient(to left, #eef5fb, transparent)",
          zIndex: 10, pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: 100,
          background: "linear-gradient(to right, #eef5fb, transparent)",
          zIndex: 10, pointerEvents: "none",
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
        {items.map((feature, i) => (
          <FeatureCard key={`set1-${i}`} feature={feature} />
        ))}
        {items.map((feature, i) => (
          <FeatureCard key={`set2-${i}`} feature={feature} />
        ))}
      </div>
    </div>
  );
};

const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="features"
      className="py-20 md:py-28 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #f8fbff 0%, #eef5fb 50%, #f0f7fc 100%)",
      }}
    >
      {/* animated glow orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.15, 0.08] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute z-[1] top-1/3 right-10 w-[350px] h-[350px] bg-[#18a2e3] rounded-full blur-[140px]"
      />
      <motion.div
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.06, 0.12, 0.06] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute z-[1] bottom-10 left-20 w-[300px] h-[300px] bg-[#ffb245] rounded-full blur-[130px]"
      />

      {/* big background icon */}
      <div className="absolute z-[1] top-1/2 right-10 -translate-y-1/2 pointer-events-none">
        <FaShieldAlt className="w-[350px] h-[350px] text-[#18a2e3]/[0.05]" />
      </div>
      {/* ── floating icons ── */}
      {floatingIcons.map((item, i) => (
        <motion.div
          key={i}
          className="absolute z-[2] pointer-events-none"
          style={{
            top: item.top,
            right: item.right,
            color: "rgba(24,162,227,0.12)",
          }}
          animate={{
            y: [0, -25, 0, 20, 0],
            x: [0, 15, 0, -10, 0],
            rotate: [0, 10, 0, -10, 0],
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

      <div ref={ref} className="relative z-10">
        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 px-4"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#f36802]/10 text-[#f36802] text-sm font-semibold mb-4">
            لماذا نحن؟
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
            ميزات تجعلنا{" "}
            <span className="bg-gradient-to-l from-[#18a2e3] to-[#5898b7] bg-clip-text text-transparent">
              الخيار الأفضل
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            نقدم لكم تجربة إنترنت فريدة تجمع بين الجودة والمرونة والسعر المنافس
          </p>
        </motion.div>

        {/* infinite scroll row */}
        <ScrollRow items={features} speed={35} />
      </div>
    </section>
  );
};

export default FeaturesSection;
