import React from "react";
import {
  FaWifi,
  FaRocket,
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

export default function HeroBackground() {
  return (
    <>
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#18a2e3]/20 blur-[120px] animate-glow-pulse" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#5898b7]/20 blur-[140px] animate-glow-pulse-alt" />
      </div>

      {floatingIcons.map((item, i) => (
        <div
          key={i}
          className="absolute text-white/[0.12] pointer-events-none z-[2] animate-float-icon"
          style={{ 
            top: item.top, 
            right: item.right, 
            animationDuration: `${item.duration}s`, 
            animationDelay: `${item.delay}s` 
          }}
        >
          <item.Icon size={item.size} />
        </div>
      ))}
    </>
  );
}
