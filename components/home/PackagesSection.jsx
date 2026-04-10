"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import { MdElectricBolt } from "react-icons/md";

import NoContractCards from "./NoContractCards";
import WithContractCards from "./WithContractCards";

const PackagesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [tab, setTab] = useState("no-contract");

  return (
    <section id="packages" className="py-20 md:py-28 bg-white relative overflow-hidden">
      {/* bg decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#18a2e3]/[0.03] rounded-full blur-[150px]" />

      {/* animated glow orbs */}
      <div
        className="absolute z-[1] top-20 right-20 w-[400px] h-[400px] bg-[#f36802] rounded-full blur-[160px] animate-glow-pulse opacity-10"
      />
      <div
        className="absolute z-[1] bottom-20 left-10 w-[350px] h-[350px] bg-[#18a2e3] rounded-full blur-[140px] animate-glow-pulse-alt opacity-10"
      />

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
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#18a2e3]/10 text-[#18a2e3] text-sm font-semibold mb-4">
            الباقات والأسعار
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
            اختر الباقة{" "}
            <span className="bg-gradient-to-l from-[#18a2e3] to-[#5898b7] bg-clip-text text-transparent">
              المناسبة لك
            </span>
          </h2>
          <p className="text-gray-500 md:text-lg max-w-xl mx-auto">
            باقات مرنة تناسب جميع الإحتياجات
          </p>
        </motion.div>

        {/* tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex bg-gray-100 rounded-2xl p-1.5">
            <button
              onClick={() => setTab("no-contract")}
              className={`relative px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                tab === "no-contract"
                  ? "text-white shadow-lg bg-gradient-to-l from-[#f36802] to-[#ffb245]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "no-contract" && (
                <motion.span
                  layoutId="pkg-tab"
                  className="absolute inset-0 bg-gradient-to-l from-[#18a2e3] to-[#5898b7] rounded-xl -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              بدون عقد
            </button>
            <button
              onClick={() => setTab("with-contract")}
              className={`relative px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                tab === "with-contract"
                  ? "text-white shadow-lg bg-gradient-to-l from-[#f36802] to-[#ffb245]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "with-contract" && (
                <motion.span
                  layoutId="pkg-tab"
                  className="absolute inset-0 bg-gradient-to-l from-[#18a2e3] to-[#5898b7] rounded-xl -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              مع عقد اشتراك
            </button>
          </div>
        </motion.div>

        {/* content */}
        <AnimatePresence mode="wait">
          {tab === "no-contract" ? (
            <motion.div
              key="no-contract"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <NoContractCards />
            </motion.div>
          ) : (
            <motion.div
              key="with-contract"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <WithContractCards />
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link
            href="/internet-basvuru-formu"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border-[4px] border-[#ffb245] text-[#ffb245] font-bold text-lg hover:scale-105 transition-all duration-300"
          >
            سجّل الآن واحصل على باقتك
            <FaArrowLeft className="text-sm" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default PackagesSection;
