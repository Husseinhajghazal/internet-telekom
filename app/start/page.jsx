"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "../../components/Button";
import { FiArrowRight, FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";

export default function StartPage() {
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const flashSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1600);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center h-svh gap-6 px-4 md:px-10 relative overflow-hidden overflow-x-hidden">
      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.2 } },
        }}
      >
        <motion.div
          className="flex items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <img
            src="/full-logo.png"
            alt="logo"
            className="w-3/4 md:w-2/4 lg:w-1/4 h-auto object-contain"
          />
        </motion.div>

        <motion.h1
          className="pb-2 text-lg md:text-2xl lg:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r to-[#f36802] from-[#5898b7] leading-tight mt-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          أهلاً وسهلاً بك في شركة إنترنت تيليكوم
        </motion.h1>

        <motion.p
          className="text-base md:text-xl text-slate-800 tracking-wide leading-relaxed max-w-lg mt-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          استمتع بإنترنت فائق السرعة بكل حرية وبلا قيود <br />
          خدماتنا تغطي كامل المناطق التركية
        </motion.p>

        <motion.div
          className="flex flex-col md:flex-row items-center justify-center gap-4 w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Link href="/internet-basvuru-formu" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="large"
              className="font-semibold lg:font-bold rounded-lg w-full md:min-w-50 neumorphic-btn"
              onClick={() => flashSuccess("تم بدأ طلب جديد")}
            >
              <span className="flex items-center justify-center gap-2">
                تقديم طلب الآن
                <FiArrowRight className="text-lg" />
              </span>
            </Button>
          </Link>

          <Link href="/inquiry" className="w-full sm:w-auto">
            <Button
              variant="secondary"
              size="large"
              className="font-semibold lg:font-bold rounded-lg w-full md:min-w-50 neumorphic-btn"
              onClick={() => flashSuccess("استعلام عن الطلب")}
            >
              <span className="flex items-center justify-center gap-2">
                استعلم عن طلبك
                <FiSearch className="text-lg" />
              </span>
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      {showSuccess && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 px-5 py-3 rounded-full bg-white/90 text-sm text-slate-800 shadow-2xl border border-white/60"
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.25 }}
        >
          {successMessage}
        </motion.div>
      )}
    </div>
  );
}
