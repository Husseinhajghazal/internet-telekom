import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaFacebookF,
  FaWhatsapp,
  FaEnvelope,
  FaInstagram,
  FaTiktok,
  FaPhoneAlt,
  FaMapMarkerAlt,
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
                <div className="relative w-[170px] h-[80px]">
                  <Image
                    src="/full-logo.png"
                    alt="إنترنت تيليكوم"
                    fill
                    sizes="170px"
                    className="object-contain"
                  />
                </div>
              </Link>
              <div>
                <h4 className="text-black font-bold text-base mb-5">
                  تابعنا على مواقع التواصل الاجتماعي
                </h4>
                <div className="flex items-center gap-3">
                  <a
                    href="https://www.facebook.com/internettelekom.net.tr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-[#1877f2] text-white transition-all duration-300"
                  >
                    <FaFacebookF size={20} />
                  </a>
                  <a
                    href="https://www.instagram.com/internettelekom.net.tr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-pink-500 text-white transition-all duration-300"
                  >
                    <FaInstagram size={20} />
                  </a>
                  <a
                    href="https://www.tiktok.com/@internettelekom.net.tr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-black text-white transition-all duration-300"
                  >
                    <FaTiktok size={20} />
                  </a>
                  <a
                    href="https://wa.me/902126112122"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-[#25d366] text-white transition-all duration-300"
                  >
                    <FaWhatsapp size={20} />
                  </a>
                  <a
                    href="https://wa.me/905387345820"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-[#25d366] text-white transition-all duration-300"
                  >
                    <FaWhatsapp size={20} />
                  </a>
                </div>
              </div>
            </div>

            {/* contact info */}
            <div>
              <h4 className="text-black font-bold text-base mb-5">اتصل بنا :</h4>
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
                    <span dir="ltr">+90 212 611 21 22</span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@internettelekom.net.tr"
                    className="flex items-center gap-3 text-black hover:text-[#18a2e3] transition-colors duration-300 text-sm"
                  >
                    <FaEnvelope size={14} />
                    <span>info@internettelekom.net.tr</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* map */}
            <div>
              <h4 className="text-black font-bold text-base mb-5 text-center">تفضل بزيارة شركتنا</h4>
              <div className="rounded-2xl overflow-hidden relative group transition-all duration-400 hover:shadow-[0_12px_40px_rgba(24,162,227,0.15)] hover:-translate-y-1 bg-white">
                <a 
                  href="https://maps.app.goo.gl/vN9GunSEyTgh75sBA" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="absolute inset-0 z-20 flex items-center justify-center bg-black/0 group-hover:bg-black/10 backdrop-blur-[0px] group-hover:backdrop-blur-sm transition-all duration-500"
                  aria-label="فتح في خرائط جوجل"
                >
                  <div className="opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-75 bg-white text-black px-6 py-2.5 rounded-full font-bold flex items-center gap-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                    <FaMapMarkerAlt size={18} className="text-[#18a2e3]" />
                    <span className="text-sm">عرض على الخريطة</span>
                  </div>
                </a>
                <div className="relative w-full h-[200px] overflow-hidden">
                  <iframe
                    src="https://maps.google.com/maps?q=G%C3%BCm%C3%BC%C5%9Ftun%C3%A7+%C4%B0%C5%9F+Merkezi,+Fevzi+%C3%87akmak,+At%C4%B1%C5%9Falan%C4%B1+Cd.+D:8,+34225+Esenler%2F%C4%B0stanbul&z=17&hl=ar&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="موقع إنترنت تيليكوم"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* bottom copyright */}
          <div className="pt-6 flex flex-col md:flex-row items-center justify-center gap-3">
            <p className="text-black text-sm">
              © {currentYear} إنترنت تيليكوم - جميع الحقوق محفوظة
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
