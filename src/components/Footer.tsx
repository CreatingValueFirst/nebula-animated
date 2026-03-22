'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const footerColumns = [
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Careers', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Neural Forge', href: '/services/neural-forge' },
      { label: 'Voice Cosmos', href: '/services/voice-cosmos' },
      { label: 'Vision Nebula', href: '/services/vision-nebula' },
      { label: 'Data Singularity', href: '/services/data-singularity' },
      { label: 'Code Pulsar', href: '/services/code-pulsar' },
      { label: 'Quantum Mind', href: '/services/quantum-mind' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', href: '/explore' },
      { label: 'Documentation', href: '/explore' },
      { label: 'API Reference', href: '/explore' },
    ],
  },
  {
    title: 'Connect',
    links: [
      { label: 'GitHub', href: 'https://github.com', external: true },
      { label: 'Twitter', href: 'https://twitter.com', external: true },
      { label: 'LinkedIn', href: 'https://linkedin.com', external: true },
    ],
  },
];

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <footer ref={ref} className="relative overflow-hidden border-t border-white/[0.04]">
      {/* Nebula background at 3% opacity */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/nebula-4k.jpg"
          alt=""
          fill
          className="object-cover opacity-[0.03]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/90 to-[#0a0a0f]/80" />
      </div>

      {/* Gradient separator at top */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#2d8a8a]/25 to-transparent" />

      {/* Main footer content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 lg:px-16 pt-16 md:pt-20 pb-10 md:pb-12">
        {/* Top area: Logo + columns */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-8 lg:gap-12"
        >
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="group inline-flex items-center gap-2">
              <span className="text-xl font-bold tracking-[0.2em] text-white font-[family-name:var(--font-heading)]">
                HEAVEN
              </span>
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2d8a8a] opacity-50" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#2d8a8a]" />
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-500 leading-relaxed max-w-[200px]">
              Where Intelligence Meets the Infinite
            </p>
          </div>

          {/* Link columns */}
          {footerColumns.map((column, colIndex) => (
            <motion.div
              key={column.title}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{
                duration: 0.5,
                delay: 0.1 + colIndex * 0.08,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <h4 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-gray-400 mb-5">
                {column.title}
              </h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {'external' in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-500 hover:text-[#2d8a8a] transition-colors duration-300"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-gray-500 hover:text-[#2d8a8a] transition-colors duration-300"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-14 md:mt-16 pt-6 border-t border-white/[0.04]"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[13px] text-gray-600">
              &copy; 2026 Heaven Interactive. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/about"
                className="text-[13px] text-gray-600 hover:text-gray-400 transition-colors duration-300"
              >
                Privacy
              </Link>
              <Link
                href="/about"
                className="text-[13px] text-gray-600 hover:text-gray-400 transition-colors duration-300"
              >
                Terms
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
