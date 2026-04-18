"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MdElectricBolt } from "react-icons/md";
import { FaFileContract } from "react-icons/fa";
import { HiLightningBolt } from "react-icons/hi";

import NoContractCards from "./NoContractCards";
import WithContractCards from "./WithContractCards";

const PackagesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="packages"
      className="py-12 md:py-20 bg-white relative overflow-hidden"
    >
      {/* bg decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#18a2e3]/[0.03] rounded-full blur-[150px]" />

      {/* animated glow orbs */}
      <div className="absolute z-[1] top-20 right-20 w-[400px] h-[400px] bg-[#f36802] rounded-full blur-[160px] animate-glow-pulse opacity-10" />
      <div className="absolute z-[1] bottom-20 left-10 w-[350px] h-[350px] bg-[#18a2e3] rounded-full blur-[140px] animate-glow-pulse-alt opacity-10" />

      {/* big background icon */}
      <div className="absolute z-[1] top-1/2 left-20 -translate-y-1/2 pointer-events-none">
        <MdElectricBolt className="w-[400px] h-[400px] text-[#18a2e3]/[0.05]" />
      </div>

      <div ref={ref} className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
            اختر الباقة{" "}
            <span className="bg-linear-to-l from-[#18a2e3] to-[#5898b7] bg-clip-text text-transparent">
              المناسبة لك
            </span>
          </h2>
          <p className="text-gray-500 md:text-lg max-w-xl mx-auto">
            باقات مرنة تناسب جميع الإحتياجات
          </p>
        </motion.div>

        {/* No Contract Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-linear-to-l from-purple-200 to-transparent" />
            <div className="flex items-center gap-3 bg-linear-to-l from-purple-50 to-fuchsia-50 border border-purple-100 rounded-2xl px-5 py-2.5 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-linear-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center shadow-md">
                <HiLightningBolt className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-bold bg-linear-to-l from-purple-600 to-fuchsia-500 bg-clip-text text-transparent whitespace-nowrap">
                بدون عقد
              </span>
            </div>
            <div className="flex-1 h-px bg-linear-to-r from-fuchsia-200 to-transparent" />
          </div>
          <NoContractCards />
        </motion.div>

        {/* With Contract Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-linear-to-l from-blue-200 to-transparent" />
            <div className="flex items-center gap-3 bg-linear-to-l from-blue-50 to-cyan-50 border border-blue-100 rounded-2xl px-5 py-2.5 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md">
                <FaFileContract className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-bold bg-linear-to-l from-blue-600 to-cyan-500 bg-clip-text text-transparent whitespace-nowrap">
                مع عقد اشتراك
              </span>
            </div>
            <div className="flex-1 h-px bg-linear-to-r from-cyan-200 to-transparent" />
          </div>
          <WithContractCards />
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        ></motion.div>
      </div>
    </section>
  );
};

export default PackagesSection;
