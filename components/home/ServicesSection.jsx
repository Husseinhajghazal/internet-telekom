"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { HiMiniWifi, HiMiniWrenchScrewdriver, HiMiniLightBulb } from "react-icons/hi2";

const services = [
  {
    image: "/service-4.png",
    title: "تقديم على إنترنت",
    description:
      "احصل على خط إنترنت جديد بسرعات تصل حتى 1000 ميجابت. خيارات مرنة بعقد أو بدون عقد مع أفضل الأسعار وتركيب خلال 48 ساعة.",
    link: "/internet-basvuru-formu",
    linkText: "قدّم الآن",
    label: "خدمة جديدة",
    bgColor: "bg-[#fffbf5]", // soft cream
    icon: HiMiniWifi,
  },
  {
    image: "/service-2.png",
    title: "خدمات تقنية",
    description:
      "نقل الخط، تجميد الاشتراك، تغيير الملكية، تجديد العقد، وحل كافة المشكلات الفنية. فريقنا المتخصص جاهز لمساعدتك.",
    link: "/internet-basvuru-formu",
    linkText: "اطلب الخدمة",
    label: "دعم فني",
    bgColor: "bg-[#f4f9fd]", // soft blue
    icon: HiMiniWrenchScrewdriver,
  },
  {
    image: "/service-6.png",
    title: "استشارات",
    description:
      "استشارة مجانية حول أفضل باقة تناسب احتياجاتك، فحص البنية التحتية في منطقتك، ومقارنة العروض المتاحة مع دعم كامل بالعربية.",
    link: "/internet-basvuru-formu",
    linkText: "استشرنا مجاناً",
    label: "استشارة مجانية 100%",
    bgColor: "bg-[#fcf5f5]", // soft pink/red
    icon: HiMiniLightBulb,
  },
];

/* ── Wide Card Component ── */
const WideServiceCard = ({ service }) => {
  return (
    <div className="w-full h-full flex flex-col md:flex-row rounded-[2rem] md:rounded-[3rem] overflow-hidden group transition-transform duration-500 hover:shadow-2xl hover:shadow-[#18a2e3]/10 border border-gray-100/50 bg-white shadow-xl shadow-black/5">
      {/* ── Text Side ── */}
      <div
        className={`w-full md:w-1/2 p-8 sm:p-10 lg:p-14 flex flex-col justify-center ${service.bgColor}`}
      >
        {/* Label */}
        <div className="flex items-center gap-2 text-black font-bold mb-4 sm:mb-6">
          <service.icon className="text-xl" />
          <span className="text-sm tracking-wide">{service.label}</span>
        </div>

        {/* Title */}
        <h3 className={`text-2xl lg:text-3xl xl:text-4xl font-extrabold mb-4 leading-snug text-[#18a2e3]`}>
          {service.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed mb-8 sm:mb-10 flex-1">
          {service.description}
        </p>

        {/* Button */}
        <div>
          <Link
            href={service.link}
            className={`inline-flex items-center justify-center gap-3 px-6 lg:px-8 py-3 rounded-full border-2 border-[#f36802] text-[#f36802] font-bold hover:bg-[#f36802] hover:text-white transition-all duration-300 text-sm sm:text-base w-fit`}
          >
            {service.linkText}
          </Link>
        </div>
      </div>

      {/* ── Image Side ── */}
      <div className="w-full md:w-1/2 h-[250px] sm:h-[300px] md:h-auto relative overflow-hidden bg-gray-50 flex items-center justify-center">
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
          sizes="(max-width: 768px) 90vw, 50vw"
        />
        {/* Subtle glow overlay inside the image container */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
      </div>
    </div>
  );
};

/* ── Snap Slider Component ── */
const ServicesSnapCarousel = ({ items }) => {
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const isScrollingRef = useRef(false);

  // Auto-advance
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [isHovered, items.length]);

  // Sync state -> scroll position (Only when triggered programmatically, e.g. interval or dots)
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    if (!isScrollingRef.current) {
      const child = track.children[activeIndex];
      if (child) {
        // Calculate dynamic offset relative to viewport so we don't jump vertically
        const trackRect = track.getBoundingClientRect();
        const childRect = child.getBoundingClientRect();
        
        const trackCenter = trackRect.left + trackRect.width / 2;
        const childCenter = childRect.left + childRect.width / 2;
        
        const scrollDelta = childCenter - trackCenter;
        
        if (Math.abs(scrollDelta) > 1) {
          track.scrollBy({ left: scrollDelta, behavior: "smooth" });
        }
      }
    }
  }, [activeIndex]);

  // Sync scroll position -> state (For manual swiping/scrolling via CSS snap)
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let timeoutId;
    const handleScroll = () => {
      isScrollingRef.current = true;
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        // Find which child is closest to the center
        let closestIndex = 0;
        let minDistance = Infinity;
        const trackCenter =
          track.getBoundingClientRect().left +
          track.getBoundingClientRect().width / 2;

        Array.from(track.children).forEach((child, idx) => {
          const childRect = child.getBoundingClientRect();
          const childCenter = childRect.left + childRect.width / 2;
          const distance = Math.abs(trackCenter - childCenter);
          if (distance < minDistance) {
            minDistance = distance;
            closestIndex = idx;
          }
        });

        if (closestIndex !== activeIndex) {
          setActiveIndex(closestIndex);
        }
        
        // Wait a tiny bit before trusting programmatic scroll again
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 50);
      }, 150); // wait until scroll stops
    };

    track.addEventListener("scroll", handleScroll);
    return () => {
      track.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, [activeIndex]);

  return (
    <div
      className="w-full relative px-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      {/* Track */}
      <div
        ref={trackRef}
        className="flex overflow-x-auto gap-4 sm:gap-6 pb-12 snap-x snap-mandatory hide-scrollbar w-full px-4 md:px-8 lg:px-12"
      >
        {items.map((srv, i) => (
          <div
            key={i}
            className="snap-center shrink-0 w-[85vw] sm:w-[90vw] md:w-[80vw] lg:w-[1000px] flex items-stretch"
          >
            <WideServiceCard service={srv} />
          </div>
        ))}
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center items-center gap-3">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              isScrollingRef.current = false; // Force manual override
              setActiveIndex(i);
            }}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              i === activeIndex
                ? "bg-[#18a2e3] w-8"
                : "bg-gray-300 hover:bg-gray-400 w-2.5"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const ServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="services"
      className="py-16 md:py-28 bg-white relative overflow-hidden"
    >
      {/* subtle bg decoration */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#18a2e3]/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#5898b7]/5 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3" />

      <div ref={ref} className="mx-auto relative z-10 w-full max-w-[100vw]">
        {/* section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-16 px-4"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#18a2e3]/10 text-[#18a2e3] text-sm font-semibold mb-4">
            خدماتنا
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
            الخدمات التي{" "}
            <span className="bg-gradient-to-l from-[#18a2e3] to-[#5898b7] bg-clip-text text-transparent">
              نقدمها لكم
            </span>
          </h2>
          <p className="text-gray-500 md:text-lg max-w-xl mx-auto">
            حلول متكاملة تغطي جميع إحتياجاتكم
          </p>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <ServicesSnapCarousel items={services} />
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
