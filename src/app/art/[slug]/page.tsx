'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../../i18n/LanguageContext';

// ---------------------------------------------------------------------------
// Artworks static config (titles + descriptions come from translations)
// ---------------------------------------------------------------------------
const artworkConfigs = [
  { slug: 'the-ancient-rite', accent: '#c4623a' },
  { slug: 'the-starwanderer', accent: '#4a9eff' },
  { slug: 'cathedral-of-the-eclipse', accent: '#8b2020' },
  { slug: 'prismatic-grazer', accent: '#2d8a8a' },
  { slug: 'stellar-bloom', accent: '#3aafaf' },
  { slug: 'digital-tide', accent: '#2d8a8a' },
  { slug: 'data-forest', accent: '#4a9eff' },
  { slug: 'neural-blossom', accent: '#c4847a' },
  { slug: 'orbital-harvest', accent: '#c4623a' },
];

function getDetailArtworks(t: ReturnType<typeof useLanguage>['t']) {
  const data: Record<string, { title: string; description: string }> = {
    'the-ancient-rite': { title: t.artworksData.theAncientRiteTitle, description: t.artworksData.theAncientRiteDesc },
    'the-starwanderer': { title: t.artworksData.theStarwandererTitle, description: t.artworksData.theStarwandererDesc },
    'cathedral-of-the-eclipse': { title: t.artworksData.cathedralOfTheEclipseTitle, description: t.artworksData.cathedralOfTheEclipseDesc },
    'prismatic-grazer': { title: t.artworksData.prismaticGrazerTitle, description: t.artworksData.prismaticGrazerDesc },
    'stellar-bloom': { title: t.artworksData.stellarBloomTitle, description: t.artworksData.stellarBloomDesc },
    'digital-tide': { title: t.artworksData.digitalTideTitle, description: t.artworksData.digitalTideDesc },
    'data-forest': { title: t.artworksData.dataForestTitle, description: t.artworksData.dataForestDesc },
    'neural-blossom': { title: t.artworksData.neuralBlossomTitle, description: t.artworksData.neuralBlossomDesc },
    'orbital-harvest': { title: t.artworksData.orbitalHarvestTitle, description: t.artworksData.orbitalHarvestDesc },
  };
  return artworkConfigs.map((cfg) => ({
    ...cfg,
    title: data[cfg.slug].title,
    description: data[cfg.slug].description,
  }));
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------
export default function ArtDetailPage() {
  const params = useParams<{ slug: string }>();
  const { t } = useLanguage();
  const slug = params.slug;

  const artworks = getDetailArtworks(t);
  const currentIndex = artworks.findIndex((a) => a.slug === slug);
  const artwork = currentIndex !== -1 ? artworks[currentIndex] : null;

  const prevArtwork = currentIndex > 0 ? artworks[currentIndex - 1] : null;
  const nextArtwork =
    currentIndex < artworks.length - 1 ? artworks[currentIndex + 1] : null;

  // Not found state
  if (!artwork) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[80vh] px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl sm:text-5xl font-bold tracking-[-0.03em] text-white font-[family-name:var(--font-heading)] mb-4">
            {t.artPage.artworkNotFound}
          </h1>
          <p className="text-gray-400 mb-8">
            {t.artPage.artworkNotFoundDesc}
          </p>
          <Link href="/art">
            <motion.span
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-full bg-[#2d8a8a] px-7 py-3.5 text-sm font-semibold tracking-wider uppercase text-white transition-all duration-300 hover:bg-[#2d8a8a]/90 hover:shadow-[0_0_30px_rgba(45,138,138,0.3)]"
            >
              {t.art.backToGallery}
            </motion.span>
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen">
      {/* ================================================================
          Top Navigation Bar
          ================================================================ */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative z-30 flex items-center justify-between px-6 md:px-12 py-6"
      >
        <Link
          href="/art"
          className="group inline-flex items-center gap-2 text-sm text-gray-400 transition-colors duration-300 hover:text-white"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-300 group-hover:-translate-x-1"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          <span className="tracking-wider uppercase text-xs">
            {t.art.backToGallery}
          </span>
        </Link>

        <span className="text-[10px] tracking-[0.3em] uppercase text-gray-600">
          {currentIndex + 1} / {artworks.length}
        </span>
      </motion.div>

      {/* ================================================================
          Hero Image -- Full-Screen Museum Display
          ================================================================ */}
      <section className="relative flex-1 flex items-center justify-center px-6 md:px-12 pb-8">
        {/* Background radial glow matching artwork accent */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 50% at 50% 40%, ${artwork.accent}08 0%, transparent 70%)`,
          }}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={artwork.slug}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative w-full max-w-5xl mx-auto"
          >
            {/* Image Frame with Museum Glow */}
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                boxShadow: `
                  0 0 80px ${artwork.accent}15,
                  0 0 160px ${artwork.accent}08,
                  0 25px 50px rgba(0, 0, 0, 0.5),
                  0 0 0 1px rgba(255, 255, 255, 0.04)
                `,
              }}
            >
              {/* Subtle inner border glow */}
              <div
                className="absolute inset-0 z-10 pointer-events-none rounded-2xl"
                style={{
                  boxShadow: `inset 0 0 60px ${artwork.accent}06`,
                  border: `1px solid rgba(255, 255, 255, 0.05)`,
                }}
              />

              {/* Image Container */}
              <div className="relative aspect-[4/3] md:aspect-[16/10] bg-black/40">
                <Image
                  src={`/art/${artwork.slug}.png`}
                  alt={artwork.title}
                  fill
                  priority
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1024px"
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ================================================================
          Artwork Info -- Title & Description
          ================================================================ */}
      <section className="relative px-6 md:px-12 pb-16 md:pb-24">
        {/* Subtle divider accent */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mx-auto mb-10 h-[1px] max-w-md origin-center"
          style={{
            background: `linear-gradient(90deg, transparent, ${artwork.accent}40, transparent)`,
          }}
        />

        <div className="mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mb-3 text-[10px] tracking-[0.4em] uppercase"
            style={{ color: artwork.accent }}
          >
            {t.art.badge}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] text-white font-[family-name:var(--font-heading)] leading-[1.1] mb-8"
          >
            {artwork.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="text-base sm:text-lg text-gray-400 leading-[1.8] sm:leading-[1.9] tracking-wide"
            style={{ fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif' }}
          >
            {artwork.description}
          </motion.p>
        </div>
      </section>

      {/* ================================================================
          Previous / Next Navigation
          ================================================================ */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="relative border-t border-white/[0.06]"
      >
        <div className="mx-auto max-w-5xl grid grid-cols-2">
          {/* Previous */}
          <div className="border-r border-white/[0.06]">
            {prevArtwork ? (
              <Link
                href={`/art/${prevArtwork.slug}`}
                className="group flex flex-col gap-2 p-6 md:p-10 transition-colors duration-300 hover:bg-white/[0.02]"
              >
                <span className="text-[10px] tracking-[0.3em] uppercase text-gray-600 group-hover:text-gray-400 transition-colors duration-300">
                  {t.artPage.previous}
                </span>
                <span className="flex items-center gap-2">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-600 group-hover:text-white transition-all duration-300 group-hover:-translate-x-1 shrink-0"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                  <span className="text-sm sm:text-base font-semibold text-gray-300 group-hover:text-white transition-colors duration-300 font-[family-name:var(--font-heading)] truncate">
                    {prevArtwork.title}
                  </span>
                </span>
              </Link>
            ) : (
              <div className="p-6 md:p-10" />
            )}
          </div>

          {/* Next */}
          <div>
            {nextArtwork ? (
              <Link
                href={`/art/${nextArtwork.slug}`}
                className="group flex flex-col items-end gap-2 p-6 md:p-10 transition-colors duration-300 hover:bg-white/[0.02]"
              >
                <span className="text-[10px] tracking-[0.3em] uppercase text-gray-600 group-hover:text-gray-400 transition-colors duration-300">
                  {t.artPage.next}
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-semibold text-gray-300 group-hover:text-white transition-colors duration-300 font-[family-name:var(--font-heading)] truncate">
                    {nextArtwork.title}
                  </span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-600 group-hover:text-white transition-all duration-300 group-hover:translate-x-1 shrink-0"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </span>
              </Link>
            ) : (
              <div className="p-6 md:p-10" />
            )}
          </div>
        </div>
      </motion.section>
    </main>
  );
}
