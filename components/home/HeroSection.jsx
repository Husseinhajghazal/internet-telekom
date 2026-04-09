"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaWifi,
  FaRocket,
  FaArrowLeft,
  FaGlobe,
  FaShieldAlt,
  FaHeadset,
  FaBolt,
  FaSatelliteDish,
  FaNetworkWired,
  FaSignal,
} from "react-icons/fa";

/* ── floating icons data ── */
const floatingIcons = [
  { Icon: FaWifi, size: 28, top: "12%", right: "8%", delay: 0, duration: 18 },
  { Icon: FaGlobe, size: 34, top: "25%", right: "85%", delay: 2, duration: 22 },
  { Icon: FaShieldAlt, size: 22, top: "60%", right: "12%", delay: 4, duration: 20 },
  { Icon: FaBolt, size: 26, top: "75%", right: "78%", delay: 1, duration: 16 },
  { Icon: FaSatelliteDish, size: 30, top: "40%", right: "92%", delay: 3, duration: 24 },
  { Icon: FaNetworkWired, size: 24, top: "85%", right: "45%", delay: 5, duration: 19 },
  { Icon: FaSignal, size: 20, top: "18%", right: "55%", delay: 2.5, duration: 21 },
  { Icon: FaHeadset, size: 26, top: "50%", right: "25%", delay: 1.5, duration: 17 },
  { Icon: FaWifi, size: 18, top: "35%", right: "70%", delay: 3.5, duration: 23 },
  { Icon: FaRocket, size: 22, top: "68%", right: "55%", delay: 4.5, duration: 15 },
];

/* ── stat counter items ── */
const stats = [
  { value: "+10", label: "سنوات من الخبرة", suffix: "" },
  { value: "+50", label: "ألف عميل سعيد", suffix: "K" },
  { value: "81", label: "ولاية مغطاة", suffix: "" },
  { value: "24/7", label: "دعم فني بالعربية", suffix: "" },
];
/* ── typewriter phrases ── */
const typewriterPhrases = [
  "بدون عقود التزام",
  "باقات تبدأ من 699 ليرة",
  "دعم فني باللغة العربية",
  "تركيب الخدمة خلال يومين",
];

const TypewriterText = () => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = typewriterPhrases[phraseIndex];

    if (!isDeleting && charIndex === currentPhrase.length) {
      // Pause at full phrase, then start deleting
      const timeout = setTimeout(() => setIsDeleting(true), 2000);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && charIndex === 0) {
      // Move to next phrase
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % typewriterPhrases.length);
      return;
    }

    const speed = isDeleting ? 40 : 80;
    const timeout = setTimeout(() => {
      setCharIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, speed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, phraseIndex]);

  const displayText = typewriterPhrases[phraseIndex].slice(0, charIndex);

  return (
    <>
      {displayText}
      <span className="animate-pulse">|</span>
    </>
  );
};

const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* ── background layers ── */}
      <div className="absolute inset-0">
        {/* main gradient */}
        <div className="absolute inset-0 bg-gradient-to-bl from-[#050d1a] via-[#0c2240] to-[#0f3a6e]" />

        {/* animated mesh */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 600px 400px at 20% 50%, rgba(24,162,227,0.25), transparent),
              radial-gradient(ellipse 500px 500px at 80% 30%, rgba(88,152,183,0.2), transparent),
              radial-gradient(ellipse 400px 300px at 60% 80%, rgba(24,162,227,0.15), transparent),
              radial-gradient(ellipse 350px 250px at 90% 70%, rgba(243,104,2,0.1), transparent)
            `,
          }}
        />

        {/* grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* glow orb top-right */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#18a2e3]/20 blur-[120px]"
        />
        {/* glow orb bottom-left */}
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#5898b7]/20 blur-[140px]"
        />
      </div>

      {/* ── floating icons ── */}
      {floatingIcons.map((item, i) => (
        <motion.div
          key={i}
          className="absolute text-white/[0.12] pointer-events-none z-[2]"
          style={{ top: item.top, right: item.right }}
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

      {/* ── content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full pt-24 pb-12">
        <div className="flex flex-col items-center text-center">
          {/* badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[#ffb245] animate-pulse" />
            <span className="text-white/80 text-sm font-medium">
              منذ 2015 نقدم خدماتنا للعرب في تركيا
            </span>
          </motion.div>

          {/* main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-tight max-w-4xl mb-6"
          >
            إنترنت فائق السرعة
            <br />
            <span className="bg-gradient-to-l from-[#18a2e3] via-[#4db8e8] to-[#5898b7] bg-clip-text text-transparent">
              <TypewriterText />
            </span>
          </motion.h1>

          {/* subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-sm md:text-lg text-white/60 max-w-2xl leading-relaxed mb-10"
          >
            استمتع بأسرع إنترنت منزلي في تركيا مع حرية كاملة بدون عقود ملزمة.
            تسجيل مجاني، تحميل غير محدود، ودعم فني بالعربية على مدار الساعة
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center gap-4 mb-16 w-full md:w-fit"
          >
            <Link
              href="/internet-basvuru-formu"
              className="group relative w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-l from-[#f36802] to-[#ffb245] text-white font-bold text-lg shadow-xl shadow-[#f36802]/25 hover:shadow-2xl hover:shadow-[#f36802]/40 hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-l from-[#ffb245] to-[#f36802] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative">سجّل الآن</span>
              <FaArrowLeft className="relative text-sm transition-transform duration-300 group-hover:-translate-x-1" />
            </Link>

            <a
              href="#services"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full whitespace-nowrap inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 text-white font-bold text-lg hover:bg-white/20 hover:border-white/25 transition-all duration-300"
            >
              تعرّف على خدماتنا
            </a>
          </motion.div>

          {/* stats row */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 w-full max-w-3xl md:mb-10"
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-black text-white mb-1">
                  {stat.value}
                  <span className="text-[#ffb245]">{stat.suffix}</span>
                </div>
                <div className="text-white/50 text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── bottom wave ── */}
      <div className="absolute -bottom-1 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 60C240 120 480 0 720 60C960 120 1200 0 1440 60V120H0V60Z"
            fill="#f0f7fc"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
