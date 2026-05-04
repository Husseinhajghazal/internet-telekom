"use client";

import Link from "next/link";
import Image from "next/image";
import { FiArrowLeft, FiSearch, FiGlobe } from "react-icons/fi";
import HeroBackground from "@/components/home/HeroBackground";
import { FaWifi, FaUsers, FaMapMarkedAlt, FaStar, FaHeadset } from "react-icons/fa";

const stats = [
  { value: "50", suffix: "K+", suffixColor: "text-[#f36802]", label: "ألف عميل سعيد", icon: FaUsers },
  { value: "10", suffix: "Y+", suffixColor: "text-[#f36802]", label: "سنوات من الخبرة", icon: FaStar },
  { value: "24", suffix: "/7", suffixColor: "text-[#f36802]", label: "دعم فني بالعربية", icon: FaHeadset },
];

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
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-10 lg:gap-16 pt-8 md:py-0 min-h-svh">
        {/* ── Text side (right in RTL) ── */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-right min-w-0">
          {/* Logo */}
          <div className="animate-hero-image-in mb-6">
            <Link href="/">
              <Image
                src="/full-logo.png"
                alt="إنترنت تيليكوم"
                width={260}
                height={93}
                className="w-auto h-auto object-contain max-w-[220px] sm:max-w-[260px] hover:scale-105 transition-transform duration-500"
                priority
              />
            </Link>
          </div>

          {/* Brand badge */}
          <div className="animate-hero-text-in hero-delay-1 mb-5 flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/5 border border-black/10 text-black/80 text-sm font-semibold tracking-wide backdrop-blur-md">
            <FiGlobe className="text-[#18a2e3] shrink-0" />
            <span>نغطي كافة الولايات التركية</span>
          </div>

          {/* Headline */}
          <h1 className="animate-hero-text-in hero-delay-2 text-[1.65rem] leading-snug sm:text-3xl md:text-4xl lg:text-[2.75rem] xl:text-4xl font-black text-black md:leading-snug mb-4 md:mb-5">
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

          {/* Stats below buttons */}
          <div className="animate-hero-text-in hero-delay-5 mt-5 md:mt-10 w-full sm:w-auto grid md:hidden grid-cols-3 gap-1.5 sm:gap-4 md:gap-6 bg-black/[0.02] border border-black/[0.05] rounded-[2rem] p-3 sm:p-5">
            {stats.map((stat, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0c2240]/10 mb-3 md:mb-4">
                <stat.icon className="text-lg text-[#f36802]" />
              </div>
              <div className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#0c2240] mb-2 md:mb-4 tracking-wider" dir="ltr">
                {stat.value}
                {stat.suffix && (
                  <span className={stat.suffixColor}>{stat.suffix}</span>
                )}
              </div>
              <div className="text-[#0c2240] text-xs md:text-base font-medium tracking-wide">
                {stat.label}
              </div>
            </div>
            ))}
          </div>
        </div>

        {/* ── Image side (left in RTL) ── */}
        <div className="flex-1 hidden md:flex items-center justify-center w-full max-w-md md:max-w-none mt-8 md:mt-0">
          <div className="relative w-full max-w-sm sm:max-w-md">
            {/* Main image container */}
            <div className="relative animate-hero-image-in">
              <div className="relative group">
                <Image
                  src="/man-113.png"
                  alt="إنترنت تيليكوم"
                  width={600}
                  height={600}
                  className="relative w-full h-auto object-contain"
                  priority
                />
              </div>

              {/* Floating badge with subtle glow */}
              <div className="absolute -bottom-6 -left-6 animate-hero-image-in hero-delay-2 w-48 sm:w-56 bg-white/90 backdrop-blur-md border border-white/60 rounded-2xl p-4 shadow-xl flex items-center gap-3 hover:scale-110 transition-transform duration-500">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f36802] to-[#ffb245] flex items-center justify-center text-white shadow-lg">
                  <FaWifi className="text-lg" />
                </div>
                <div>
                  <div className="text-black/80 text-xs font-semibold tracking-wide">إنترنت فائق السرعة</div>
                  <div className="text-[#f36802] text-sm font-bold">1000 Mbps</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom wave ── */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
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
