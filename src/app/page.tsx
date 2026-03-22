'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';

// ---------------------------------------------------------------------------
// Dynamic import: Remotion Player (no SSR)
// ---------------------------------------------------------------------------
const Player = dynamic(
  () => import('@remotion/player').then((mod) => ({ default: mod.Player })),
  { ssr: false }
);

import { CosmicComposition } from '../remotion/CosmicComposition';

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
      delay: i * 0.1,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  }),
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
// Animated Counter
// ---------------------------------------------------------------------------
function AnimatedStat({
  value,
  label,
  index,
}: {
  value: string;
  label: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className="flex flex-col items-center text-center"
    >
      <span className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] text-white font-[family-name:var(--font-heading)]">
        {value}
      </span>
      <span className="mt-2 text-xs sm:text-sm tracking-[0.15em] uppercase text-gray-500">
        {label}
      </span>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Service Card
// ---------------------------------------------------------------------------
const serviceIcons = [
  (
    <svg key="nf" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a4 4 0 0 1 4 4c0 1.95-1.4 3.58-3.25 3.93" />
      <path d="M8.24 4.35A4 4 0 0 1 12 2" />
      <path d="M5 8a4 4 0 0 1 3.24-3.93" />
      <path d="M5 8a4 4 0 0 0-.67 6.41" />
      <path d="M9.13 17.34a4 4 0 0 1-4.8-2.93" />
      <path d="M12 18a4 4 0 0 1-2.87-.66" />
      <path d="M14.87 17.34A4 4 0 0 0 12 18" />
      <path d="M19.67 14.41a4 4 0 0 1-4.8 2.93" />
      <path d="M19 8a4 4 0 0 1 .67 6.41" />
      <path d="M19 8a4 4 0 0 0-3.24-3.93" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  (
    <svg key="vc" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  ),
  (
    <svg key="vn" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  (
    <svg key="ds" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  ),
  (
    <svg key="cp" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
      <line x1="14" y1="4" x2="10" y2="20" />
    </svg>
  ),
  (
    <svg key="qm" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
      <path d="m15 5 4 4" />
    </svg>
  ),
];

function ServiceCard({
  title,
  description,
  href,
  icon,
  index,
  learnMoreLabel,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  index: number;
  learnMoreLabel: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <motion.div
      ref={ref}
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      whileHover={{ y: -6, transition: { duration: 0.3, ease: 'easeOut' } }}
      className="group relative"
    >
      <Link href={href} className="block">
        <div className="relative rounded-2xl glass glass-hover p-8 md:p-10 transition-all duration-500 h-full">
          {/* Hover glow */}
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-[#2d8a8a]/[0.06] to-[#4a9eff]/[0.03]" />

          {/* Hover shadow lift */}
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none shadow-[0_8px_32px_rgba(45,138,138,0.08),0_2px_8px_rgba(0,0,0,0.12)]" />

          <div className="relative z-10">
            {/* Icon */}
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#2d8a8a]/10 text-[#2d8a8a] transition-colors duration-300 group-hover:bg-[#2d8a8a]/15 group-hover:text-[#3aafaf]">
              {icon}
            </div>

            {/* Title */}
            <h3 className="mb-3 text-xl font-semibold tracking-tight text-white font-[family-name:var(--font-heading)] group-hover:text-white transition-colors duration-300">
              {title}
            </h3>

            {/* Description */}
            <p className="text-[15px] leading-relaxed text-gray-400 mb-5">
              {description}
            </p>

            {/* Learn More */}
            <span className="inline-flex items-center gap-1.5 text-[13px] font-medium tracking-wide text-[#2d8a8a] opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:gap-2.5">
              {learnMoreLabel}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Testimonial Card
// ---------------------------------------------------------------------------
const testimonials = [
  {
    quote: "Heaven Interactive transformed our data pipeline. Their Neural Forge platform reduced our model training time by 73% while dramatically improving accuracy. The ROI was visible within the first month.",
    name: 'Nikolay Dimitrov',
    role: 'CTO at TechCorp - Sofia, Bulgaria',
    initials: 'ND',
  },
  {
    quote: "The Voice Cosmos agents handle 85% of our support calls autonomously now. Our customers can't tell the difference -- in fact, satisfaction scores went up. That's the definition of AI done right.",
    name: 'Aleksandar Petrov',
    role: 'VP Engineering at DataFlow - Sofia, Bulgaria',
    initials: 'AP',
  },
  {
    quote: "Working with the Quantum Mind consulting team was a masterclass in AI strategy. They helped us identify $2.4M in efficiency gains we were completely blind to before.",
    name: 'Maria Ivanova',
    role: 'Director of AI at CloudScale - Sofia, Bulgaria',
    initials: 'MI',
  },
];

function TestimonialCard({
  quote,
  name,
  role,
  initials,
  index,
}: {
  quote: string;
  name: string;
  role: string;
  initials: string;
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
      className="relative rounded-2xl glass p-8 md:p-10"
    >
      {/* Quote mark */}
      <div className="mb-6 text-[#2d8a8a]/30 text-5xl font-serif leading-none select-none">&ldquo;</div>

      <p className="text-[15px] md:text-base leading-relaxed text-gray-300 mb-8">
        {quote}
      </p>

      <div className="flex items-center gap-4">
        {/* Avatar placeholder */}
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2d8a8a]/10 text-[13px] font-semibold tracking-wider text-[#2d8a8a]">
          {initials}
        </div>
        <div>
          <p className="text-sm font-medium text-white">{name}</p>
          <p className="text-[13px] text-gray-500">{role}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ===========================================================================
// PAGE
// ===========================================================================
export default function Home() {
  const { t } = useLanguage();

  const services = [
    { title: t.services.neuralForge, description: t.services.neuralForgeDesc, href: '/services/neural-forge', icon: serviceIcons[0] },
    { title: t.services.voiceCosmos, description: t.services.voiceCosmosDesc, href: '/services/voice-cosmos', icon: serviceIcons[1] },
    { title: t.services.visionNebula, description: t.services.visionNebulaDesc, href: '/services/vision-nebula', icon: serviceIcons[2] },
    { title: t.services.dataSingularity, description: t.services.dataSingularityDesc, href: '/services/data-singularity', icon: serviceIcons[3] },
    { title: t.services.codePulsar, description: t.services.codePulsarDesc, href: '/services/code-pulsar', icon: serviceIcons[4] },
    { title: t.services.quantumMind, description: t.services.quantumMindDesc, href: '/services/quantum-mind', icon: serviceIcons[5] },
  ];

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
        {/* Background Video - Runway Gen-4 cosmic animation */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          // @ts-expect-error -- fetchPriority is valid HTML on video but missing from React's VideoHTMLAttributes
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover"
          poster="/nebula-4k.jpg"
        >
          <source src="/cosmic-video-11.mp4" type="video/mp4" />
        </video>

        {/* Gradient overlay - clean cinematic fade */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/50 via-transparent to-[#0a0a0f]" />

        {/* Subtle animated star particles over video */}
        <div className="absolute inset-0 z-[6] pointer-events-none">
          {Array.from({ length: 40 }).map((_, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-white animate-twinkle"
              style={{
                width: `${1 + (i % 3)}px`,
                height: `${1 + (i % 3)}px`,
                left: `${(i * 17 + 13) % 100}%`,
                top: `${(i * 23 + 7) % 100}%`,
                animationDelay: `${(i * 0.37) % 5}s`,
                animationDuration: `${2.5 + (i % 3)}s`,
                opacity: 0.4 + (i % 5) * 0.12,
              }}
            />
          ))}
        </div>

        {/* Hero Text */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center">
          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-5 text-xs sm:text-sm tracking-[0.3em] uppercase text-[#2d8a8a]"
          >
            {t.hero.tagline}
          </motion.p>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-[-0.04em] text-white font-[family-name:var(--font-heading)] leading-[0.9]"
          >
            {t.hero.headline1}
            <br />
            <span className="gradient-text-nebula">{t.hero.headline2}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="mt-6 max-w-lg text-base sm:text-lg text-gray-400 leading-relaxed"
          >
            {t.hero.subtitle}
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.35 }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4"
          >
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-full bg-[#2d8a8a] px-8 py-3.5 text-sm font-medium tracking-wider uppercase text-white transition-all duration-300 hover:bg-[#3aafaf] hover:shadow-[0_0_24px_rgba(45,138,138,0.3),0_0_48px_rgba(45,138,138,0.1)] active:scale-[0.98]"
            >
              {t.hero.exploreServices}
              <svg
                width="16"
                height="16"
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
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-8 py-3.5 text-sm font-medium tracking-wider uppercase text-gray-300 transition-all duration-300 hover:border-white/20 hover:text-white hover:bg-white/[0.04] active:scale-[0.98]"
            >
              {t.hero.seeDemo}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </Link>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.7 }}
            className="mt-16 sm:mt-20 flex items-center gap-8 sm:gap-14"
          >
            {[
              { value: '99.7%', label: t.hero.accuracy },
              { value: '50ms', label: t.hero.latency },
              { value: '1B+', label: t.hero.parameters },
            ].map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-8 sm:gap-14">
                {i > 0 && (
                  <div className="h-8 w-[1px] bg-white/10 -ml-8 sm:-ml-14" />
                )}
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-white font-[family-name:var(--font-heading)] tracking-tight">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-[10px] sm:text-xs tracking-[0.2em] uppercase text-gray-500">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 2.0 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
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
          SERVICES SECTION
          ================================================================ */}
      <section className="relative py-28 md:py-36 lg:py-44">
        {/* Radial glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px] rounded-full bg-[#2d8a8a]/[0.03] blur-[140px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
          <AnimatedSection className="mb-16 md:mb-20 text-center">
            <p className="mb-4 text-xs tracking-[0.3em] uppercase text-[#2d8a8a]">
              {t.services.title}
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] font-[family-name:var(--font-heading)]">
              Intelligence at{' '}
              <span className="gradient-text-nebula">Every Scale</span>
            </h2>
            <p className="mt-5 mx-auto max-w-xl text-base text-gray-400 leading-relaxed">
              {t.services.subtitle}
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service, i) => (
              <ServiceCard key={service.title} {...service} index={i} learnMoreLabel={t.services.learnMore} />
            ))}
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
        {/* Parallax video background */}
        <motion.div
          className="absolute inset-[-20%] w-[140%] h-[140%]"
          style={{ y: parallaxY }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            poster="/nebula-4k.jpg"
          >
            <source src="/cosmic-video-9.mp4" type="video/mp4" />
          </video>
        </motion.div>

        {/* Darkening overlay */}
        <motion.div
          className="absolute inset-0 bg-black/40"
          style={{ opacity: parallaxOpacity }}
        />

        {/* Edge gradients for seamless blending */}
        <div className="absolute inset-0 z-10">
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#0a0a0f] to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
        </div>

        {/* Text overlay */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center">
          <AnimatedSection>
            <p className="mb-4 text-xs tracking-[0.3em] uppercase text-[#2d8a8a]/80">
              {t.parallax.badge}
            </p>
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-[-0.03em] text-white font-[family-name:var(--font-heading)] leading-[1.05]">
              {t.parallax.title1}
              <br />
              <span className="gradient-text-nebula">{t.parallax.title2}</span>
            </h2>
          </AnimatedSection>

          {/* Stats */}
          <AnimatedSection delay={0.3} className="mt-12 md:mt-16">
            <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-16 md:gap-20">
              <AnimatedStat value="500+" label={t.parallax.modelsDeployed} index={0} />
              <AnimatedStat value="99.9%" label={t.parallax.uptimeSla} index={1} />
              <AnimatedStat value="42" label={t.parallax.countriesServed} index={2} />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ================================================================
          TESTIMONIALS SECTION
          ================================================================ */}
      <section className="relative py-28 md:py-36 lg:py-44">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[400px] rounded-full bg-[#c4623a]/[0.02] blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
          <AnimatedSection className="mb-16 md:mb-20 text-center">
            <p className="mb-4 text-xs tracking-[0.3em] uppercase text-[#c4623a]">
              {t.testimonials.title}
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] font-[family-name:var(--font-heading)]">
              Trusted by{' '}
              <span className="gradient-text-nebula">Leaders</span>
            </h2>
            <p className="mt-5 mx-auto max-w-xl text-base text-gray-400 leading-relaxed">
              {t.testimonials.subtitle}
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((item, i) => (
              <TestimonialCard key={item.name} {...item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          CTA SECTION
          ================================================================ */}
      <section className="relative py-24 md:py-32 lg:py-40 overflow-hidden">
        {/* Background nebula image */}
        <div className="absolute inset-0">
          <Image
            src="/nebula-4k.jpg"
            alt=""
            fill
            className="object-cover opacity-[0.06]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-transparent to-[#0a0a0f]" />
        </div>

        {/* Glowing orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#2d8a8a]/[0.04] blur-[100px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 md:px-12 text-center">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] text-white font-[family-name:var(--font-heading)] leading-tight">
              {t.cta.title}
            </h2>
            <p className="mt-6 mx-auto max-w-lg text-base md:text-lg text-gray-400 leading-relaxed">
              {t.cta.subtitle}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2.5 rounded-full bg-[#2d8a8a] px-10 py-4 text-sm font-medium tracking-wider uppercase text-white transition-all duration-300 hover:bg-[#3aafaf] hover:shadow-[0_0_30px_rgba(45,138,138,0.35),0_0_60px_rgba(45,138,138,0.12)] active:scale-[0.98] animate-pulse-glow"
              >
                {t.cta.button}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-sm tracking-wider uppercase text-gray-400 hover:text-[#2d8a8a] transition-colors duration-300"
              >
                {t.cta.viewAll}
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
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
