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
// Hotspot Data (static parts only - labels/descriptions come from t)
// ---------------------------------------------------------------------------
const hotspotConfigs = [
  { id: 'savemytime', link: 'https://savemytime.dev/', x: 38, y: 55, color: '#2d8a8a' },
  { id: 'livetranslations', link: 'https://livetranslations.video/', x: 62, y: 30, color: '#4a9eff' },
  { id: 'yourdreams', link: 'https://www.yourdreams.bio/', x: 75, y: 60, color: '#c4623a' },
  { id: 'yourlongevity', link: 'https://www.yourlongevity.bio/dashboard', x: 28, y: 35, color: '#8b2020' },
  { id: 'denisbozhkov', link: 'https://denisbozhkov-art.com/', x: 55, y: 15, color: '#c4847a' },
];

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

  const hotspots = hotspotConfigs.map((cfg) => {
    const labelMap: Record<string, string> = {
      savemytime: t.exploreData.hotspotSavemytimeLabel,
      livetranslations: t.exploreData.hotspotLivetranslationsLabel,
      yourdreams: t.exploreData.hotspotYourdreamsLabel,
      yourlongevity: t.exploreData.hotspotYourlongevityLabel,
      denisbozhkov: t.exploreData.hotspotDenisbozhkovLabel,
    };
    const descMap: Record<string, string> = {
      savemytime: t.exploreData.hotspotSavemytimeDesc,
      livetranslations: t.exploreData.hotspotLivetranslationsDesc,
      yourdreams: t.exploreData.hotspotYourdreamsDesc,
      yourlongevity: t.exploreData.hotspotYourlongevityDesc,
      denisbozhkov: t.exploreData.hotspotDenisbozhkovDesc,
    };
    return { ...cfg, label: labelMap[cfg.id], description: descMap[cfg.id] };
  });

  const filterPresetsLocal: Record<string, { label: string; filter: string; description: string }> = {
    normal: {
      label: t.explore.visible,
      filter: 'none',
      description: t.exploreData.filterDescNormal,
    },
    infrared: {
      label: t.explore.infrared,
      filter: 'hue-rotate(180deg) saturate(1.5) brightness(1.1)',
      description: t.exploreData.filterDescInfrared,
    },
    hydrogen: {
      label: t.explore.hAlpha,
      filter: 'hue-rotate(-30deg) saturate(2) contrast(1.2) brightness(0.9)',
      description: t.exploreData.filterDescHydrogen,
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
            <div className="relative aspect-[16/10] md:aspect-[16/9] overflow-hidden rounded-t-2xl">
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

            {/* Hotspot info bar - between image and toolbar, works on all sizes */}
            <AnimatePresence>
              {activeHotspot && (() => {
                const h = hotspots.find((hs) => hs.id === activeHotspot);
                if (!h) return null;
                return (
                  <motion.div
                    key={activeHotspot}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-white/[0.08] px-4 md:px-6 py-3 md:py-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 md:gap-4 min-w-0">
                          <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: h.color }} />
                          <div className="min-w-0">
                            <a href={h.link} target="_blank" rel="noopener noreferrer" className="text-sm md:text-base font-semibold text-white font-[family-name:var(--font-heading)] hover:text-[#2d8a8a] transition-colors block">
                              {h.label}
                            </a>
                            <p className="text-xs md:text-sm text-gray-400">{h.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 md:gap-4 shrink-0">
                          <a href={h.link} target="_blank" rel="noopener noreferrer" className="text-[10px] md:text-xs tracking-[0.15em] uppercase text-[#2d8a8a] font-semibold hover:text-[#3aafaf] transition-colors" onClick={(e) => e.stopPropagation()}>
                            {t.exploreData.visitProject}
                          </a>
                          <button onClick={() => setActiveHotspot(null)} className="text-gray-600 hover:text-gray-400 transition-colors">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })()}
            </AnimatePresence>

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
                  {t.exploreData.filterLabel}
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
}: {
  hotspot: { id: string; label: string; description: string; link: string; x: number; y: number; color: string };
  isActive: boolean;
  onToggle: (id: string) => void;
  zoom?: number;
}) {

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

      {/* Info shown via the info bar below the image */}
    </div>
  );
}
