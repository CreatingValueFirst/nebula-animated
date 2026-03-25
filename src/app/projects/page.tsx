'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from 'framer-motion';
import { useLanguage } from '../../i18n/LanguageContext';

// ---------------------------------------------------------------------------
// Animation helpers
// ---------------------------------------------------------------------------
const ease = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

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
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Animated Counter (count-up on scroll into view)
// ---------------------------------------------------------------------------
function AnimatedCounter({
  target,
  suffix = '',
  duration = 1.8,
}: {
  target: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const startTime = performance.now();

    function step(now: number) {
      const progress = Math.min((now - startTime) / (duration * 1000), 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(eased * target);
      setCount(start);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }, [isInView, target, duration]);

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, ease }}
    >
      {count}{suffix}
    </motion.span>
  );
}

// ---------------------------------------------------------------------------
// Inline SVG Icons (no external dependencies)
// ---------------------------------------------------------------------------
const icons = {
  microphone: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="22" />
    </svg>
  ),
  video: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 8-6 4 6 4V8Z" />
      <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
    </svg>
  ),
  dna: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 15c6.667-6 13.333 0 20-6" />
      <path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993" />
      <path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993" />
      <path d="M17 6l-2.5 2.5" />
      <path d="M14 8l-1 1" />
      <path d="M7 18l2.5-2.5" />
      <path d="M3.5 14.5l.5-.5" />
      <path d="M20 9l.5-.5" />
      <path d="M6.5 12.5l1-1" />
      <path d="M16.5 10.5l1-1" />
      <path d="M10 16l1.5-1.5" />
    </svg>
  ),
  heart: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  ),
  palette: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r="0.5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r="0.5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2Z" />
    </svg>
  ),
  shoppingCart: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  ),
  zap: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
    </svg>
  ),
  layoutDashboard: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  ),
  building: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  ),
  externalLink: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </svg>
  ),
  arrow: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  ),
};

// ---------------------------------------------------------------------------
// Project Data
// ---------------------------------------------------------------------------
interface Project {
  name: string;
  category: string;
  description: string;
  results: string[];
  tags: string[];
  impact: string;
  url: string;
  featured: boolean;
  icon: React.ReactNode;
  color: string;
  colorHex: string;
}

const projects: Project[] = [
  {
    name: 'SaveMyTime AI Lab',
    category: 'Voice AI',
    description:
      'Full-stack AI voice platform enabling businesses to deploy intelligent conversational agents that handle calls, bookings, and customer support in multiple languages.',
    results: [
      'Automated 85% of inbound customer calls',
      'Sub-100ms voice response latency',
      '29+ languages supported natively',
    ],
    tags: ['Next.js', 'ElevenLabs API', 'Voice AI', 'PWA'],
    impact: 'Reduced client support costs by 60% within the first month of deployment.',
    url: 'https://savemytime.dev/',
    featured: true,
    icon: icons.microphone,
    color: 'emerald',
    colorHex: '#10b981',
  },
  {
    name: 'LiveTranslations',
    category: 'AI Video',
    description:
      'AI-powered video dubbing and translation platform that preserves the original speaker\'s voice, tone, and emotion across 29+ languages with studio-quality output.',
    results: [
      'Studio-quality AI voice synthesis',
      '29+ language pairs available',
      'Integrated Stripe billing with usage tiers',
    ],
    tags: ['Next.js', 'ElevenLabs API', 'AI Voice Synthesis', 'Stripe'],
    impact: 'Enabled content creators to reach global audiences without re-recording.',
    url: 'https://livetranslations.video/',
    featured: true,
    icon: icons.video,
    color: 'amber',
    colorHex: '#f59e0b',
  },
  {
    name: 'YourDreams.bio',
    category: 'Biotech AI',
    description:
      'Immersive 3D biotech visualization platform combining AI dream analysis with interactive WebGL rendering, creating a unique intersection of neuroscience and technology.',
    results: [
      'Real-time 3D DNA visualization with WebGL',
      'AI-powered dream pattern analysis',
      'Interactive React Three Fiber experience',
    ],
    tags: ['Next.js 16', 'React Three Fiber', 'WebGL', '3D Rendering'],
    impact: 'Pioneered a new category of biotech-meets-AI consumer experiences.',
    url: 'https://www.yourdreams.bio/',
    featured: true,
    icon: icons.dna,
    color: 'cyan',
    colorHex: '#06b6d4',
  },
  {
    name: 'YourLongevity.bio',
    category: 'Health AI',
    description:
      'Personalized health analytics dashboard powered by AI that tracks biomarkers, lifestyle patterns, and delivers actionable longevity insights with predictive modeling.',
    results: [
      'AI-driven biomarker trend analysis',
      'Personalized longevity score algorithm',
      'Real-time health data sync & visualization',
    ],
    tags: ['Next.js 14', 'TypeScript', 'Zustand', 'AI Analytics'],
    impact: 'Empowered users to make data-driven health decisions with AI precision.',
    url: 'https://www.yourlongevity.bio/dashboard',
    featured: true,
    icon: icons.heart,
    color: 'rose',
    colorHex: '#f43f5e',
  },
  {
    name: 'Ratrix',
    category: 'E-commerce',
    description:
      'Professional B2B e-commerce platform for pest control and HACCP compliance services, featuring product catalogs, quote engines, and multi-language support.',
    results: [
      'Full product catalog with filtering',
      'B2B quote request system',
      'Multi-language SEO optimization',
    ],
    tags: ['Custom E-commerce', 'B2B Platform'],
    impact: 'Increased qualified B2B leads by 340% through optimized digital presence.',
    url: 'https://ratrix.eu/',
    featured: false,
    icon: icons.shoppingCart,
    color: 'purple',
    colorHex: '#a855f7',
  },
  {
    name: 'Business Outreach Optimizer',
    category: 'Automation',
    description:
      'Intelligent campaign management platform with real-time email analytics, automated follow-up sequences, and AI-powered lead scoring for B2B outreach at scale.',
    results: [
      '3,200+ leads managed across campaigns',
      'Automated multi-step email sequences',
      'Real-time deliverability analytics',
    ],
    tags: ['React', 'Email Analytics', 'Campaign Management'],
    impact: 'Scaled outreach operations from manual to fully automated pipeline.',
    url: 'https://business-outreach-optimizer.com/',
    featured: false,
    icon: icons.zap,
    color: 'teal',
    colorHex: '#2d8a8a',
  },
  {
    name: 'Denis Bozhkov Art',
    category: 'Portfolio',
    description:
      'Artistic portfolio with procedural 3D canvas graphics and dynamic visual compositions, showcasing the intersection of generative art and modern web technology.',
    results: [
      'Procedural generative art engine',
      'GPU-accelerated 3D canvas rendering',
      'Fluid responsive gallery experience',
    ],
    tags: ['React', '3D Canvas', 'Procedural Graphics'],
    impact: 'Transformed a traditional art portfolio into an immersive digital gallery.',
    url: 'https://denisbozhkov-art.com/',
    featured: true,
    icon: icons.palette,
    color: 'pink',
    colorHex: '#ec4899',
  },
  {
    name: 'Sunny Clean BG',
    category: 'Services',
    description:
      'Mobile-first service business website with advanced SEO architecture, online booking integration, and optimized conversion funnels for a professional cleaning company.',
    results: [
      'Page 1 Google rankings for key terms',
      'Mobile-first responsive design',
      'Online booking conversion funnel',
    ],
    tags: ['WordPress', 'SEO', 'Mobile-First'],
    impact: 'Tripled organic traffic and doubled booking conversions within 90 days.',
    url: 'https://sunnyclean.bg/',
    featured: false,
    icon: icons.building,
    color: 'blue',
    colorHex: '#4a9eff',
  },
];

// ---------------------------------------------------------------------------
// Project Card Component
// ---------------------------------------------------------------------------
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 48 }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.12, ease }}
      whileHover={{ y: -6, transition: { duration: 0.3, ease: 'easeOut' } }}
      className="group relative h-full"
    >
      <div
        className={`relative h-full rounded-2xl glass glass-hover overflow-hidden transition-all duration-500 ${
          project.featured
            ? 'shadow-[0_0_0_1px_rgba(45,138,138,0.15)] hover:shadow-[0_0_30px_rgba(45,138,138,0.12),0_0_0_1px_rgba(45,138,138,0.3)]'
            : 'hover:shadow-[0_0_24px_rgba(45,138,138,0.06)]'
        }`}
      >
        {/* Top gradient accent bar */}
        <div
          className="h-[2px] w-full opacity-40 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(to right, ${project.colorHex}, ${project.colorHex}80)`,
          }}
        />

        {/* Hover glow overlay */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] rounded-full opacity-[0.04] blur-[80px]"
            style={{ background: project.colorHex }}
          />
        </div>

        <div className="relative z-10 p-7 md:p-8 flex flex-col h-full">
          {/* Header: Category + Featured badge */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg transition-transform duration-500 group-hover:scale-110"
                style={{
                  backgroundColor: `${project.colorHex}15`,
                  color: project.colorHex,
                }}
              >
                {project.icon}
              </div>
              <span
                className="text-[11px] font-semibold tracking-[0.15em] uppercase"
                style={{ color: project.colorHex }}
              >
                {project.category}
              </span>
            </div>

            {project.featured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#2d8a8a]/10 border border-[#2d8a8a]/20 px-2.5 py-1 text-[10px] font-semibold tracking-[0.1em] uppercase text-[#2d8a8a]">
                <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                {t.projects.featured}
              </span>
            )}
          </div>

          {/* Project Name */}
          <h3 className="mb-3 text-lg md:text-xl font-bold tracking-[-0.02em] text-white font-[family-name:var(--font-heading)]">
            {project.name}
          </h3>

          {/* Description */}
          <p className="mb-5 text-[14px] leading-relaxed text-gray-400 line-clamp-3">
            {project.description}
          </p>

          {/* Key Results */}
          <div className="mb-5 space-y-2">
            {project.results.map((result) => (
              <div key={result} className="flex items-start gap-2.5">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#2d8a8a]" />
                <span className="text-[13px] text-gray-300 leading-snug">{result}</span>
              </div>
            ))}
          </div>

          {/* Tech Tags */}
          <div className="mb-5 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 text-[11px] font-medium text-gray-400 tracking-wide"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Impact Statement */}
          <p className="mb-6 text-[13px] italic text-[#2d8a8a]/80 leading-relaxed">
            &ldquo;{project.impact}&rdquo;
          </p>

          {/* Spacer to push button to bottom */}
          <div className="mt-auto">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn inline-flex items-center gap-2 text-sm font-medium tracking-wide transition-all duration-300"
              style={{ color: project.colorHex }}
            >
              <span className="transition-all duration-300 group-hover/btn:tracking-wider">
                {t.projects.viewProject}
              </span>
              <span className="transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-0.5">
                {icons.externalLink}
              </span>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ===========================================================================
// PAGE
// ===========================================================================
export default function ProjectsPage() {
  const { t } = useLanguage();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroImgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <main className="flex flex-col">
      {/* ================================================================
          HERO SECTION (50vh)
          ================================================================ */}
      <section
        ref={heroRef}
        className="relative h-[50vh] min-h-[400px] w-full overflow-hidden"
      >
        {/* Parallax video background */}
        <motion.div
          className="absolute inset-[-10%] w-[120%] h-[120%]"
          style={{ y: heroImgY }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            poster="/nebula-4k.jpg"
          >
            <source src="/cosmic-video-9-hd.mp4" type="video/mp4" />
          </video>
        </motion.div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-[#0a0a0f]/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/40 via-transparent to-[#0a0a0f]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/40 via-transparent to-[#0a0a0f]/40" />

        {/* Hero content */}
        <motion.div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
          style={{ opacity: heroOpacity }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#2d8a8a]/20 bg-[#2d8a8a]/5 px-4 py-1.5"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#2d8a8a] animate-pulse" />
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#2d8a8a]">
              {t.projects.badge}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[-0.03em] text-white font-[family-name:var(--font-heading)] leading-[0.9]"
          >
            {t.projects.title1}{' '}
            <span className="gradient-text-nebula">{t.projects.title2}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-5 max-w-md text-base sm:text-lg text-gray-400 leading-relaxed"
          >
            {t.projects.subtitle}
          </motion.p>

          {/* Decorative line */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="mt-8 h-[1px] w-16 bg-gradient-to-r from-transparent via-[#2d8a8a] to-transparent"
          />
        </motion.div>
      </section>

      {/* ================================================================
          PROJECTS GRID
          ================================================================ */}
      <section className="relative py-24 md:py-32 lg:py-40">
        {/* Background ambient glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[15%] left-[5%] w-[500px] h-[500px] rounded-full bg-[#2d8a8a]/[0.02] blur-[120px]" />
          <div className="absolute top-[50%] right-[5%] w-[400px] h-[400px] rounded-full bg-[#c4623a]/[0.02] blur-[100px]" />
          <div className="absolute bottom-[10%] left-[30%] w-[350px] h-[350px] rounded-full bg-[#4a9eff]/[0.015] blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
          {/* Section Header */}
          <AnimatedSection className="mb-16 md:mb-20 text-center">
            <p className="mb-4 text-xs tracking-[0.3em] uppercase text-[#2d8a8a]">
              {t.projects.whatWeBuilt}
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] font-[family-name:var(--font-heading)]">
              {t.projects.craftedWith}{' '}
              <span className="gradient-text-nebula">{t.projects.precision}</span>
            </h2>
            <p className="mt-6 max-w-2xl mx-auto text-base text-gray-400 leading-relaxed">
              {t.projects.craftedDesc}
            </p>
          </AnimatedSection>

          {/* 3-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
            {projects.map((project, i) => (
              <ProjectCard key={project.name} project={project} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          STATS SECTION
          ================================================================ */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0d1a1a] to-[#0a0a0f]" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[#2d8a8a]/[0.04] blur-[140px]" />
        </div>

        {/* Top and bottom dividers */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#2d8a8a]/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#2d8a8a]/20 to-transparent" />

        <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
          <AnimatedSection className="mb-12 md:mb-16 text-center">
            <p className="text-xs tracking-[0.3em] uppercase text-[#2d8a8a]/70">
              {t.projects.byTheNumbers}
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { target: 9, suffix: '', label: t.projects.liveProjects },
              { target: 1, suffix: '', label: t.projects.aiVoicePlatform },
              { target: 29, suffix: '+', label: t.projects.languages },
              { target: 100, suffix: '%', label: t.projects.satisfaction },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: i * 0.1, ease }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] text-white font-[family-name:var(--font-heading)]">
                  <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                </div>
                <div className="mt-2 text-[11px] sm:text-xs tracking-[0.15em] uppercase text-gray-500">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          CTA SECTION
          ================================================================ */}
      <section className="relative py-28 md:py-36 lg:py-44 overflow-hidden">
        {/* Background nebula glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[#2d8a8a]/[0.04] blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-[#c4623a]/[0.02] blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 md:px-12 text-center">
          <AnimatedSection>
            <p className="mb-4 text-xs tracking-[0.3em] uppercase text-[#c4623a]">
              {t.projects.yourTurn}
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] text-white font-[family-name:var(--font-heading)] leading-tight mb-6">
              {t.projects.readyToCreate1}
              <br />
              <span className="gradient-text-nebula">{t.projects.readyToCreate2}</span>
            </h2>
            <p className="max-w-xl mx-auto text-base md:text-lg text-gray-400 leading-relaxed mb-10">
              {t.projects.readyDesc}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2.5 rounded-full bg-[#2d8a8a] px-10 py-4 text-sm font-medium tracking-wider uppercase text-white transition-all duration-300 hover:bg-[#3aafaf] hover:shadow-[0_0_30px_rgba(45,138,138,0.35),0_0_60px_rgba(45,138,138,0.12)] active:scale-[0.98] animate-pulse-glow"
              >
                {t.projects.getStarted}
                <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                  {icons.arrow}
                </span>
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-sm tracking-wider uppercase text-gray-400 hover:text-[#2d8a8a] transition-colors duration-300"
              >
                {t.projects.exploreServices}
                {icons.arrow}
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
