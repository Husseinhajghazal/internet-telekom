"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import HeroBackground from "./HeroBackground";
import TurkeyMap from "./TurkeyMap";

/* ── slide data ── */
const slides = [
  {
    image: "/man-113.png",
    title: "إنترنت فائق السرعة يصل إلى ",
    titleHighlight: "1000 ميغابت بالثانية",
    subtitle:
      "باقات متنوعة تناسب جميع الاحتياجات بأسعار منافسة وسرعات فائقة تضمن لك أفضل تجربة تصفح. كما نوفر لك دعماً تقنياً على مدار الساعة عبر فريق من الموظفين العرب.",
  },
  {
    image: "/man-201.png",
    title: "خدماتنا بين يديك دائماً ",
    titleHighlight: "على بعد ضغطة زر واحدة",
    subtitle:
      "تشمل خدماتنا إلغاء الإشتراك، نقل خدمة الإنترنت إلى عنوان جديد، تجميد الخط مؤقتاً، بالإضافة إلى إمكانية تحويل خطك القديم إلى بدون عقد بكل سهولة وسرعة.",
  },
  {
    image: "/man-202.png",
    title: "إنترنت بدون عقد! إشترك الآن ",
    titleHighlight: "وتمتع بحرية مُطلقة",
    subtitle:
      "استمتع بخدمة إنترنت بدون أي عقد أو التزامات طويلة الأمد. إشترك بسهولة وابدأ باستخدام الإنترنت فوراً، مع حرية كاملة في التحكم بإشتراكك وتغييره أو إلغائه مجاناً.",
  },
  {
    useMap: true,
    title: "خدماتنا ومراكزنا تغطي ",
    titleHighlight: "كامل المناطق التركية",
    subtitle:
      "بفضل بنيتنا التحتية القوية وشراكاتنا مع أكبر شركات الإنترنت في تركيا، نوفر لك تغطية شاملة في جميع المدن والمناطق التركية لنضمن لك اتصالاً مستقراً وسرعات عالية.",
  },
];

const SLIDE_INTERVAL = 6000;

const HeroSection = () => {
  const [active, setActive] = useState(0);

  /* ── auto-advance — resets on any slide change ── */
  useEffect(() => {
    const timer = setInterval(() => {
      setActive((p) => (p + 1) % slides.length);
    }, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [active]);

  /* ── smooth scroll to #services ── */
  const scrollToServices = useCallback((e) => {
    e.preventDefault();
    const el = document.getElementById("services");
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, []);

  return (
    <section
      id="hero"
      className="relative h-187.5 md:h-svh md:min-h-200 overflow-hidden"
    >
      {/* ── background layers ── */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-bl from-[#050d1a] via-[#0c2240] to-[#0f3a6e]" />
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

      {/* ── slides ── */}
      <div className="relative z-10 h-full flex items-center">
        {slides.map((slide, i) => {
          const isActive = i === active;
          return (
            <div
              key={i}
              aria-hidden={!isActive}
              className={`absolute inset-0 flex items-start md:items-center transition-opacity duration-700 ease-in-out ${
                isActive
                  ? "opacity-100 z-10"
                  : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col md:flex-row items-center gap-4 sm:gap-6 md:gap-10 lg:gap-16 pt-24 md:pt-0 pb-0 md:pb-20">
                {/* ── text side (first in DOM → RIGHT in RTL) ── */}
                <div className="flex-1 text-center md:text-right min-w-0">
                  {isActive && (
                    <div className={slide.useMap ? "" : ""}>
                      <span className="inline-block font-extrabold text-lg sm:text-xl md:text-2xl mb-3 md:mb-4 bg-gradient-to-l from-[#f36802] to-[#ffb245] bg-clip-text text-transparent tracking-wide animate-hero-text-in hero-delay-1">
                        شركة إنترنت تيليكوم
                      </span>

                      <h1 className="text-[1.55rem] leading-snug sm:text-3xl md:text-4xl lg:text-[2.75rem] xl:text-5xl font-black text-white md:leading-snug mb-4 md:mb-5 animate-hero-text-in hero-delay-2">
                        {slide.title}{" "}
                        {slide.titleHighlight && (
                          <span className="block md:inline mt-1 md:mt-0 bg-gradient-to-l from-[#f36802] to-[#ffb245] bg-clip-text text-transparent">
                            {slide.titleHighlight}
                          </span>
                        )}
                      </h1>

                      <p className="text-white/65 text-sm sm:text-base md:text-[1.05rem] leading-relaxed mb-6 md:mb-8 max-w-xl mx-auto md:mx-0 animate-hero-text-in hero-delay-3">
                        {slide.subtitle}
                      </p>

                      <div className="flex flex-wrap gap-3 md:gap-4 justify-center md:justify-start animate-hero-text-in hero-delay-4">
                        <Link
                          href="/internet-basvuru-formu"
                          className="group relative px-7 py-3 md:px-9 md:py-3.5 rounded-full bg-gradient-to-l from-[#f36802] to-[#ffb245] text-white font-bold text-sm md:text-base shadow-lg shadow-[#f36802]/25 hover:shadow-xl hover:shadow-[#f36802]/40 hover:scale-[1.04] active:scale-[0.98] transition-all duration-300 overflow-hidden"
                        >
                          <span className="relative z-10">سجل طلبك الأن</span>
                          <span className="absolute inset-0 bg-gradient-to-l from-[#e05e00] to-[#f5a030] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Link>

                        <a
                          href="#services"
                          onClick={scrollToServices}
                          className="px-7 py-3 md:px-9 md:py-3.5 rounded-full border-2 border-white/25 text-white font-bold text-sm md:text-base hover:bg-white/10 hover:border-white/50 active:scale-[0.98] transition-all duration-300 backdrop-blur-sm"
                        >
                          تعرف على خدماتنا
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── map side (useMap slides only) / spacer for image slides ── */}
                {slide.useMap ? (
                  <div className="flex-1 relative flex items-end justify-center min-w-0">
                    {/* primary glow */}
                    <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-55 h-55 sm:w-70 sm:h-70 md:w-87.5 md:h-87.5 lg:w-105 lg:h-105 rounded-full bg-[#18a2e3]/20 blur-[70px] md:blur-[100px] animate-hero-glow" />
                    <div
                      className="absolute bottom-[20%] left-[40%] w-40 h-40 md:w-55 md:h-55 rounded-full bg-[#f36802]/10 blur-[60px] md:blur-[80px] animate-hero-glow"
                      style={{ animationDelay: "2s" }}
                    />
                    {isActive && (
                      <div className="relative z-10 animate-hero-image-in w-full flex justify-center">
                        <div className="relative w-[120%] sm:w-full drop-shadow-[0_15px_40px_rgba(24,162,227,0.25)]">
                          <TurkeyMap />
                          <p className="absolute inset-0 flex items-center justify-center text-white/10 font-black text-5xl sm:text-6xl md:text-7xl tracking-widest select-none pointer-events-none">
                            Türkiye
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* invisible spacer keeps text on the right half on desktop */
                  <div className="hidden md:block flex-1" aria-hidden="true" />
                )}
              </div>

              {/* ── character image: pinned to section bottom so wave covers feet ── */}
              {!slide.useMap && (
                <div className="absolute bottom-0 md:bottom-10 inset-x-0 md:left-0 md:right-1/2 flex justify-center items-end pointer-events-none">
                  {/* glows */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-50 h-50 sm:w-65 sm:h-65 md:w-87.5 md:h-87.5 rounded-full bg-[#18a2e3]/20 blur-[70px] md:blur-[100px] animate-hero-glow" />
                  <div
                    className="absolute bottom-0 left-[40%] w-35 h-35 md:w-50 md:h-50 rounded-full bg-[#f36802]/10 blur-[60px] md:blur-[80px] animate-hero-glow"
                    style={{ animationDelay: "2s" }}
                  />
                  {isActive && (
                    <Image
                      src={slide.image}
                      alt=""
                      width={1000}
                      height={1000}
                      className="relative z-10 animate-hero-image-in object-contain w-auto h-90 md:h-[78vh] lg:h-[85vh] drop-shadow-[0_15px_40px_rgba(24,162,227,0.25)]"
                      priority={i === 0}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── dot indicators with progress ── */}
      <div className="absolute bottom-16 md:bottom-24 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`relative h-[10px] rounded-full transition-all duration-500 overflow-hidden ${
              i === active
                ? "w-11 bg-white/15"
                : "w-[10px] bg-white/20 hover:bg-white/40"
            }`}
            aria-label={`الانتقال للشريحة ${i + 1}`}
          >
            {i === active && (
              <span
                key={`progress-${active}`}
                className="absolute inset-y-0 right-0 rounded-full bg-gradient-to-l from-[#f36802] to-[#ffb245]"
                style={{
                  animation: `hero-dot-fill ${SLIDE_INTERVAL}ms linear forwards`,
                }}
              />
            )}
          </button>
        ))}
      </div>

      {/* ── bottom wave ── */}
      <div className="absolute -bottom-1 left-0 right-0 z-20">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 60C240 120 480 0 720 60C960 120 1200 0 1440 60V120H0V60Z"
            fill="#ffffff"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
