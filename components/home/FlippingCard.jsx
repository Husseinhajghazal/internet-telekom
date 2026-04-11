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

const FlippingCard = ({
  speed,
  price,
  title,
  features,
  palette,
  popular,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const SpeedIcon = getSpeedIcon(speed);

  return (
    <div 
      className="group relative [perspective:2000px] transition-transform duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] rounded-3xl cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      {/* popular badge */}
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30">
          <span className="px-4 py-1 rounded-full bg-gradient-to-l from-[#f36802] to-[#ffb245] text-white text-xs font-bold shadow-lg shadow-[#f36802]/20">
            الأكثر طلباً
          </span>
        </div>
      )}

      {/* 3D Flipping Container */}
      <div className={`relative grid w-full h-full rounded-3xl transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] ${isFlipped ? "[transform:rotateY(180deg)]" : ""}`}>

        {/* === FRONT FACE === */}
        <div className="col-start-1 row-start-1 relative flex flex-col h-full rounded-3xl border-2 border-transparent bg-white/70 backdrop-blur-xl [backface-visibility:hidden] overflow-hidden shadow-md hover:border-gray-200">
          {/* Background Shadow Icon */}
          <div className="absolute -right-12 -bottom-6 pointer-events-none transform -rotate-12 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 z-0">
            <SpeedIcon className="w-56 h-56 text-gray-100/80" />
          </div>

          {/* Glowing Blob */}
          <div className={`absolute -top-16 -right-16 w-48 h-48 rounded-full mix-blend-multiply blur-3xl transition-all duration-700 pointer-events-none opacity-0 group-hover:opacity-15 bg-gradient-to-br ${palette.textGradient}`} />

          {/* Header: Icon */}
          <div className="px-6 pt-6 pb-2 flex justify-between items-start relative z-10">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${palette.iconBg}`}>
              <SpeedIcon className="text-3xl" />
            </div>
          </div>

          {/* Speed Number */}
          <div className="px-6 py-4 relative z-10">
            <div className="flex items-baseline justify-end gap-2 mb-1">
              <span className="text-sm font-bold text-gray-500 uppercase">Mbps</span>
              <span className={`text-8xl font-black tracking-tighter bg-clip-text p-2 text-transparent bg-gradient-to-r ${palette.textGradient}`}>
                {speed}
              </span>
            </div>

            <div className="flex items-end justify-end mt-5 gap-1.5">
              <span className="text-sm text-gray-500 font-bold mb-1.5">شهرياً / TL</span>
              <span className="text-5xl font-extrabold tracking-tight text-gray-900">
                {price}
              </span>
            </div>

            {title && (
              <div className="mt-3 text-left">
                <span className={`text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r ${palette.textGradient}`}>
                  {title}
                </span>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-70 my-2 relative z-10" />

          {/* CTA hint */}
          <div className="px-6 pb-8 pt-5 relative z-10 flex-1 flex flex-col justify-center items-center opacity-70 mt-4">
            <span className="text-sm font-bold uppercase animate-pulse text-gray-500">
              اضغط هنا لرؤية تفاصيل أكثر
            </span>
          </div>
        </div>

        {/* === BACK FACE (Dark Premium & Neon) === */}
        <div className="col-start-1 row-start-1 relative flex flex-col h-full rounded-3xl border border-gray-800 bg-[#0B1120] [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden shadow-2xl">
          
          {/* Subtle colored glow from top */}
          <div className={`absolute top-0 left-0 w-full h-1/2 opacity-20 bg-gradient-to-b ${palette.backGradient.replace('bg-gradient-to-br ', '') || palette.backGradient} blur-3xl pointer-events-none`} />

          {/* Large wireframe/opacity icon in center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-[0.03]">
            <SpeedIcon className="w-80 h-80 text-white" />
          </div>

          {/* Premium Header */}
          <div className="px-6 pt-10 pb-4 relative z-10 text-center flex flex-col items-center">
            {/* Glowing Icon Container */}
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gray-900 border border-gray-700/50 mb-5 shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)] relative`}>
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${palette.textGradient} opacity-20 blur-md`} />
              <SpeedIcon className="text-3xl text-white relative z-10" />
            </div>
            
            <h4 className="text-white font-black text-5xl tracking-tighter mb-1 relative flex items-baseline gap-1.5">
              {speed} 
              <span className="text-sm text-gray-500 uppercase tracking-widest font-bold">Mbps</span>
            </h4>
            
            <div className="flex items-center justify-center gap-1.5 mt-2">
              <span className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${palette.textGradient}`}>
                {price} 
              </span>
              <span className="text-gray-500 text-xs">TL / شهرياً</span>
            </div>

            {title && (
              <div className="mt-4">
                <span className="text-[11px] font-bold text-gray-400 bg-gray-800/80 border border-gray-700/50 px-3 py-1.5 rounded-full tracking-wide">
                  {title}
                </span>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="px-6 pb-6 relative z-10 flex-1 flex flex-col justify-start">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-5 opacity-50" />
            
            <ul className="space-y-4 flex-1 mt-1">
              {features.map((feature, i) => (
                <li key={i} className="flex items-start gap-4 group/feature">
                  <div className={`mt-0.5 rounded-full w-5 h-5 flex items-center justify-center shrink-0 bg-gradient-to-br ${palette.textGradient} shadow-[0_0_10px_rgba(255,255,255,0.1)] group-hover/feature:scale-110 transition-transform duration-300`}>
                    <MdCheckCircle className="text-white text-xs" />
                  </div>
                  <span className="text-gray-400 text-sm font-medium group-hover/feature:text-gray-200 transition-colors leading-snug">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Footer: Magic Gradient Button */}
          <div className="p-5 relative z-10 w-full mt-auto bg-gradient-to-t from-[#0B1120] via-[#0B1120] to-transparent">
            <Link
              href="/internet-basvuru-formu"
              onClick={(e) => e.stopPropagation()}
              className={`group/btn relative w-full flex items-center justify-center rounded-2xl overflow-hidden ${palette.backGradient} transition-transform duration-300 hover:scale-[1.03] active:scale-95 p-[1.5px] shadow-[0_0_15px_-5px_rgba(255,255,255,0.2)]`}
            >
              <div className="w-full bg-[#0B1120] px-4 py-3.5 rounded-[14px] flex items-center justify-center gap-2 group-hover/btn:bg-transparent transition-all duration-300">
                <span className="text-white font-extrabold text-sm transition-transform duration-300 group-hover/btn:-translate-x-1">
                  سجّل الآن واشترك
                </span>
                <span className="text-white font-bold transition-transform duration-300 group-hover/btn:-translate-x-1">
                  ←
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlippingCard;
