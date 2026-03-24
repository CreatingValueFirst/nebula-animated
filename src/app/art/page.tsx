'use client';

import React, { useRef } from 'react';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '../../i18n/LanguageContext';
import CosmicVideo from '../../components/CosmicVideo';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from 'framer-motion';

// ---------------------------------------------------------------------------
// Animation helpers
// ---------------------------------------------------------------------------
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.12,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  }),
};

function AnimatedSection({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// ---------------------------------------------------------------------------
// Artworks Data
// ---------------------------------------------------------------------------
const artworks = [
  {
    slug: 'the-ancient-rite',
    imagePath: '/art/the-ancient-rite.png',
    title: 'The Ancient Rite',
    teaser: 'A primordial Slavic ceremony where fire, smoke, and antlered spirits converge.',
  },
  {
    slug: 'the-starwanderer',
    imagePath: '/art/the-starwanderer.png',
    title: 'The Starwanderer',
    teaser: 'A colossal hooded figure walks the edge of twilight, cloaked in stars.',
  },
  {
    slug: 'cathedral-of-the-eclipse',
    imagePath: '/art/cathedral-of-the-eclipse.png',
    title: 'Cathedral of the Eclipse',
    teaser: 'Gothic architecture meets deep space -- a skull monolith under a burning eclipse.',
  },
  {
    slug: 'prismatic-grazer',
    imagePath: '/art/prismatic-grazer.png',
    title: 'Prismatic Grazer',
    teaser: 'A crystalline titan grazes beneath concentric rainbows in a parallel evolution.',
  },
  {
    slug: 'stellar-bloom',
    imagePath: '/art/stellar-bloom.png',
    title: 'Stellar Bloom',
    teaser: 'An ice-crystal flower unfurls in deep space, refracting the light of a dying galaxy.',
  },
  {
    slug: 'digital-tide',
    imagePath: '/art/digital-tide.png',
    title: 'Digital Tide',
    teaser: 'A luminous wireframe wave crashes where nature meets algorithm.',
  },
  {
    slug: 'data-forest',
    imagePath: '/art/data-forest.png',
    title: 'Data Forest',
    teaser: 'Trees of shadow grow luminous cubic leaves in a merged organic-digital ecosystem.',
  },
  {
    slug: 'neural-blossom',
    imagePath: '/art/neural-blossom.png',
    title: 'Neural Blossom',
    teaser: 'A bioluminescent neuron tree branches into violet sky -- consciousness made botanical.',
  },
  {
    slug: 'orbital-harvest',
    imagePath: '/art/orbital-harvest.png',
    title: 'Orbital Harvest',
    teaser: 'Fruit orbits invisible gravitational centers -- Newton\'s dream as surrealist poetry.',
  },
];

// ===========================================================================
// PAGE
// ===========================================================================
export default function ArtPage() {
  const { t } = useLanguage();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <main className="flex flex-col">
      {/* =============================================================
          HERO
          ============================================================= */}
      <section ref={heroRef} className="relative h-[80vh] min-h-[600px] w-full overflow-hidden">
        {/* Parallax video background */}
        <motion.div className="absolute inset-[-10%] w-[120%] h-[120%]" style={{ y: heroY }}>
          <CosmicVideo
            baseName="cosmic-video-ultimate"
            poster="/nebula-4k.jpg"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </motion.div>

        {/* Overlays */}
        <div className="absolute inset-0 bg-[#0a0a0f]/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/40 via-transparent to-[#0a0a0f]" />

        {/* Hero content */}
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
            {t.art.badge}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-[-0.03em] text-white font-[family-name:var(--font-heading)] leading-[0.9]"
          >
            {t.art.title}
            <br />
            <span className="gradient-text-nebula">{t.art.title2}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-6 max-w-xl text-base sm:text-lg text-gray-400 leading-relaxed"
          >
            {t.art.subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="mt-8 h-[1px] w-16 bg-gradient-to-r from-transparent via-[#2d8a8a] to-transparent"
          />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-[10px] tracking-[0.3em] uppercase text-gray-500">
              {t.home.scroll}
            </span>
            <div className="h-8 w-[1px] bg-gradient-to-b from-gray-500 to-transparent" />
          </motion.div>
        </motion.div>
      </section>

      {/* =============================================================
          GALLERY COUNT
          ============================================================= */}
      <section className="relative py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <AnimatedSection className="text-center">
            <p className="text-xs tracking-[0.3em] uppercase text-gray-500">
              {artworks.length} {t.art.artworks}
            </p>
          </AnimatedSection>
          <div className="mt-12 h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        </div>
      </section>

      {/* =============================================================
          GALLERY GRID
          ============================================================= */}
      <section className="relative py-12 md:py-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-[#2d8a8a]/[0.03] blur-[120px]" />
          <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] rounded-full bg-[#c4623a]/[0.02] blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
          {/* Masonry-like 2-column layout */}
          <div className="columns-1 md:columns-2 gap-6 lg:gap-8">
            {artworks.map((artwork, i) => (
              <ArtworkCard key={artwork.slug} artwork={artwork} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* =============================================================
          CTA
          ============================================================= */}
      <section className="relative py-28 md:py-36">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[#2d8a8a]/[0.04] blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl px-6 md:px-12 text-center">
          <AnimatedSection>
            <p className="mb-4 text-xs tracking-[0.3em] uppercase text-[#c4623a]">
              {t.art.badge}
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] text-white font-[family-name:var(--font-heading)] mb-6">
              {t.artPage.interestedCollaboration}
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed mb-10 max-w-xl mx-auto">
              {t.artPage.collaborationDesc}
            </p>
            <Link href="/contact">
              <motion.span
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-3 rounded-full bg-[#2d8a8a] px-8 py-4 text-sm font-semibold tracking-wider uppercase text-white transition-all duration-300 hover:bg-[#2d8a8a]/90 hover:shadow-[0_0_30px_rgba(45,138,138,0.3)]"
              >
                {t.artPage.getInTouch}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </motion.span>
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Artwork Card Component
// ---------------------------------------------------------------------------
function ArtworkCard({
  artwork,
  index,
}: {
  artwork: (typeof artworks)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <motion.div
      ref={ref}
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className="mb-6 lg:mb-8 break-inside-avoid"
    >
      <Link href={`/art/${artwork.slug}`} className="block group">
        <motion.div
          whileHover={{ y: -8, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } }}
          className="relative rounded-2xl overflow-hidden glass glass-hover transition-all duration-500"
          style={{
            boxShadow: '0 0 0 1px rgba(255,255,255,0.04)',
          }}
        >
          {/* Hover glow border */}
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
            style={{
              boxShadow: '0 0 0 1px rgba(45,138,138,0.3), 0 0 40px rgba(45,138,138,0.08)',
            }}
          />

          {/* Image container */}
          <div className="relative w-full overflow-hidden">
            <div className="relative w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]">
              <Image
                src={artwork.imagePath}
                alt={artwork.title}
                width={800}
                height={800}
                className="w-full h-auto object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Subtle gradient overlay at bottom of image */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0a0a0f]/60 to-transparent pointer-events-none" />
          </div>

          {/* Text content */}
          <div className="relative p-6 md:p-8">
            <h3 className="text-lg md:text-xl font-semibold tracking-tight text-white font-[family-name:var(--font-heading)] mb-2 group-hover:text-[#2d8a8a] transition-colors duration-300">
              {artwork.title}
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              {artwork.teaser}
            </p>

            {/* View arrow */}
            <div className="mt-4 flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-gray-500 group-hover:text-[#2d8a8a] transition-colors duration-300">
              <span>{/* View */}</span>
              <motion.svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </motion.svg>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
