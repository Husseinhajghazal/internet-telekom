import React from "react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import HeroBackground from "./HeroBackground";
import HeroTypewriter from "./HeroTypewriter";

/* ── stat counter items ── */
const stats = [
  { value: "+10", label: "سنوات من الخبرة", suffix: "" },
  { value: "+50", label: "ألف عميل سعيد", suffix: "K" },
  { value: "81", label: "ولاية مغطاة", suffix: "" },
  { value: "24/7", label: "دعم فني بالعربية", suffix: "" },
];

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
      </div>

      <HeroBackground />

      {/* ── content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full pt-28 pb-12">
        <div className="flex flex-col items-center text-center">
          {/* badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-8 mt-4 md:mt-0">
            <span className="w-2 h-2 rounded-full bg-[#ffb245] animate-pulse" />
            <span className="text-white/80 text-sm font-medium">
              منذ 2015 نقدم خدماتنا للعرب في تركيا
            </span>
          </div>

          {/* main heading */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-tight max-w-4xl mb-6">
            إنترنت فائق السرعة
            <br />
            <span className="bg-gradient-to-l from-[#18a2e3] via-[#4db8e8] to-[#5898b7] bg-clip-text text-transparent">
              <HeroTypewriter />
            </span>
          </h1>

          {/* subtitle */}
          <p className="text-sm md:text-lg text-white/60 max-w-2xl leading-relaxed mb-10">
            استمتع بأسرع إنترنت منزلي في تركيا مع حرية كاملة بدون عقود ملزمة.
            تسجيل مجاني، تحميل غير محدود، ودعم فني بالعربية على مدار الساعة
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 w-full md:w-fit">
            <Link
              href="/internet-basvuru-formu"
              className="group relative w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-l from-[#f36802] to-[#ffb245] text-white font-bold text-lg shadow-xl shadow-[#f36802]/25 hover:shadow-2xl hover:shadow-[#f36802]/40 hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-l from-[#ffb245] to-[#f36802] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative">سجّل الآن</span>
              <FaArrowLeft className="relative text-sm transition-transform duration-300 group-hover:-translate-x-1" />
            </Link>

            <Link
              href="#services"
              className="w-full whitespace-nowrap inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 text-white font-bold text-lg hover:bg-white/20 hover:border-white/25 transition-all duration-300"
            >
              تعرّف على خدماتنا
            </Link>
          </div>

          {/* stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 w-full max-w-3xl md:mb-10">
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
          </div>
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
