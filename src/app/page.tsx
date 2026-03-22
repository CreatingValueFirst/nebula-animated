'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from 'framer-motion';

// ---------------------------------------------------------------------------
// Dynamic import: Remotion Player (no SSR)
// ---------------------------------------------------------------------------
const Player = dynamic(
  () => import('@remotion/player').then((mod) => ({ default: mod.Player })),
  { ssr: false }
);

// The Remotion composition -- created by a separate agent
import { NebulaComposition } from '../remotion/NebulaComposition';

// ---------------------------------------------------------------------------
// Animation Variants
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

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// ---------------------------------------------------------------------------
// Section Wrapper (scroll-triggered fade-up)
// ---------------------------------------------------------------------------
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
// Feature Card
// ---------------------------------------------------------------------------
function FeatureCard({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      whileHover={{ y: -4, transition: { duration: 0.25 } }}
      className="group relative rounded-2xl glass glass-hover p-8 md:p-10 transition-colors duration-300"
    >
      {/* Subtle glow on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-[#2d8a8a]/5 to-[#c4623a]/5" />

      <div className="relative z-10">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#2d8a8a]/10 text-[#2d8a8a]">
          {icon}
        </div>
        <h3 className="mb-3 text-xl font-semibold tracking-tight text-white font-[family-name:var(--font-heading)]">
          {title}
        </h3>
        <p className="text-[15px] leading-relaxed text-gray-400">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Gallery Tile
// ---------------------------------------------------------------------------
function GalleryTile({
  label,
  description,
  effect,
  index,
}: {
  label: string;
  description: string;
  effect: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });

  // Each tile applies a different CSS effect on hover
  const effectClasses: Record<string, string> = {
    zoom: 'group-hover:scale-110 transition-transform duration-700 ease-out',
    colorShift:
      'group-hover:[filter:hue-rotate(90deg)_saturate(1.4)] transition-[filter] duration-700 ease-out',
    blur: 'group-hover:[clip-path:inset(0%)] [clip-path:inset(10%_10%_10%_10%)] transition-[clip-path] duration-700 ease-out',
    particles: '',
  };

  return (
    <motion.div
      ref={ref}
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className="group relative aspect-[4/3] overflow-hidden rounded-2xl cursor-pointer"
    >
      {/* Image with effect */}
      <div className="absolute inset-0">
        <Image
          src="/nebula.jpg"
          alt={label}
          fill
          className={`object-cover ${effectClasses[effect] || ''}`}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>

      {/* Particle overlay for the particles tile */}
      {effect === 'particles' && (
        <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          {Array.from({ length: 30 }).map((_, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-white animate-twinkle"
              style={{
                width: `${1.5 + Math.random() * 2.5}px`,
                height: `${1.5 + Math.random() * 2.5}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Text */}
      <div className="absolute bottom-0 left-0 right-0 z-30 p-5 md:p-6">
        <h4 className="text-base font-semibold text-white mb-1 font-[family-name:var(--font-heading)]">
          {label}
        </h4>
        <p className="text-sm text-gray-300 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {description}
        </p>
      </div>

      {/* Hover border glow */}
      <div className="absolute inset-0 z-30 rounded-2xl border border-white/0 group-hover:border-[#2d8a8a]/30 transition-colors duration-500 pointer-events-none" />
    </motion.div>
  );
}

// ===========================================================================
// PAGE
// ===========================================================================
export default function Home() {
  // Parallax refs
  const parallaxRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: parallaxRef,
    offset: ['start end', 'end start'],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const parallaxOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.4, 1, 1, 0.4]);

  return (
    <main className="flex flex-col">
      {/* ================================================================
          HERO SECTION
          ================================================================ */}
      <section className="relative h-dvh w-full overflow-hidden">
        {/* Remotion Player -- fills hero */}
        <div className="remotion-player-container">
          <Player
            component={NebulaComposition}
            compositionWidth={1920}
            compositionHeight={1080}
            fps={30}
            durationInFrames={300}
            autoPlay
            loop
            style={{
              width: '100%',
              height: '100%',
            }}
            acknowledgeRemotionLicense
          />
        </div>

        {/* Gradient overlay -- transparent top, solid black bottom */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/30 via-transparent to-[#0a0a0f]" />

        {/* Floating Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 md:px-12 lg:px-16 py-6"
        >
          <a
            href="#"
            className="text-2xl font-bold tracking-[0.2em] text-white font-[family-name:var(--font-heading)]"
          >
            NEBULA
          </a>
          <div className="hidden sm:flex items-center gap-8">
            {['Explore', 'Gallery', 'About'].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="relative text-sm tracking-widest uppercase text-gray-300 hover:text-white transition-colors duration-300 after:absolute after:bottom-[-4px] after:left-0 after:h-[1px] after:w-0 after:bg-[#2d8a8a] hover:after:w-full after:transition-all after:duration-300"
              >
                {link}
              </a>
            ))}
          </div>
        </motion.nav>

        {/* Hero Text */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-4 text-xs sm:text-sm tracking-[0.3em] uppercase text-[#2d8a8a]"
          >
            Cinematic Space Visualization
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-[-0.03em] text-white font-[family-name:var(--font-heading)] leading-[0.9]"
          >
            ELEPHANT&apos;S
            <br />
            <span className="gradient-text-nebula">TRUNK</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="mt-6 max-w-md text-sm sm:text-base text-gray-400 leading-relaxed"
          >
            IC 1396 brought to life through programmatic animation.
            <br className="hidden sm:block" />
            Built with Remotion, Next.js, and Framer Motion.
          </motion.p>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.6 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-[10px] tracking-[0.3em] uppercase text-gray-500">
                Scroll
              </span>
              <div className="h-8 w-[1px] bg-gradient-to-b from-gray-500 to-transparent" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================================================================
          FEATURES SECTION
          ================================================================ */}
      <section id="explore" className="relative py-28 md:py-36 lg:py-44">
        {/* Subtle radial background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-[#2d8a8a]/[0.03] blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
          <AnimatedSection className="mb-16 md:mb-20 text-center">
            <p className="mb-4 text-xs tracking-[0.3em] uppercase text-[#2d8a8a]">
              Features
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] font-[family-name:var(--font-heading)]">
              <span className="gradient-text-nebula">Cinematic Space</span>
              <br />
              Animations
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <FeatureCard
              index={0}
              title="Remotion Powered"
              description="Programmatic video animations with React components. Write animations in code, render them as video or embed them live."
              icon={
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              }
            />
            <FeatureCard
              index={1}
              title="Deep Space Imagery"
              description="High-resolution nebula photography brought to life with layered parallax, animated overlays, and cinematic color grading."
              icon={
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="m4.93 4.93 1.41 1.41" />
                  <path d="m17.66 17.66 1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="m6.34 17.66-1.41 1.41" />
                  <path d="m19.07 4.93-1.41 1.41" />
                </svg>
              }
            />
            <FeatureCard
              index={2}
              title="Interactive Experience"
              description="Scroll-driven animations and parallax effects create depth. Every interaction is crafted to feel like exploring real space."
              icon={
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              }
            />
          </div>
        </div>
      </section>

      {/* ================================================================
          PARALLAX IMAGE SECTION
          ================================================================ */}
      <section
        ref={parallaxRef}
        className="relative h-[70vh] md:h-[80vh] overflow-hidden"
      >
        {/* Parallax image */}
        <motion.div
          className="absolute inset-[-20%] w-[140%] h-[140%]"
          style={{ y: parallaxY }}
        >
          <Image
            src="/nebula.jpg"
            alt="Elephant's Trunk Nebula"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </motion.div>

        {/* Darkening overlay */}
        <motion.div
          className="absolute inset-0 bg-black/40"
          style={{ opacity: parallaxOpacity }}
        />

        {/* Edge gradients for seamless blending */}
        <div className="absolute inset-0 z-10">
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#0a0a0f] to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
        </div>

        {/* Text overlay */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center">
          <AnimatedSection>
            <p className="mb-4 text-xs tracking-[0.3em] uppercase text-[#2d8a8a]/80">
              Deep Space Object
            </p>
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-[-0.03em] text-white font-[family-name:var(--font-heading)] leading-[1.05]">
              THE ELEPHANT&apos;S
              <br />
              TRUNK NEBULA
            </h2>
            <div className="mt-6 flex items-center justify-center gap-3 text-sm text-gray-300">
              <span className="font-medium">IC 1396</span>
              <span className="w-1 h-1 rounded-full bg-[#2d8a8a]" />
              <span>2,400 light-years from Earth</span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ================================================================
          GALLERY SECTION
          ================================================================ */}
      <section id="gallery" className="relative py-28 md:py-36 lg:py-44">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/4 w-[600px] h-[400px] rounded-full bg-[#c4623a]/[0.02] blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
          <AnimatedSection className="mb-16 md:mb-20 text-center">
            <p className="mb-4 text-xs tracking-[0.3em] uppercase text-[#c4623a]">
              Gallery
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] font-[family-name:var(--font-heading)]">
              Animation{' '}
              <span className="gradient-text-nebula">Techniques</span>
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <GalleryTile
              index={0}
              label="Zoom Effect"
              description="CSS transform scale driven by hover interaction"
              effect="zoom"
            />
            <GalleryTile
              index={1}
              label="Color Shift"
              description="Hue-rotate and saturation filter animation"
              effect="colorShift"
            />
            <GalleryTile
              index={2}
              label="Blur Reveal"
              description="Clip-path animation reveals hidden regions"
              effect="blur"
            />
            <GalleryTile
              index={3}
              label="Particle Overlay"
              description="Animated CSS dots simulating stellar particles"
              effect="particles"
            />
          </div>
        </div>
      </section>

      {/* ================================================================
          ABOUT SECTION
          ================================================================ */}
      <section id="about" className="relative py-28 md:py-36">
        <div className="relative z-10 mx-auto max-w-4xl px-6 md:px-12 text-center">
          <AnimatedSection>
            <p className="mb-4 text-xs tracking-[0.3em] uppercase text-[#4a9eff]">
              About
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] font-[family-name:var(--font-heading)] mb-8">
              Built for the{' '}
              <span className="gradient-text-nebula">Cosmos</span>
            </h2>
            <p className="text-base md:text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
              This project demonstrates how Remotion&apos;s programmatic video
              engine can be embedded directly in a Next.js application, creating
              interactive cinematic experiences. Every animation is driven by
              React components and Framer Motion, rendering at 30fps with
              real-time interactivity.
            </p>
          </AnimatedSection>

          {/* Tech badges */}
          <AnimatedSection delay={0.2} className="mt-12">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {[
                'Remotion',
                'Next.js',
                'Framer Motion',
                'Tailwind CSS',
                'TypeScript',
              ].map((tech) => (
                <span
                  key={tech}
                  className="glass rounded-full px-5 py-2 text-xs tracking-wider uppercase text-gray-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ================================================================
          FOOTER
          ================================================================ */}
      <footer className="relative border-t border-white/[0.04]">
        {/* Subtle gradient line along the top border */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#2d8a8a]/20 to-transparent" />

        <div className="mx-auto max-w-6xl px-6 md:px-12 py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm text-gray-500 text-center md:text-left">
              Built with{' '}
              <span className="text-gray-400">Remotion</span> +{' '}
              <span className="text-gray-400">Next.js</span> +{' '}
              <span className="text-gray-400">Framer Motion</span>
            </p>
            <div className="flex items-center gap-6">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-[#2d8a8a] transition-colors duration-300"
              >
                GitHub
              </a>
              <a
                href="https://www.remotion.dev/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-[#2d8a8a] transition-colors duration-300"
              >
                Remotion Docs
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
