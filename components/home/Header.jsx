"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaBars,
  FaTimes,
  FaChevronLeft,
} from "react-icons/fa";

const navLinks = [
  { label: "الرئيسية", href: "#hero" },
  { label: "من نحن", href: "#about" },
  { label: "خدماتنا", href: "#services" },
  { label: "ميزاتنا", href: "#features" },
  { label: "الباقات", href: "#packages" },
  { label: "التقييمات", href: "#reviews" },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  /* ── scroll listener ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── intersection observer for active link ── */
  useEffect(() => {
    const sectionIds = navLinks.map((l) => l.href.replace("#", ""));
    const observers = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  /* ── smooth scroll handler ── */
  const scrollTo = useCallback((e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -80;
      const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, []);

  /* ── lock body scroll when mobile menu open ── */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <header
      id="main-header"
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-[0_2px_24px_rgba(24,162,227,0.10)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 h-[72px]">
        {/* ── logo ── */}
        <Link href="/" className="flex-shrink-0 relative">
          <Image
            src="/logo.png"
            alt="إنترنت تيليكوم"
            width={50}
            height={100}
            className="object-contain"
            priority
          />
        </Link>

        {/* ── desktop nav ── */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.replace("#", "");
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollTo(e, link.href)}
                className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 z-10 ${
                  isActive
                    ? "text-[#18a2e3]"
                    : scrolled
                    ? "text-gray-600 hover:text-[#18a2e3]"
                    : "text-white/90 hover:text-white"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute inset-0 rounded-full bg-[#18a2e3]/10 -z-10 animate-fade-in" />
                )}
              </a>
            );
          })}
        </nav>

        {/* ── desktop CTA ── */}
        <Link
          href="/admin"
          className={`hidden lg:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 group ${
            scrolled
              ? "bg-gradient-to-l from-[#f36802] to-[#ffb245] text-white shadow-lg shadow-[#f36802]/20 hover:shadow-xl hover:shadow-[#f36802]/30 hover:scale-105"
              : "bg-white/15 backdrop-blur-sm text-white border border-white/25 hover:bg-white/25"
          }`}
        >
          لوحة التحكم
          <FaChevronLeft className="text-xs transition-transform duration-300 group-hover:-translate-x-1" />
        </Link>

        {/* ── mobile hamburger ── */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`lg:hidden relative z-50 w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 ${
            mobileOpen
              ? "bg-red-500/10 text-red-500"
              : scrolled
              ? "text-gray-700 hover:bg-gray-100"
              : "text-white hover:bg-white/10"
          }`}
          aria-label="القائمة"
        >
          {mobileOpen ? (
            <FaTimes size={20} className="animate-fade-in" />
          ) : (
            <FaBars size={20} className="animate-fade-in" />
          )}
        </button>
      </div>

      {/* ── mobile menu ── */}
      {mobileOpen && (
        <>
          {/* overlay */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />

          {/* panel */}
          <div
            className="absolute top-[72px] right-4 left-4 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl shadow-black/10 p-6 z-40 lg:hidden border border-white/50 animate-slide-in-top"
          >
            <nav className="flex flex-col gap-1">
              {navLinks.map((link, i) => {
                const isActive = activeSection === link.href.replace("#", "");
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => scrollTo(e, link.href)}
                    style={{ animationDelay: `${i * 0.04}s` }}
                    className={`px-4 py-3 rounded-xl text-base font-semibold transition-colors duration-200 animate-slide-in-top opacity-0 [animation-fill-mode:forwards] ${
                      isActive
                        ? "bg-[#18a2e3]/10 text-[#18a2e3]"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
            </nav>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-gradient-to-l from-[#f36802] to-[#ffb245] text-white font-bold shadow-lg shadow-[#f36802]/20"
              >
                لوحة التحكم
                <FaChevronLeft className="text-xs" />
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
