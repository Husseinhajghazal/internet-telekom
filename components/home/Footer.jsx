import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaFacebookF,
  FaWhatsapp,
  FaEnvelope,
  FaInstagram,
  FaTiktok,
  FaHeart,
  FaPhoneAlt,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden" dir="rtl">
      <div className="bg-linear-to-br from-white to-[#c5e1ee] py-8 -mt-1">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 pb-10 border-b border-white/10">
            {/* logo & about */}
            <div className="md:col-span-1">
              <Link href="/" className="inline-block mb-4">
                <div className="relative w-[160px] h-[44px]">
                  <Image
                    src="/full-logo.png"
                    alt="إنترنت تيليكوم"
                    fill
                    sizes="160px"
                    className="object-contain"
                  />
                </div>
              </Link>
              <p className="text-black text-sm leading-relaxed max-w-sm">
                منذ 2015 نعمل على توفير أفضل خدمات الإنترنت المنزلي في تركيا
                للمجتمع العربي. نقدم حلولاً متكاملة بمعايير عالية وأسعار منافسة.
              </p>
            </div>

            {/* contact info */}
            <div>
              <h4 className="text-black font-bold text-base mb-5">
                تواصل معنا
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="tel:05387345820"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-black hover:text-[#25d366] transition-colors duration-300 text-sm"
                  >
                    <FaPhoneAlt size={16} />
                    <span dir="ltr">+90 538 734 58 20</span>
                  </a>
                </li>
                <li>
                  <a
                    href="tel:02126112122"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-black hover:text-[#25d366] transition-colors duration-300 text-sm"
                  >
                    <FaPhoneAlt size={16} />
                    <span dir="ltr">0212 611 21 22</span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:internet.telekom.merkez@gmail.com"
                    className="flex items-center gap-3 text-black hover:text-[#18a2e3] transition-colors duration-300 text-sm"
                  >
                    <FaEnvelope size={14} />
                    <span>internet.telekom.merkez@gmail.com</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* social */}
            <div>
              <h4 className="text-black font-bold text-base mb-5">تابعنا</h4>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.facebook.com/internettelekom.net.tr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#ebebeb] text-[#1877f2] transition-all duration-300"
                >
                  <FaFacebookF size={20} />
                </a>
                <a
                  href="https://www.instagram.com/internettelekom.net.tr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#ebebeb] text-pink-500 transition-all duration-300"
                >
                  <FaInstagram size={20} />
                </a>
                <a
                  href="https://www.tiktok.com/@internettelekom.net.tr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#ebebeb] text-black transition-all duration-300"
                >
                  <FaTiktok size={20} />
                </a>
                <a
                  href="https://wa.me/902126112122"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#ebebeb] text-[#25d366] transition-all duration-300"
                >
                  <FaWhatsapp size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* bottom copyright */}
          <div className="pt-6 flex flex-col md:flex-row items-center justify-center gap-3">
            <p className="text-black text-xs">
              © {currentYear} إنترنت تيليكوم. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
