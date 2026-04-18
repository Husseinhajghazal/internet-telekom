"use client";

import Link from "next/link";
import Image from "next/image";
import { FiArrowLeft, FiSearch, FiGlobe } from "react-icons/fi";
import HeroBackground from "@/components/home/HeroBackground";
import { FaWifi } from "react-icons/fa";

export default function StartPage() {
  return (
    <div
      dir="rtl"
      className="relative bg-[#fdfeff] flex flex-col items-center justify-center min-h-svh overflow-hidden font-sans"
    >
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
          <div className="animate-hero-text-in hero-delay-1 mb-5 flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/5 border border-black/10 text-black/80 text-sm font-semibold tracking-wide backdrop-blur-md">
            <FiGlobe className="text-[#18a2e3] shrink-0" />
            <span>نغطي كافة الولايات التركية</span>
          </div>

          {/* Headline */}
          <h1 className="animate-hero-text-in hero-delay-2 text-[1.65rem] leading-snug sm:text-3xl md:text-4xl lg:text-[2.75rem] xl:text-5xl font-black text-black md:leading-snug mb-4 md:mb-5">
            أهلاً وسهلاً بك{" "} <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-l from-[#f36802] to-[#ffb245] text-[2rem]">
              إنترنت تيليكوم
            </span>
          </h1>

          {/* Subtitle */}
          <p className="animate-hero-text-in hero-delay-3 text-black/60 text-sm sm:text-base md:text-[1.05rem] leading-relaxed mb-8 max-w-xl px-4">
            استمتع بإنترنت منزلي فائق السرعة، بكل حرية وبلا قيود. باقات وعروض
            تلبي جميع احتياجاتك في جميع أنحاء تركيا.
          </p>

          {/* Action buttons */}
          <div className="animate-hero-text-in hero-delay-4 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              href="/internet-basvuru-formu"
              className="group relative flex items-center justify-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-l from-[#f36802] to-[#ffb245] text-white font-bold text-base shadow-lg shadow-[#f36802]/25 hover:scale-[1.04] active:scale-[0.98] transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10">تقديم طلب الآن</span>
              <FiArrowLeft className="relative z-10 text-xl transition-transform group-hover:-translate-x-1" />
              <span className="absolute inset-0 bg-gradient-to-l from-[#e05e00] to-[#f5a030] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>

            <Link
              href="/inquiry"
              className="flex items-center justify-center gap-3 px-8 py-3.5 rounded-full text-white font-bold text-base bg-gradient-to-l from-[#18a2e3] to-[#0077b6] active:scale-[0.98] transition-all duration-300 backdrop-blur-sm"
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
      </div>

      {/* ── Bottom wave ── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-20 sm:h-24 md:h-28 lg:h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 40C240 80 480 0 720 40C960 80 1200 0 1440 40V80H0V40Z"
            fill="rgba(24,162,227,1)"
          />
        </svg>
      </div>
    </div>
  );
}
