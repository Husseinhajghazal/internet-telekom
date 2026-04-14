"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BiSupport } from "react-icons/bi";
import { BiWorld } from "react-icons/bi";
import { FaPeopleGroup } from "react-icons/fa6";


const stats = [
  {
    value: "50",
    suffix: "K+",
    suffixColor: "text-[#f36802]",
    label: "ألف عميل سعيد",
  },
  {
    value: "81",
    suffix: "+",
    suffixColor: "text-[#f36802]",
    label: "ولاية مغطاة",
  },
  {
    value: "10",
    suffix: "Y+",
    suffixColor: "text-[#f36802]",
    label: "سنوات من الخبرة",
  },
  {
    value: "24",
    suffix: "/7",
    suffixColor: "text-[#f36802]",
    label: "دعم فني بالعربية",
  },
];

const StatsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="relative w-full bg-white pt-12 pb-12 overflow-hidden z-10">
      {/* ── Big Low Opacity Background Icon ── */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] md:opacity-[0.03] pointer-events-none z-0">
        <BiSupport className="text-[10rem] md:text-[15rem] text-[#0c2240]" />
      </div>
      <div className="absolute top-1/2 left-2/4 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] md:opacity-[0.03] pointer-events-none z-0">
        <BiWorld className="text-[10rem] md:text-[15rem] text-[#0c2240]" />
      </div>
      <div className="absolute top-1/2 left-3/4 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] md:opacity-[0.03] pointer-events-none z-0">
        <FaPeopleGroup className="text-[10rem] md:text-[15rem] text-[#0c2240]" />
      </div>

      <div ref={ref} className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0c2240] mb-2 md:mb-4 tracking-wider" dir="ltr">
                {stat.value}
                {stat.suffix && (
                  <span className={stat.suffixColor}>{stat.suffix}</span>
                )}
              </div>
              <div className="text-[#0c2240] text-sm sm:text-base md:text-lg font-medium tracking-wide">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
