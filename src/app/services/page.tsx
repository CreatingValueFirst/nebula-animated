'use client';

import React, { useRef } from 'react';

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
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Service data
// ---------------------------------------------------------------------------
interface ServiceItem {
  slug: string;
  title: string;
  description: string;
  stats: { label: string; value: string; labelKey?: string }[];
  gradient: string;
  iconColor: string;
  icon: React.ReactNode;
}

const services: ServiceItem[] = [
  {
    slug: 'neural-forge',
    title: 'Neural Forge',
    description:
      'Custom AI model training and fine-tuning built for your domain. From architecture design to distributed training at scale, we forge models that understand your data.',
    stats: [
      { label: 'Models Trained', value: '2,400+', labelKey: 'modelsTrained' },
      { label: 'Avg. Accuracy', value: '97.3%', labelKey: 'avgAccuracy' },
      { label: 'Training Time', value: '-60%', labelKey: 'trainingTime' },
    ],
    gradient: 'from-[#2d8a8a] to-[#4a9eff]',
    iconColor: '#2d8a8a',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    slug: 'voice-cosmos',
    title: 'Voice Cosmos',
    description:
      'Conversational AI voice agents that understand, respond, and connect in 35+ languages. Sub-100ms latency with emotion-aware adaptive dialogue.',
    stats: [
      { label: 'Conversations', value: '500K+', labelKey: 'conversations' },
      { label: 'Languages', value: '35', labelKey: 'languages' },
      { label: 'Satisfaction', value: '98.5%', labelKey: 'satisfaction' },
    ],
    gradient: 'from-[#c4623a] to-[#c4847a]',
    iconColor: '#c4623a',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="22" />
      </svg>
    ),
  },
  {
    slug: 'vision-nebula',
    title: 'Vision Nebula',
    description:
      'Computer vision and image recognition that sees what others cannot. From medical imaging to industrial quality control, with 99.7% detection accuracy.',
    stats: [
      { label: 'Accuracy', value: '99.7%', labelKey: 'accuracy' },
      { label: 'Processing', value: 'Real-time', labelKey: 'processing' },
      { label: 'Edge Deploy', value: '<50ms', labelKey: 'edgeDeploy' },
    ],
    gradient: 'from-[#4a9eff] to-[#2d8a8a]',
    iconColor: '#4a9eff',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    slug: 'data-singularity',
    title: 'Data Singularity',
    description:
      'Predictive analytics and data intelligence that transform raw data into strategic foresight. Uncover patterns invisible to the human eye.',
    stats: [
      { label: 'Data Points', value: '12B+', labelKey: 'dataPoints' },
      { label: 'Predictions', value: '94% Acc', labelKey: 'predictions' },
      { label: 'ROI Boost', value: '340%', labelKey: 'roiBoost' },
    ],
    gradient: 'from-[#8b2020] to-[#c4623a]',
    iconColor: '#8b2020',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
        <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
      </svg>
    ),
  },
  {
    slug: 'code-pulsar',
    title: 'Code Pulsar',
    description:
      'AI-powered code generation and development automation. From rapid prototyping to full-stack production systems, accelerating delivery by 10x.',
    stats: [
      { label: 'Lines/Day', value: '50K+', labelKey: 'linesPerDay' },
      { label: 'Bug Reduction', value: '78%', labelKey: 'bugReduction' },
      { label: 'Ship Speed', value: '10x', labelKey: 'shipSpeed' },
    ],
    gradient: 'from-[#2d8a8a] to-[#c4623a]',
    iconColor: '#2d8a8a',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="14" y1="4" x2="10" y2="20" />
      </svg>
    ),
  },
  {
    slug: 'quantum-mind',
    title: 'Quantum Mind',
    description:
      'AI strategy consulting and full implementation. We map your business challenges to AI solutions, then build and deploy them end-to-end.',
    stats: [
      { label: 'Clients', value: '180+', labelKey: 'clients' },
      { label: 'Success Rate', value: '96%', labelKey: 'successRate' },
      { label: 'Avg. Timeline', value: '8 Weeks', labelKey: 'avgTimeline' },
    ],
    gradient: 'from-[#4a9eff] to-[#c4847a]',
    iconColor: '#4a9eff',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
    ),
  },
];

// ---------------------------------------------------------------------------
// Service Card
// ---------------------------------------------------------------------------
const serviceTranslationMap: Record<string, { titleKey: string; descKey: string }> = {
  'neural-forge': { titleKey: 'neuralForge', descKey: 'neuralForgeDesc' },
  'voice-cosmos': { titleKey: 'voiceCosmos', descKey: 'voiceCosmosDesc' },
  'vision-nebula': { titleKey: 'visionNebula', descKey: 'visionNebulaDesc' },
  'data-singularity': { titleKey: 'dataSingularity', descKey: 'dataSingularityDesc' },
  'code-pulsar': { titleKey: 'codePulsar', descKey: 'codePulsarDesc' },
  'quantum-mind': { titleKey: 'quantumMind', descKey: 'quantumMindDesc' },
};

function ServiceCard({ service, index }: { service: ServiceItem; index: number }) {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  const mapping = serviceTranslationMap[service.slug];
  const translatedTitle = mapping
    ? (t.services as Record<string, string>)[mapping.titleKey] ?? service.title
    : service.title;
  const translatedDesc = mapping
    ? (t.services as Record<string, string>)[mapping.descKey] ?? service.description
    : service.description;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 48 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease }}
    >
      <Link href={`/services/${service.slug}`} className="group block h-full">
        <div className="relative h-full rounded-2xl glass glass-hover overflow-hidden transition-all duration-500 group-hover:shadow-[0_0_40px_rgba(45,138,138,0.08)]">
          {/* Top gradient accent bar */}
          <div className={`h-[2px] w-full bg-gradient-to-r ${service.gradient} opacity-40 group-hover:opacity-100 transition-opacity duration-500`} />

          {/* Hover glow */}
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] rounded-full bg-gradient-to-b ${service.gradient} opacity-[0.04] blur-[80px]`} />
          </div>

          <div className="relative z-10 p-8 md:p-10">
            {/* Icon */}
            <div
              className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl transition-transform duration-500 group-hover:scale-110"
              style={{
                backgroundColor: `${service.iconColor}10`,
                color: service.iconColor,
              }}
            >
              {service.icon}
            </div>

            {/* Title */}
            <h3 className="mb-3 text-xl md:text-2xl font-bold tracking-[-0.02em] text-white font-[family-name:var(--font-heading)]">
              {translatedTitle}
            </h3>

            {/* Description */}
            <p className="mb-8 text-[15px] leading-relaxed text-gray-400">
              {translatedDesc}
            </p>

            {/* Stats */}
            <div className="mb-8 grid grid-cols-3 gap-4">
              {service.stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-lg md:text-xl font-bold text-white font-[family-name:var(--font-heading)]">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[11px] tracking-wider uppercase text-gray-500">
                    {stat.labelKey
                      ? (t.servicesPage as Record<string, string>)[stat.labelKey] ?? stat.label
                      : stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA link */}
            <div className="flex items-center gap-2 text-sm font-medium tracking-wide">
              <span
                className="transition-colors duration-300"
                style={{ color: service.iconColor }}
              >
                {t.services.learnMore}
              </span>
              <motion.span
                className="inline-block transition-colors duration-300"
                style={{ color: service.iconColor }}
                whileHover={{ x: 4 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </motion.span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ===========================================================================
// PAGE
// ===========================================================================
export default function ServicesPage() {
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
          HERO
          ================================================================ */}
      <section ref={heroRef} className="relative h-[80vh] min-h-[600px] w-full overflow-hidden">
        {/* Parallax nebula background */}
        <motion.div className="absolute inset-[-20%] w-[140%] h-[140%]" style={{ y: heroImgY }}>
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
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0a0a0f]/40 to-[#0a0a0f]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/60 via-transparent to-[#0a0a0f]/60" />

        {/* Hero content */}
        <motion.div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
          style={{ opacity: heroOpacity }}
        >
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-5 text-xs sm:text-sm tracking-[0.3em] uppercase text-[#2d8a8a]"
          >
            {t.services.subtitle}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-[-0.03em] text-white font-[family-name:var(--font-heading)] leading-[0.9]"
          >
            <span className="gradient-text-nebula">{t.services.title}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-6 max-w-lg text-base sm:text-lg text-gray-400 leading-relaxed"
          >
            {t.servicesPage.heroSubtitle}
          </motion.p>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-[10px] tracking-[0.3em] uppercase text-gray-500">
                {t.services.learnMore}
              </span>
              <div className="h-8 w-[1px] bg-gradient-to-b from-gray-500 to-transparent" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ================================================================
          SERVICES GRID
          ================================================================ */}
      <section className="relative py-24 md:py-32 lg:py-40">
        {/* Background ambient glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] rounded-full bg-[#2d8a8a]/[0.02] blur-[120px]" />
          <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-[#c4623a]/[0.02] blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
          <AnimatedSection className="mb-16 md:mb-20 text-center">
            <p className="mb-4 text-xs tracking-[0.3em] uppercase text-[#2d8a8a]">
              {t.servicesPage.capabilities}
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] font-[family-name:var(--font-heading)]">
              {t.servicesPage.builtFor}{' '}
              <span className="gradient-text-nebula">{t.servicesPage.nextEra}</span>
            </h2>
            <p className="mt-6 max-w-2xl mx-auto text-base text-gray-400 leading-relaxed">
              {t.servicesPage.capabilitiesDesc}
            </p>
          </AnimatedSection>

          {/* 2-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {services.map((service, i) => (
              <ServiceCard key={service.slug} service={service} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          BOTTOM CTA
          ================================================================ */}
      <section className="relative py-24 md:py-32">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[#2d8a8a]/[0.03] blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 md:px-12 text-center">
          <AnimatedSection>
            <p className="mb-4 text-xs tracking-[0.3em] uppercase text-[#c4623a]">
              {t.cta.title}
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] font-[family-name:var(--font-heading)] mb-6">
              <span className="gradient-text-nebula">{t.cta.subtitle}</span>
            </h2>
            <p className="max-w-xl mx-auto text-base text-gray-400 leading-relaxed mb-10">
              {t.contact.scheduleCall}
            </p>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 rounded-full bg-[#2d8a8a] px-8 py-4 text-sm font-medium tracking-wide text-white transition-all duration-300 hover:bg-[#3aafaf] hover:shadow-[0_0_30px_rgba(45,138,138,0.3)]"
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
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </AnimatedSection>
        </div>
      </section>

    </main>
  );
}
