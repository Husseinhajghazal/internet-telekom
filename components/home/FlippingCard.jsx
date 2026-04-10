import React from "react";
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
  const SpeedIcon = getSpeedIcon(speed);

  return (
    <div className="group relative [perspective:2000px] transition-transform duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] rounded-3xl">
      {/* popular badge */}
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30">
          <span className="px-4 py-1 rounded-full bg-gradient-to-l from-[#f36802] to-[#ffb245] text-white text-xs font-bold shadow-lg shadow-[#f36802]/20">
            الأكثر طلباً
          </span>
        </div>
      )}

      {/* 3D Flipping Container */}
      <div className="relative grid w-full h-full rounded-3xl transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">

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

        {/* === BACK FACE === */}
        <div className={`col-start-1 row-start-1 relative flex flex-col h-full rounded-3xl border-2 border-transparent ${palette.backGradient} [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden shadow-xl`}>
          {/* Background Shadow Icon  */}
          <div className="absolute -left-12 -bottom-6 pointer-events-none transform rotate-12 z-0 opacity-10">
            <SpeedIcon className="w-56 h-56 text-white" />
          </div>

          {/* Compact Header */}
          <div className="px-5 pt-5 pb-3 relative z-10 border-b border-white/20 flex justify-between items-center bg-black/10">
            <div className="flex flex-col items-start justify-center">
              <span className="flex items-baseline justify-start gap-1 text-2xl font-black tracking-tighter text-white">
                <span className="text-base font-bold text-white/70 uppercase">Mbps</span>
                <span>{speed}</span>
              </span>
              <span className="text-lg font-extrabold text-white flex items-center gap-1">
                <span className="text-[12px] text-white/70 font-bold tracking-normal uppercase">شهرياً / TL</span>
                {price}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white/20 text-white">
              <SpeedIcon className="text-xl" />
            </div>
          </div>

          {/* Features List */}
          <div className="px-5 pb-6 pt-4 relative z-10 flex-1 flex flex-col justify-start">
            <ul className="space-y-4 text-sm font-semibold text-white leading-relaxed">
              {features.map((feature, i) => (
                <li key={i} className="flex items-start justify-start gap-3">
                  <MdCheckCircle className="shrink-0 text-lg mt-0.5 text-white" />
                  <span className="text-white/90">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA button on back */}
          <div className="px-5 pb-5 relative z-10">
            <Link
              href="/internet-basvuru-formu"
              className="block w-full py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white text-center font-bold text-sm transition-all duration-300 backdrop-blur-sm"
            >
              سجّل الآن ←
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlippingCard;
