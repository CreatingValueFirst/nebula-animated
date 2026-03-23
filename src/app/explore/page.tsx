'use client';

import React, { useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from 'framer-motion';
import { useLanguage } from '../../i18n/LanguageContext';

// ---------------------------------------------------------------------------
// Hotspot Data
// ---------------------------------------------------------------------------
const hotspots = [
  {
    id: 'savemytime',
    label: 'SaveMyTime AI Lab',
    description:
      'Voice AI platform with 24/7 customer automation',
    link: 'https://savemytime.dev/',
    x: 38,
    y: 55,
    color: '#2d8a8a',
  },
  {
    id: 'livetranslations',
    label: 'LiveTranslations',
    description:
      'AI video dubbing in 29 languages',
    link: 'https://livetranslations.video/',
    x: 62,
    y: 30,
    color: '#4a9eff',
  },
  {
    id: 'yourdreams',
    label: 'YourDreams.bio',
    description:
      '3D DNA visualization meets AI dream analysis',
    link: 'https://www.yourdreams.bio/',
    x: 75,
    y: 60,
    color: '#c4623a',
  },
  {
    id: 'yourlongevity',
    label: 'YourLongevity.bio',
    description:
      'AI-powered longevity tracking platform',
    link: 'https://www.yourlongevity.bio/dashboard',
    x: 28,
    y: 35,
    color: '#8b2020',
  },
  {
    id: 'denisbozhkov',
    label: 'Denis Bozhkov Art',
    description:
      'Procedural 3D canvas art and immersive digital gallery',
    link: 'https://denisbozhkov-art.com/',
    x: 55,
    y: 15,
    color: '#c4847a',
  },
];

// ---------------------------------------------------------------------------
// Filter presets (CSS filter simulations)
// ---------------------------------------------------------------------------
const filterPresets: Record<string, { label: string; filter: string; description: string }> = {
  normal: {
    label: 'Visible',
    filter: 'none',
    description: 'Standard visible-light composite',
  },
  infrared: {
    label: 'Infrared',
    filter: 'hue-rotate(180deg) saturate(1.5) brightness(1.1)',
    description: 'Simulated near-infrared view',
  },
  hydrogen: {
    label: 'H-Alpha',
    filter: 'hue-rotate(-30deg) saturate(2) contrast(1.2) brightness(0.9)',
    description: 'Simulated hydrogen-alpha emission',
  },
};

// ===========================================================================
// PAGE
// ===========================================================================
export default function ExplorePage() {
  const { t } = useLanguage();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('normal');
  const [zoom, setZoom] = useState(1);

  const filterPresetsLocal: Record<string, { label: string; filter: string; description: string }> = {
    normal: {
      label: t.explore.visible,
      filter: 'none',
      description: 'Standard visible-light composite',
    },
    infrared: {
      label: t.explore.infrared,
      filter: 'hue-rotate(180deg) saturate(1.5) brightness(1.1)',
      description: 'Simulated near-infrared view',
    },
    hydrogen: {
      label: t.explore.hAlpha,
      filter: 'hue-rotate(-30deg) saturate(2) contrast(1.2) brightness(0.9)',
      description: 'Simulated hydrogen-alpha emission',
    },
  };

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 0.25, 2.5));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 0.25, 1));
  }, []);

  const handleZoomReset = useCallback(() => {
    setZoom(1);
  }, []);

  const toggleHotspot = useCallback((id: string) => {
    setActiveHotspot((prev) => (prev === id ? null : id));
  }, []);

  return (
    <main className="flex flex-col">
      {/* =============================================================
          HERO / INTRO
          ============================================================= */}
      <section ref={heroRef} className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="/nebula-4k.jpg"
        >
          <source src="/cosmic-video-8-hd.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[#0a0a0f]/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/40 via-transparent to-[#0a0a0f]" />

        <motion.div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center"
          style={{ opacity: heroOpacity }}
        >
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-4 text-xs sm:text-sm tracking-[0.3em] uppercase text-[#2d8a8a]"
          >
            {t.explore.badge}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[-0.03em] text-white font-[family-name:var(--font-heading)] leading-[0.9]"
          >
            {t.explore.title}
            <br />
            <span className="gradient-text-nebula">{t.explore.title2}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-6 text-sm text-gray-400 max-w-md"
          >
            {t.explorePage.clickHotspots}
          </motion.p>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-[10px] tracking-[0.3em] uppercase text-gray-500">
                {t.explorePage.scrollToExplore}
              </span>
              <div className="h-8 w-[1px] bg-gradient-to-b from-gray-500 to-transparent" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* =============================================================
          INTERACTIVE NEBULA VIEWER
          ============================================================= */}
      <section className="relative min-h-screen bg-[#0a0a0f]">
        {/* Nebula info bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative z-30 flex flex-wrap items-center justify-center gap-3 py-6 px-6 text-center"
        >
          <span className="text-xs tracking-[0.2em] uppercase text-gray-500">Heaven Interactive</span>
          <span className="w-1 h-1 rounded-full bg-[#2d8a8a]/60" />
          <span className="text-xs tracking-[0.15em] text-gray-500">Sofia, Bulgaria</span>
          <span className="w-1 h-1 rounded-full bg-[#2d8a8a]/60" />
          <span className="text-xs tracking-[0.15em] text-gray-500">{t.explorePage.exploreUniverse}</span>
        </motion.div>

        {/* Main viewer container */}
        <div className="relative mx-auto max-w-7xl px-4 md:px-8 pb-24">
          <div className="relative rounded-2xl overflow-hidden border border-white/[0.06] bg-black/40">
            {/* Image container with zoom */}
            <div className="relative aspect-[16/10] md:aspect-[16/9] overflow-hidden">
              <motion.div
                animate={{ scale: zoom }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative w-full h-full origin-center"
              >
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover transition-[filter] duration-700 ease-out"
                  style={{
                    filter: filterPresetsLocal[activeFilter].filter,
                  }}
                  poster="/nebula-4k.jpg"
                >
                  <source src="/cosmic-video-ultimate.mp4" type="video/mp4" />
                </video>

                {/* Hotspots */}
                {hotspots.map((hotspot) => (
                  <Hotspot
                    key={hotspot.id}
                    hotspot={hotspot}
                    isActive={activeHotspot === hotspot.id}
                    onToggle={toggleHotspot}
                    zoom={zoom}
                  />
                ))}
              </motion.div>

              {/* Vignette overlay */}
              <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_120px_rgba(0,0,0,0.5)]" />
            </div>

            {/* Bottom toolbar */}
            <div className="relative z-30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 md:p-5 bg-black/60 backdrop-blur-xl border-t border-white/[0.06]">
              {/* Zoom controls */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] tracking-[0.2em] uppercase text-gray-500 mr-2 hidden sm:inline">
                  {t.explore.zoom}
                </span>
                <button
                  onClick={handleZoomOut}
                  disabled={zoom <= 1}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.06] text-gray-400 transition-all duration-200 hover:bg-white/[0.08] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Zoom out"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                  </svg>
                </button>
                <button
                  onClick={handleZoomReset}
                  className="flex h-8 min-w-[3rem] items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-gray-400 transition-all duration-200 hover:bg-white/[0.08] hover:text-white"
                  aria-label="Reset zoom"
                >
                  {Math.round(zoom * 100)}%
                </button>
                <button
                  onClick={handleZoomIn}
                  disabled={zoom >= 2.5}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.06] text-gray-400 transition-all duration-200 hover:bg-white/[0.08] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Zoom in"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14" />
                    <path d="M5 12h14" />
                  </svg>
                </button>
              </div>

              {/* Filter toggles */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] tracking-[0.2em] uppercase text-gray-500 mr-2 hidden sm:inline">
                  Filter
                </span>
                {Object.entries(filterPresetsLocal).map(([key, preset]) => (
                  <button
                    key={key}
                    onClick={() => setActiveFilter(key)}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs tracking-wider transition-all duration-300 ${
                      activeFilter === key
                        ? 'bg-[#2d8a8a]/20 text-[#2d8a8a] border border-[#2d8a8a]/30'
                        : 'bg-white/[0.04] text-gray-400 border border-white/[0.06] hover:bg-white/[0.08] hover:text-white'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Nebula AI badge */}
              <div className="hidden md:flex items-center gap-2 text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-[#2d8a8a] animate-pulse-glow" />
                <span className="text-[10px] tracking-[0.15em] uppercase">
                  {t.explore.poweredBy}
                </span>
              </div>
            </div>
          </div>

          {/* Active filter description */}
          <AnimatePresence mode="wait">
            <motion.p
              key={activeFilter}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="mt-4 text-center text-xs text-gray-500 tracking-wider"
            >
              {filterPresetsLocal[activeFilter].description}
            </motion.p>
          </AnimatePresence>
        </div>
      </section>

      {/* =============================================================
          FEATURE CALLOUTS (below the viewer)
          ============================================================= */}
      <section className="relative py-20 md:py-28">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[#2d8a8a]/[0.02] blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="mb-4 text-xs tracking-[0.3em] uppercase text-[#c4623a]">
              {t.explorePage.ourProjects}
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] font-[family-name:var(--font-heading)]">
              {t.explorePage.whatWereBuilding} <span className="gradient-text-nebula">{t.explorePage.building}</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotspots.map((hotspot, i) => (
              <motion.a
                key={hotspot.id}
                href={hotspot.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                className="group relative rounded-2xl glass glass-hover p-6 md:p-8 transition-colors duration-300 block"
              >
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-[rgba(45,138,138,0.05)] to-transparent" />
                <div className="relative z-10">
                  <div
                    className="mb-4 flex h-3 w-3 rounded-full"
                    style={{ backgroundColor: hotspot.color, boxShadow: `0 0 12px ${hotspot.color}60` }}
                  />
                  <h3 className="text-lg font-semibold tracking-tight text-white font-[family-name:var(--font-heading)] mb-2">
                    {hotspot.label}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {hotspot.description}
                  </p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* =============================================================
          CTA
          ============================================================= */}
      <section className="relative py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-[-0.03em] text-white font-[family-name:var(--font-heading)] mb-4">
              {t.explorePage.fascinatedByAI}
            </h2>
            <p className="text-base text-gray-400 leading-relaxed mb-8 max-w-xl mx-auto">
              {t.explorePage.fascinatedDesc}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/about">
                <motion.span
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 rounded-full bg-[#2d8a8a] px-7 py-3.5 text-sm font-semibold tracking-wider uppercase text-white transition-all duration-300 hover:bg-[#2d8a8a]/90 hover:shadow-[0_0_30px_rgba(45,138,138,0.3)]"
                >
                  {t.explorePage.learnMore}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </motion.span>
              </Link>
              <Link href="/contact">
                <motion.span
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-7 py-3.5 text-sm font-semibold tracking-wider uppercase text-gray-300 transition-all duration-300 hover:bg-white/[0.04] hover:border-white/20 hover:text-white"
                >
                  {t.explorePage.contactUs}
                </motion.span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </main>
  );
}

// ---------------------------------------------------------------------------
// Hotspot Component
// ---------------------------------------------------------------------------
function Hotspot({
  hotspot,
  isActive,
  onToggle,
  zoom,
}: {
  hotspot: (typeof hotspots)[number];
  isActive: boolean;
  onToggle: (id: string) => void;
  zoom: number;
}) {
  // Adjust info card scale inversely to zoom so it stays readable
  const cardScale = 1 / zoom;

  return (
    <div
      className="absolute z-20"
      style={{
        left: `${hotspot.x}%`,
        top: `${hotspot.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Pulsing dot -- always visible */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle(hotspot.id);
        }}
        className="relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 cursor-pointer group"
        aria-label={`View info about ${hotspot.label}`}
      >
        {/* Outer pulse ring */}
        <span
          className="absolute inset-0 rounded-full animate-ping opacity-30"
          style={{
            backgroundColor: hotspot.color,
            animationDuration: '2.5s',
          }}
        />
        {/* Middle glow ring */}
        <span
          className="absolute inset-1 md:inset-1.5 rounded-full opacity-40"
          style={{
            backgroundColor: hotspot.color,
            boxShadow: `0 0 20px ${hotspot.color}80, 0 0 40px ${hotspot.color}40`,
          }}
        />
        {/* Center dot */}
        <span
          className="relative w-3 h-3 md:w-3.5 md:h-3.5 rounded-full border-2 border-white/80 transition-transform duration-300 group-hover:scale-125"
          style={{ backgroundColor: hotspot.color }}
        />
      </button>

      {/* Info card */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 8 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute z-30 w-56 sm:w-64 md:w-72"
            style={{
              ...(hotspot.y > 45
                ? { bottom: '100%', marginBottom: 12 }
                : { top: '100%', marginTop: 12 }),
              left: hotspot.x > 60 ? 'auto' : hotspot.x < 30 ? '0' : '50%',
              right: hotspot.x > 60 ? '0' : 'auto',
              transform: `translateX(${hotspot.x > 60 ? '0' : hotspot.x < 30 ? '0' : '-50%'}) scale(${cardScale})`,
              transformOrigin: hotspot.y > 45
                ? (hotspot.x > 60 ? 'bottom right' : 'bottom left')
                : (hotspot.x > 60 ? 'top right' : 'top left'),
            }}
          >
            <div className="rounded-xl bg-[#0a0a0f]/95 backdrop-blur-xl border border-white/[0.08] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
              {/* Color accent line */}
              <div
                className="h-[2px] w-10 rounded-full mb-3"
                style={{ backgroundColor: hotspot.color }}
              />
              <a href={hotspot.link} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-white font-[family-name:var(--font-heading)] mb-2 hover:text-[#2d8a8a] transition-colors duration-200 block">
                {hotspot.label}
              </a>
              <p className="text-xs text-gray-400 leading-relaxed">
                {hotspot.description}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <a
                  href={hotspot.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] tracking-[0.15em] uppercase text-[#2d8a8a] hover:text-[#3aafaf] transition-colors duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  Visit Project
                </a>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggle(hotspot.id);
                  }}
                  className="text-[10px] tracking-[0.15em] uppercase text-gray-600 hover:text-gray-400 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
