"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  MdSpeed,
  MdWifi,
  MdFlashOn,
  MdElectricBolt,
  MdRocketLaunch,
  MdCheckCircle,
} from "react-icons/md";
import { FaFireAlt } from "react-icons/fa";
import { BsFillAirplaneFill } from "react-icons/bs";
import { HiArrowLeft } from "react-icons/hi";

/* ── Speed-based icon helper ── */
const getSpeedIcon = (speedStr) => {
  const speed = parseInt(speedStr, 10) || 0;
  if (speed >= 1000) return MdRocketLaunch;
  if (speed >= 500) return MdElectricBolt;
  if (speed >= 200) return FaFireAlt;
  if (speed >= 100) return MdFlashOn;
  if (speed >= 50) return BsFillAirplaneFill;
  if (speed >= 24) return MdSpeed;
  return MdWifi;
};

const FlippingCard = ({ speed, price, title, features, palette, popular }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const SpeedIcon = getSpeedIcon(speed);

  return (
    <div
      className="group relative [perspective:2000px] cursor-pointer hover:-translate-y-2 transition-transform duration-300"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      {/* 3D flip container */}
      <div
        className={`relative w-full [transform-style:preserve-3d] transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* ═══ FRONT FACE — sets the container height ═══ */}
        <div className="[backface-visibility:hidden] relative flex flex-col rounded-3xl border-2 border-transparent bg-white/70 backdrop-blur-xl overflow-hidden shadow-md hover:border-gray-200">
          {/* background shadow icon */}
          <div className="absolute -right-12 -bottom-6 pointer-events-none -rotate-12 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500 z-0">
            <SpeedIcon className="w-56 h-56 text-gray-100/80" />
          </div>

          {/* glow blob */}
          <div
            className={`absolute -top-16 -right-16 w-48 h-48 rounded-full mix-blend-multiply blur-3xl transition-all duration-700 pointer-events-none opacity-0 group-hover:opacity-15 bg-linear-to-br ${palette.textGradient}`}
          />

          {/* icon row */}
          <div className="px-6 pt-6 pb-2 flex justify-between items-start relative z-10">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${palette.iconBg}`}
            >
              <SpeedIcon className="text-3xl" />
            </div>
          </div>

          {/* speed + price */}
          <div className="px-6 py-4 relative z-10">
            <div className="flex items-baseline justify-end gap-2 mb-1">
              <span className="text-sm font-bold text-gray-500 uppercase">
                Mbps
              </span>
              <span
                className={`text-8xl font-black tracking-tighter bg-clip-text p-2 text-transparent bg-linear-to-r ${palette.textGradient}`}
              >
                {speed}
              </span>
            </div>

            <div className="flex items-end justify-end mt-5 gap-1.5">
              <span className="text-sm text-gray-500 font-bold mb-1.5">
                شهرياً / TL
              </span>
              <span className="text-5xl font-extrabold tracking-tight text-gray-900">
                {price}
              </span>
            </div>

            {title && (
              <div className="mt-3 text-left">
                <span
                  className={`text-sm font-bold bg-clip-text text-transparent bg-linear-to-r ${palette.textGradient}`}
                >
                  {title}
                </span>
              </div>
            )}
          </div>

          {/* divider */}
          <div className="w-full h-px bg-linear-to-r from-transparent via-gray-200 to-transparent opacity-70 my-2 relative z-10" />

          {/* flip hint */}
          <div className="px-6 pb-6 pt-4 relative z-10 flex items-center justify-center gap-1.5 opacity-50">
            <span className="text-xs font-bold text-gray-400 animate-pulse">
              اضغط لرؤية التفاصيل
            </span>
          </div>
        </div>

        {/* ═══ BACK FACE — absolutely positioned, doesn't affect front height ═══ */}
        <div className="absolute top-0 left-0 w-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div
            className={`rounded-3xl overflow-hidden shadow-2xl ${palette.backGradient} relative`}
          >
            {/* subtle dot-grid texture */}
            <div
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />

            {/* top-right glow orb */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/25 rounded-full blur-3xl pointer-events-none" />
            {/* bottom-left glow orb */}
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-black/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 p-6 flex flex-col gap-4">
              {/* speed + icon row */}
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="text-white/50 text-[10px] font-bold uppercase tracking-[0.15em]">
                    السرعة
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-white font-black text-5xl tracking-tight leading-none">
                      {speed}
                    </span>
                    <span className="text-white/50 text-sm font-bold self-end mb-0.5">
                      Mbps
                    </span>
                  </div>
                </div>
                <div className="w-13 h-13 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center p-3 backdrop-blur-sm">
                  <SpeedIcon className="text-3xl text-white" />
                </div>
              </div>

              {/* price chip */}
              <div className="flex items-center justify-between bg-black/20 border border-white/15 rounded-2xl px-4 py-3 backdrop-blur-sm">
                <span className="text-white/60 text-xs font-semibold">
                  الاشتراك الشهري
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-white font-black text-2xl tracking-tight">
                    {price}
                  </span>
                  <span className="text-white/50 text-xs font-bold">TL</span>
                </div>
              </div>

              {/* divider */}
              <div className="h-px w-full bg-white/15" />

              {/* features */}
              <ul className="space-y-2.5">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
                      <MdCheckCircle className="text-white text-xs" />
                    </div>
                    <span className="text-white/85 text-sm font-medium leading-snug">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA button */}
              <Link
                href="/internet-basvuru-formu"
                onClick={(e) => e.stopPropagation()}
                className="mt-1 w-full bg-white rounded-2xl px-4 py-3.5 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-200"
              >
                <span className={`font-extrabold text-sm ${palette.priceText}`}>
                  سجّل الآن واشترك
                </span>
                <HiArrowLeft className={`w-4 h-4 ${palette.priceText}`} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlippingCard;
