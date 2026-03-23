'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useLanguage();

  const navLinks = [
    { label: t.nav.services, href: '/services' },
    { label: t.nav.projects, href: '/projects' },
    { label: t.nav.explore, href: '/explore' },
    { label: t.nav.art, href: '/art' },
    { label: t.nav.about, href: '/about' },
    { label: t.nav.contact, href: '/contact' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.06),0_4px_8px_rgba(0,0,0,0.04),0_12px_24px_rgba(0,0,0,0.03)]'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
          <div className="flex h-18 md:h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-2.5">
              <span className="text-xl md:text-2xl font-bold tracking-[0.2em] text-white font-[family-name:var(--font-heading)]">
                HEAVEN INTERACTIVE
              </span>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2d8a8a] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2d8a8a]" />
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-[13px] tracking-[0.15em] uppercase text-gray-400 hover:text-white transition-colors duration-300 after:absolute after:bottom-[-4px] after:left-0 after:h-[1px] after:w-0 after:bg-[#2d8a8a] hover:after:w-full after:transition-all after:duration-300"
                >
                  {link.label}
                </Link>
              ))}

              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* CTA Button */}
              <Link
                href="/contact"
                className="relative ml-2 inline-flex items-center gap-2 rounded-full bg-[#2d8a8a]/10 px-6 py-2.5 text-[13px] font-medium tracking-wider uppercase text-[#2d8a8a] border border-[#2d8a8a]/20 transition-all duration-300 hover:bg-[#2d8a8a]/20 hover:border-[#2d8a8a]/40 hover:shadow-[0_0_20px_rgba(45,138,138,0.15),0_0_40px_rgba(45,138,138,0.05)]"
              >
                <span>{t.nav.getStarted}</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="relative z-50 flex md:hidden h-10 w-10 items-center justify-center rounded-lg transition-colors duration-200"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              <div className="flex flex-col items-end gap-[5px]">
                <motion.span
                  animate={mobileOpen ? { rotate: 45, y: 7, width: 20 } : { rotate: 0, y: 0, width: 20 }}
                  transition={{ duration: 0.3 }}
                  className="block h-[1.5px] rounded-full bg-white origin-center"
                  style={{ width: 20 }}
                />
                <motion.span
                  animate={mobileOpen ? { opacity: 0, x: 8 } : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="block h-[1.5px] rounded-full bg-white"
                  style={{ width: 14 }}
                />
                <motion.span
                  animate={mobileOpen ? { rotate: -45, y: -7, width: 20 } : { rotate: 0, y: 0, width: 20 }}
                  transition={{ duration: 0.3 }}
                  className="block h-[1.5px] rounded-full bg-white origin-center"
                  style={{ width: 20 }}
                />
              </div>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Slide-in Panel */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-45 w-[280px] bg-[#0d0d14]/95 backdrop-blur-2xl border-l border-white/[0.06] md:hidden"
            >
              <div className="flex flex-col pt-28 px-8">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block py-4 text-lg tracking-wide text-gray-300 hover:text-white transition-colors duration-200 border-b border-white/[0.04]"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                {/* Mobile Language Switcher */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + navLinks.length * 0.08, duration: 0.4 }}
                  className="py-4 border-b border-white/[0.04]"
                >
                  <LanguageSwitcher />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="mt-8"
                >
                  <Link
                    href="/contact"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 w-full rounded-full bg-[#2d8a8a]/15 px-6 py-3.5 text-sm font-medium tracking-wider uppercase text-[#2d8a8a] border border-[#2d8a8a]/25 transition-all duration-300 hover:bg-[#2d8a8a]/25"
                  >
                    {t.nav.getStarted}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </Link>
                </motion.div>

                {/* Decorative nebula glow */}
                <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#2d8a8a]/[0.04] to-transparent pointer-events-none" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
