'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../../i18n/LanguageContext';

// ---------------------------------------------------------------------------
// Artworks Data
// ---------------------------------------------------------------------------
const artworks = [
  {
    slug: 'the-ancient-rite',
    title: 'The Ancient Rite',
    description:
      'A dark mythological scene depicting a towering Slavic pagan deity wielding a spear amidst swirling smoke and fire. A stag with majestic antlers stands at the center, flanked by a veiled priestess in white and hooded figures bearing candles. The atmosphere is primordial and sacred -- a ritual frozen at the moment between worlds, where the boundary between mortal and divine dissolves into ember and shadow.',
    accent: '#c4623a',
  },
  {
    slug: 'the-starwanderer',
    title: 'The Starwanderer',
    description:
      'A colossal hooded figure walks alone across a barren alien landscape, leaning on a weathered staff. Stars are woven into the very fabric of its flowing cloak, and small moons orbit silently nearby. The horizon glows with a warm twilight that seems to belong to no known sun. A meditation on solitude, cosmic purpose, and the quiet majesty of beings who measure their journeys in light-years.',
    accent: '#4a9eff',
  },
  {
    slug: 'cathedral-of-the-eclipse',
    title: 'Cathedral of the Eclipse',
    description:
      'A skull-faced monolith merges with soaring gothic cathedral architecture, its stained-glass windows blazing with impossible color against the endless void. Astronauts drift weightlessly around the structure as a solar eclipse burns overhead like an angry eye. Sacred geometry meets deep space in a monument that could be tomb, temple, or both -- a cathedral built not by hands but by the gravity of forgotten prayers.',
    accent: '#8b2020',
  },
  {
    slug: 'prismatic-grazer',
    title: 'Prismatic Grazer',
    description:
      'A crystalline dinosaur-like creature grazes peacefully in a field of indigo grass beneath a sky crowned with concentric rainbows. Its body is translucent, constructed from interlocking geometric facets that catch and scatter light like a living prism. A gentle titan from a parallel evolution where beauty became the dominant survival trait, moving through its world with the grace of stained glass come alive.',
    accent: '#2d8a8a',
  },
  {
    slug: 'stellar-bloom',
    title: 'Stellar Bloom',
    description:
      'An ice-crystal flower unfurls in the absolute silence of deep space, connected to a distant sun by a river of golden particles. Its petals shimmer between cyan and white, refracting starlight into spectral ribbons. A moment of impossible beauty at the edge of a dying galaxy -- proof that even in the coldest reaches of existence, something within the universe still yearns to bloom.',
    accent: '#3aafaf',
  },
  {
    slug: 'digital-tide',
    title: 'Digital Tide',
    description:
      'A luminous teal wave made of wireframe grids crashes through a dark ocean under an infinite canopy of stars. The water itself is data, each droplet a coordinate in an endless computational mesh. Where nature\'s chaos meets algorithmic precision, a new kind of beauty emerges -- neither designed nor accidental, but something the mathematics of the universe always intended.',
    accent: '#2d8a8a',
  },
  {
    slug: 'data-forest',
    title: 'Data Forest',
    description:
      'Trees with bark of living shadow grow luminous cubic leaves that pulse with cyan light in an eternal digital twilight. The forest floor flows with currents of data, streams of information finding their way like water through roots. An ecosystem where organic life has merged irreversibly with computational substrate -- a place neither fully alive nor purely digital, but achingly beautiful in its liminal existence.',
    accent: '#4a9eff',
  },
  {
    slug: 'neural-blossom',
    title: 'Neural Blossom',
    description:
      'A bioluminescent tree of neurons branches upward into a violet cosmos, each synaptic node glowing with its own inner light. The structure is simultaneously anatomical and botanical -- a map of consciousness rendered as a living organism that grows from primordial darkness toward understanding. Every branch is a thought, every glow a memory, every root a dream not yet dreamed.',
    accent: '#c4847a',
  },
  {
    slug: 'orbital-harvest',
    title: 'Orbital Harvest',
    description:
      'Apples and stone fruits float in precise orbits around invisible gravitational centers, connected by spiraling golden threads that trace equations of desire. The barren landscape below speaks of entropy and endings, while the fruit above defies every law of decay. Newton\'s dream reimagined as surrealist poetry -- what if gravity was not a force but a form of longing?',
    accent: '#c4623a',
  },
];

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------
export default function ArtDetailPage() {
  const params = useParams<{ slug: string }>();
  const { t } = useLanguage();
  const slug = params.slug;

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
