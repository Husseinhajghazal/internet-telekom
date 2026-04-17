"use client";

import Link from "next/link";
import Image from "next/image";
import { FiArrowLeft, FiSearch, FiGlobe } from "react-icons/fi";
import HeroBackground from "@/components/home/HeroBackground";

export default function StartPage() {
  return (
    <div
      dir="rtl"
      className="relative flex flex-col items-center justify-center min-h-svh overflow-hidden font-sans"
    >
      {/* ── Background gradient ── */}
      <div className="absolute inset-0 bg-gradient-to-bl from-[#050d1a] via-[#0c2240] to-[#0f3a6e]" />

      {/* ── Radial accent glows ── */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 600px 400px at 20% 50%, rgba(24,162,227,0.25), transparent),
            radial-gradient(ellipse 500px 500px at 80% 30%, rgba(88,152,183,0.2), transparent),
            radial-gradient(ellipse 400px 300px at 60% 80%, rgba(24,162,227,0.15), transparent),
            radial-gradient(ellipse 350px 250px at 90% 70%, rgba(243,104,2,0.1), transparent)
          `,
        }}
      />

      {/* ── Subtle grid overlay ── */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Floating tech icons ── */}
      <HeroBackground />

      {/* ── Main content ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-10 lg:gap-16 pt-16 md:py-0 min-h-svh">
        {/* ── Text side (right in RTL) ── */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-right min-w-0">
          {/* Logo */}
          <div className="animate-hero-image-in mb-6">
            <Image
              src="/full-logo.png"
              alt="إنترنت تيليكوم"
              width={260}
              height={93}
              className="w-auto h-auto object-contain max-w-[220px] sm:max-w-[260px] hover:scale-105 transition-transform duration-500"
              priority
            />
          </div>

          {/* Brand badge */}
          <div className="animate-hero-text-in hero-delay-1 mb-5 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm font-semibold tracking-wide backdrop-blur-md">
            <FiGlobe className="text-[#18a2e3] shrink-0" />
            <span>نغطي كافة الولايات التركية</span>
          </div>

          {/* Headline */}
          <h1 className="animate-hero-text-in hero-delay-2 text-[1.75rem] leading-snug sm:text-3xl md:text-4xl lg:text-[2.75rem] xl:text-5xl font-black text-white md:leading-snug mb-4 md:mb-5">
            أهلاً وسهلاً بك في{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-l from-[#f36802] to-[#ffb245]">
              إنترنت تيليكوم
            </span>
          </h1>

          {/* Subtitle */}
          <p className="animate-hero-text-in hero-delay-3 text-white/60 text-sm sm:text-base md:text-[1.05rem] leading-relaxed mb-8 max-w-xl">
            استمتع بإنترنت منزلي فائق السرعة، بكل حرية وبلا قيود. باقات وعروض
            تلبي جميع احتياجاتك في جميع أنحاء تركيا.
          </p>

          {/* Action buttons */}
          <div className="animate-hero-text-in hero-delay-4 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              href="/internet-basvuru-formu"
              className="group relative flex items-center justify-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-l from-[#f36802] to-[#ffb245] text-white font-bold text-base shadow-lg shadow-[#f36802]/25 hover:shadow-xl hover:shadow-[#f36802]/40 hover:scale-[1.04] active:scale-[0.98] transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10">تقديم طلب الآن</span>
              <FiArrowLeft className="relative z-10 text-xl transition-transform group-hover:-translate-x-1" />
              <span className="absolute inset-0 bg-gradient-to-l from-[#e05e00] to-[#f5a030] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>

            <Link
              href="/inquiry"
              className="flex items-center justify-center gap-3 px-8 py-3.5 rounded-full border-2 border-white/25 text-white font-bold text-base hover:bg-white/10 hover:border-white/50 active:scale-[0.98] transition-all duration-300 backdrop-blur-sm"
            >
              <span>استعلم عن طلبك</span>
              <FiSearch className="text-lg" />
            </Link>
          </div>

          {/* Footer note */}
          <p className="animate-hero-text-in hero-delay-4 mt-10 text-white/30 text-xs font-medium tracking-wide">
            الحرية في التواصل&nbsp;|&nbsp;© 2026 إنترنت تيليكوم
          </p>
        </div>

        {/* ── Image side (left in RTL) ── */}
        <div className="flex-1 relative flex items-center justify-center min-w-0 w-full md:max-w-[50%]">
          {/* Primary glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] md:w-[450px] md:h-[450px] rounded-full bg-[#18a2e3]/20 blur-[80px] md:blur-[110px] animate-hero-glow" />
          </div>
          {/* Warm accent glow */}
          <div
            className="absolute bottom-[20%] left-[38%] w-[160px] h-[160px] md:w-[220px] md:h-[220px] rounded-full bg-[#f36802]/10 blur-[60px] md:blur-[80px] animate-hero-glow pointer-events-none"
            style={{ animationDelay: "2s" }}
          />

          <div className="relative z-10 animate-hero-image-in w-full flex justify-center">
            <Image
              src="/man-113.png"
              alt="رجل باستخدام الإنترنت"
              width={620}
              height={620}
              className="object-contain w-auto max-h-[40vh] sm:max-h-[50vh] md:max-h-[70vh] drop-shadow-[0_20px_60px_rgba(24,162,227,0.35)] rounded-3xl"
              priority
            />
          </div>
        </div>
      </div>

      {/* ── Bottom wave ── */}
      <div className="absolute -bottom-1 left-0 right-0 z-20 pointer-events-none">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 40C240 80 480 0 720 40C960 80 1200 0 1440 40V80H0V40Z"
            fill="rgba(24,162,227,0.07)"
          />
        </svg>
      </div>
    </div>
  );
}
