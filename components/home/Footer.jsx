import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaFacebookF,
  FaWhatsapp,
  FaEnvelope,
  FaHeart,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden" dir="rtl">
      {/* wave top */}
      <div className="w-full">
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto block"
          preserveAspectRatio="none"
        >
          <path
            d="M0 40C360 100 720 0 1080 40C1260 60 1380 80 1440 40V100H0V40Z"
            fill="#0a1628"
          />
        </svg>
      </div>

      <div className="bg-[#0a1628] pb-8 -mt-1">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 pb-10 border-b border-white/10">
            {/* logo & about */}
            <div className="md:col-span-1">
              <Link href="/" className="inline-block mb-4">
                <div className="bg-white px-5 py-2.5 rounded-2xl shadow-lg flex items-center justify-center">
                  <div className="relative w-[160px] h-[44px]">
                    <Image
                      src="/full-logo.png"
                      alt="إنترنت تيليكوم"
                      fill
                      sizes="160px"
                      className="object-contain"
                    />
                  </div>
                </div>
              </Link>
              <p className="text-white/40 text-sm leading-relaxed max-w-sm">
                منذ 2015 نعمل على توفير أفضل خدمات الإنترنت المنزلي في تركيا
                للمجتمع العربي. نقدم حلولاً متكاملة بمعايير عالية وأسعار منافسة.
              </p>
            </div>

            {/* contact info */}
            <div>
              <h4 className="text-white font-bold text-base mb-5">
                تواصل معنا
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://wa.me/905387345820"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-white/50 hover:text-[#25d366] transition-colors duration-300 text-sm"
                  >
                    <FaWhatsapp size={16} />
                    <span dir="ltr">+90 538 734 58 20</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/902126112122"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-white/50 hover:text-[#25d366] transition-colors duration-300 text-sm"
                  >
                    <FaWhatsapp size={16} />
                    <span dir="ltr">+90 212 611 21 22</span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:internet.telekom.merkez@gmail.com"
                    className="flex items-center gap-3 text-white/50 hover:text-[#18a2e3] transition-colors duration-300 text-sm"
                  >
                    <FaEnvelope size={14} />
                    <span>internet.telekom.merkez@gmail.com</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* social */}
            <div>
              <h4 className="text-white font-bold text-base mb-5">
                تابعنا
              </h4>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.facebook.com/internettelekom.net.tr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/50 hover:bg-[#1877f2]/20 hover:text-[#1877f2] transition-all duration-300"
                >
                  <FaFacebookF size={16} />
                </a>
              </div>
            </div>
          </div>

          {/* bottom copyright */}
          <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-white/30 text-xs">
              © {currentYear} إنترنت تيليكوم. جميع الحقوق محفوظة.
            </p>
            <p className="text-white/20 text-xs flex items-center gap-1">
              صُنع بـ <FaHeart size={10} className="text-red-500/60" /> في إسطنبول
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
