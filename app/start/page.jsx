"use client";

import Link from "next/link";
import Image from "next/image";
import { FiArrowLeft, FiSearch, FiGlobe } from "react-icons/fi";
import { motion } from "framer-motion";

export default function StartPage() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-svh p-4 md:p-10 overflow-hidden font-sans bg-[#0B1120]">
      {/* ── Background Layer ── */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/router.jpg" 
          alt="Router Background" 
          fill 
          className="object-cover opacity-20 mix-blend-luminosity pointer-events-none"
          priority
        />
        {/* Deep shadows & Magic Gradient Overlays */}
      </div>

      {/* ── Floating Animated Orbs ── */}
      <div className="absolute top-[10%] left-[15%] w-[400px] h-[400px] bg-[#18a2e3]/20 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[5%] right-[10%] w-[500px] h-[500px] bg-[#f36802]/15 rounded-full blur-[120px] pointer-events-none animate-[pulse_4s_ease-in-out_infinite]" style={{ animationDelay: "1s" }} />

      <motion.div
        className="relative z-10 flex flex-col items-center w-full max-w-3xl group"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.15 } },
        }}
      >
        {/* ── Glassmorphism Container ── */}
          
          {/* Decorative Corner Glows matching branding */}
          <div className="absolute top-0 -right-10 w-52 h-52 bg-gradient-to-bl from-[#f36802] to-[#ffb245] rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none" />
          <div className="absolute bottom-10 -left-10 w-52 h-52 bg-gradient-to-tr from-[#18a2e3] to-[#0d8bc9] rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none" />

          {/* Logo */}
          <motion.div
            className="flex flex-col items-center justify-center relative z-10 mb-8"
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="mb-6 hover:scale-105 transition-transform duration-500 max-w-[280px]">
              <Image
                src="/full-logo.png"
                alt="إنترنت تيليكوم"
                width={280}
                height={100}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
            
            {/* Minimalist Badge */}
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm font-semibold tracking-wide backdrop-blur-md">
              <FiGlobe className="text-[#18a2e3]" />
              <span>نغطي كافة الولايات التركية</span>
            </div>
          </motion.div>

          {/* Typography */}
          <motion.div
            className="text-center relative z-10 mb-10"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-5 drop-shadow-lg">
              <span className="text-white">أهلاً وسهلاً بك في</span><br/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#18a2e3] via-[#ffb245] to-[#f36802] mt-2 inline-block">
                إنترنت تيليكوم
              </span>
            </h1>
            
            <p className="text-base md:text-xl text-white/60 font-medium leading-relaxed max-w-lg mx-auto">
              استمتع بإنترنت منزلي فائق السرعة، بكل حرية وبلا قيود. باقات وعروض تلبي جميع احتياجاتك.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full relative z-10"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link href="/internet-basvuru-formu" className="w-full sm:w-auto flex-1">
              <div className="group/btn relative w-full flex items-center justify-center gap-3 py-4 md:py-4 px-6 rounded-2xl bg-gradient-to-l from-[#f36802] to-[#ffb245] text-white font-bold text-lg transition-all duration-300 shadow-[0_15px_30px_-5px_rgba(243,104,2,0.4)] hover:shadow-[0_20px_40px_-5px_rgba(243,104,2,0.6)] hover:-translate-y-1 overflow-hidden">
                <div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] group-hover/btn:duration-700 group-hover/btn:translate-x-[150%] transition-transform ease-in-out" />
                <span className="relative z-10">تقديم طلب الآن</span>
                <FiArrowLeft className="relative z-10 text-xl transition-transform group-hover/btn:-translate-x-1" />
              </div>
            </Link>

            <Link href="/inquiry" className="w-full sm:w-auto flex-1">
              <div className="group/btn relative w-full flex items-center justify-center gap-3 py-4 md:py-4 px-6 rounded-2xl bg-white/5 border border-white/20 text-white font-bold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-lg hover:-translate-y-1">
                <span>استعلم عن طلبك</span>
                <FiSearch className="text-xl transition-transform group-hover/btn:scale-110" />
              </div>
            </Link>
          </motion.div>
        
        {/* Minimal Footer */}
        <motion.div 
          className="mt-8 text-center text-white/40 text-sm font-medium tracking-wide"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          الحرية في التواصل | © 2026 إنترنت تيليكوم
        </motion.div>

      </motion.div>
    </div>
  );
}
