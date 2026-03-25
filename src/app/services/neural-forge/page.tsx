'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from 'framer-motion';
import { useLanguage } from '../../../i18n/LanguageContext';

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

function StaggerCard({
  children,
  className = '',
  index = 0,
}: {
  children: React.ReactNode;
  className?: string;
  index?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Feature icons (static, no text)
// ---------------------------------------------------------------------------
const featureIcons = [
  (
    <svg key="arch" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
  (
    <svg key="transfer" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v4" />
      <path d="M12 19v4" />
      <path d="M5.64 5.64l2.83 2.83" />
      <path d="M15.54 15.54l2.83 2.83" />
      <path d="M1 12h4" />
      <path d="M19 12h4" />
      <path d="M5.64 18.36l2.83-2.83" />
      <path d="M15.54 8.46l2.83-2.83" />
    </svg>
  ),
  (
    <svg key="distributed" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M12 12h.01" />
      <path d="M17 12h.01" />
      <path d="M7 12h.01" />
    </svg>
  ),
  (
    <svg key="optimize" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
];

// ---------------------------------------------------------------------------
// Tech stack (brand names, not translated)
// ---------------------------------------------------------------------------
const techStack = [
  'PyTorch',
  'TensorFlow',
  'JAX',
  'Hugging Face',
  'NVIDIA A100',
  'ONNX',
  'TensorRT',
  'MLflow',
];

// ===========================================================================
// PAGE
// ===========================================================================
export default function NeuralForgePage() {
  const { t } = useLanguage();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroImgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // -------------------------------------------------------------------------
  // Translated data arrays (need access to `t`)
  // -------------------------------------------------------------------------
  const features = [
    { title: t.neuralForgePage.feature1Title, description: t.neuralForgePage.feature1Desc, icon: featureIcons[0] },
    { title: t.neuralForgePage.feature2Title, description: t.neuralForgePage.feature2Desc, icon: featureIcons[1] },
    { title: t.neuralForgePage.feature3Title, description: t.neuralForgePage.feature3Desc, icon: featureIcons[2] },
    { title: t.neuralForgePage.feature4Title, description: t.neuralForgePage.feature4Desc, icon: featureIcons[3] },
  ];

  const processSteps = [
    { step: '01', title: t.neuralForgePage.processStep1Title, description: t.neuralForgePage.processStep1Desc },
    { step: '02', title: t.neuralForgePage.processStep2Title, description: t.neuralForgePage.processStep2Desc },
    { step: '03', title: t.neuralForgePage.processStep3Title, description: t.neuralForgePage.processStep3Desc },
    { step: '04', title: t.neuralForgePage.processStep4Title, description: t.neuralForgePage.processStep4Desc },
    { step: '05', title: t.neuralForgePage.processStep5Title, description: t.neuralForgePage.processStep5Desc },
  ];

  const pricingTiers = [
    {
      name: t.neuralForgePage.pricingTier1Name,
      price: t.neuralForgePage.pricingTier1Price,
      period: t.neuralForgePage.pricingTier1Period,
      description: t.neuralForgePage.pricingTier1Desc,
      features: t.neuralForgePage.pricingTier1Features,
      highlighted: false,
      ctaKey: 'getStarted' as const,
    },
    {
      name: t.neuralForgePage.pricingTier2Name,
      price: t.neuralForgePage.pricingTier2Price,
      period: t.neuralForgePage.pricingTier2Period,
      description: t.neuralForgePage.pricingTier2Desc,
      features: t.neuralForgePage.pricingTier2Features,
      highlighted: true,
      ctaKey: 'getStarted' as const,
    },
    {
      name: t.neuralForgePage.pricingTier3Name,
      price: t.neuralForgePage.pricingTier3Price,
      period: '',
      description: t.neuralForgePage.pricingTier3Desc,
      features: t.neuralForgePage.pricingTier3Features,
      highlighted: false,
      ctaKey: 'contact' as const,
    },
  ];

  return (
    <main className="flex flex-col">
      {/* ================================================================
          HERO
          ================================================================ */}
      <section ref={heroRef} className="relative h-[85vh] min-h-[640px] w-full overflow-hidden">
        {/* Parallax nebula */}
        <motion.div className="absolute inset-[-20%] w-[140%] h-[140%]" style={{ y: heroImgY }}>
          <Image src="/nebula-4k.jpg" alt="Neural Forge background" fill className="object-cover" sizes="100vw" priority quality={90} />
        </motion.div>

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0a0a0f]/50 to-[#0a0a0f]" />
        <div className="absolute inset-0 bg-[#0a0a0f]/30" />

        {/* Animated grid lines (subtle) */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(45,138,138,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(45,138,138,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        {/* Hero content */}
        <motion.div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
          style={{ opacity: heroOpacity }}
        >
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8 flex items-center gap-2 text-xs tracking-widest uppercase text-gray-500"
          >
            <Link href="/services" className="hover:text-[#2d8a8a] transition-colors duration-300">{t.nav.services}</Link>
            <span>/</span>
            <span className="text-[#2d8a8a]">{t.services.neuralForge}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-bold tracking-[-0.04em] font-[family-name:var(--font-heading)] leading-[0.85]"
          >
            <span className="gradient-text-shimmer">{t.neuralForgePage.heroTitle1}</span>
            <br />
            <span className="text-white">{t.neuralForgePage.heroTitle2}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8 text-lg sm:text-xl md:text-2xl text-gray-300 font-[family-name:var(--font-heading)] tracking-wide"
          >
            {t.neuralForgePage.heroSubtitle}<span className="text-[#2d8a8a]">{t.neuralForgePage.heroSubtitleAccent}</span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="mt-4 max-w-md text-sm text-gray-500 leading-relaxed"
          >
            {t.neuralForgePage.heroDescription}
          </motion.p>
        </motion.div>
      </section>

      {/* ================================================================
          PROBLEM / SOLUTION
          ================================================================ */}
      <section className="relative py-24 md:py-32 lg:py-40">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[30%] right-[5%] w-[500px] h-[500px] rounded-full bg-[#2d8a8a]/[0.02] blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* The Challenge */}
            <AnimatedSection>
              <div className="relative">
                <p className="mb-4 text-xs tracking-[0.3em] uppercase text-[#c4623a]">
                  {t.neuralForgePage.challengeLabel}
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.02em] font-[family-name:var(--font-heading)] text-white mb-6">
                  {t.neuralForgePage.challengeTitle1}
                  <br />
                  <span className="text-gray-500">{t.neuralForgePage.challengeTitle2}</span>
                </h2>
                <p className="text-base text-gray-400 leading-relaxed mb-6">
                  {t.neuralForgePage.challengeDescription}
                </p>
                <div className="space-y-3">
                  {[
                    t.neuralForgePage.challengePoint1,
                    t.neuralForgePage.challengePoint2,
                    t.neuralForgePage.challengePoint3,
                  ].map((point) => (
                    <div key={point} className="flex items-start gap-3">
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#c4623a] shrink-0" />
                      <p className="text-sm text-gray-400">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* Our Approach */}
            <AnimatedSection delay={0.15}>
              <div className="relative">
                <p className="mb-4 text-xs tracking-[0.3em] uppercase text-[#2d8a8a]">
                  {t.neuralForgePage.approachLabel}
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.02em] font-[family-name:var(--font-heading)] text-white mb-6">
                  {t.neuralForgePage.approachTitle1}
                  <br />
                  <span className="text-[#2d8a8a]">{t.neuralForgePage.approachTitle2}</span>
                </h2>
                <p className="text-base text-gray-400 leading-relaxed mb-6">
                  {t.neuralForgePage.approachDescription}
                </p>
                <div className="space-y-3">
                  {[
                    t.neuralForgePage.approachPoint1,
                    t.neuralForgePage.approachPoint2,
                    t.neuralForgePage.approachPoint3,
                  ].map((point) => (
                    <div key={point} className="flex items-start gap-3">
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#2d8a8a] shrink-0" />
                      <p className="text-sm text-gray-400">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ================================================================
          FEATURES GRID
          ================================================================ */}
      <section className="relative py-24 md:py-32">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[50%] left-[20%] w-[400px] h-[400px] rounded-full bg-[#4a9eff]/[0.015] blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
          <AnimatedSection className="mb-16 md:mb-20 text-center">
            <p className="mb-4 text-xs tracking-[0.3em] uppercase text-[#2d8a8a]">
              {t.neuralForgePage.featuresLabel}
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] font-[family-name:var(--font-heading)]">
              {t.neuralForgePage.featuresTitle}<span className="gradient-text-nebula">{t.neuralForgePage.featuresTitleAccent}</span>
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {features.map((feature, i) => (
              <StaggerCard key={i} index={i}>
                <div className="group relative h-full rounded-2xl glass glass-hover p-8 md:p-10 transition-all duration-500">
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-br from-[#2d8a8a]/5 to-transparent" />
                  <div className="relative z-10">
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#2d8a8a]/10 text-[#2d8a8a]">
                      {feature.icon}
                    </div>
                    <h3 className="mb-3 text-xl font-semibold tracking-tight text-white font-[family-name:var(--font-heading)]">
                      {feature.title}
                    </h3>
                    <p className="text-[15px] leading-relaxed text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </StaggerCard>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          PROCESS TIMELINE
          ================================================================ */}
      <section className="relative py-24 md:py-32 lg:py-40">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[400px] rounded-full bg-[#c4623a]/[0.02] blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
          <AnimatedSection className="mb-16 md:mb-20 text-center">
            <p className="mb-4 text-xs tracking-[0.3em] uppercase text-[#c4623a]">
              {t.neuralForgePage.processLabel}
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] font-[family-name:var(--font-heading)]">
              {t.neuralForgePage.processTitle}<span className="gradient-text-nebula">{t.neuralForgePage.processTitleAccent}</span>
            </h2>
          </AnimatedSection>

          <div className="relative">
            {/* Vertical connecting line (desktop) */}
            <div className="hidden md:block absolute left-[39px] top-0 bottom-0 w-[1px] bg-gradient-to-b from-[#2d8a8a]/20 via-[#c4623a]/20 to-[#4a9eff]/20" />

            <div className="space-y-8 md:space-y-12">
              {processSteps.map((step, i) => (
                <StaggerCard key={step.step} index={i}>
                  <div className="flex items-start gap-6 md:gap-10">
                    {/* Step number */}
                    <div className="relative shrink-0">
                      <div className="flex h-[78px] w-[78px] items-center justify-center rounded-full glass border border-[#2d8a8a]/20">
                        <span className="text-lg font-bold text-[#2d8a8a] font-[family-name:var(--font-heading)]">
                          {step.step}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="pt-4 md:pt-5">
                      <h3 className="text-xl md:text-2xl font-bold tracking-[-0.02em] text-white font-[family-name:var(--font-heading)] mb-2">
                        {step.title}
                      </h3>
                      <p className="text-sm md:text-base text-gray-400 leading-relaxed max-w-xl">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </StaggerCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          TECH STACK
          ================================================================ */}
      <section className="relative py-20 md:py-24">
        <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
          <AnimatedSection className="text-center">
            <p className="mb-6 text-xs tracking-[0.3em] uppercase text-gray-500">
              {t.neuralForgePage.techStackLabel}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="glass rounded-full px-6 py-2.5 text-xs tracking-wider uppercase text-gray-300 border border-white/[0.04] hover:border-[#2d8a8a]/20 transition-colors duration-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ================================================================
          PRICING
          ================================================================ */}
      <section className="relative py-24 md:py-32 lg:py-40">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-[#2d8a8a]/[0.02] blur-[140px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
          <AnimatedSection className="mb-16 md:mb-20 text-center">
            <p className="mb-4 text-xs tracking-[0.3em] uppercase text-[#2d8a8a]">
              {t.neuralForgePage.pricingLabel}
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] font-[family-name:var(--font-heading)]">
              {t.neuralForgePage.pricingTitle}<span className="gradient-text-nebula">{t.neuralForgePage.pricingTitleAccent}</span>
            </h2>
            <p className="mt-6 max-w-xl mx-auto text-base text-gray-400">
              {t.neuralForgePage.pricingSubtitle}
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {pricingTiers.map((tier, i) => (
              <StaggerCard key={i} index={i}>
                <div
                  className={`group relative h-full rounded-2xl p-8 md:p-10 transition-all duration-500 ${
                    tier.highlighted
                      ? 'glass border-[#2d8a8a]/30 shadow-[0_0_40px_rgba(45,138,138,0.08)]'
                      : 'glass glass-hover'
                  }`}
                >
                  {/* Highlighted badge */}
                  {tier.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-block rounded-full bg-[#2d8a8a] px-4 py-1 text-[10px] font-medium tracking-widest uppercase text-white">
                        {t.neuralForgePage.mostPopularBadge}
                      </span>
                    </div>
                  )}

                  {/* Top accent */}
                  {tier.highlighted && (
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#2d8a8a] to-[#4a9eff] rounded-t-2xl" />
                  )}

                  <div className="relative z-10">
                    <h3 className="text-lg font-semibold text-white font-[family-name:var(--font-heading)] mb-2">
                      {tier.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                      {tier.description}
                    </p>

                    {/* Price */}
                    <div className="mb-8">
                      <span className="text-4xl md:text-5xl font-bold text-white font-[family-name:var(--font-heading)] tracking-tight">
                        {tier.price}
                      </span>
                      {tier.period && (
                        <span className="text-base text-gray-500 ml-1">
                          {tier.period}
                        </span>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-10">
                      {tier.features.map((feat, fi) => (
                        <li key={fi} className="flex items-start gap-3">
                          <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#2d8a8a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span className="text-sm text-gray-400">{feat}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <Link
                      href="/contact"
                      className={`block w-full text-center rounded-xl py-3.5 text-sm font-medium tracking-wide transition-all duration-300 ${
                        tier.highlighted
                          ? 'bg-[#2d8a8a] text-white hover:bg-[#3aafaf] hover:shadow-[0_0_20px_rgba(45,138,138,0.3)]'
                          : 'glass text-gray-300 hover:text-white hover:border-[#2d8a8a]/30'
                      }`}
                    >
                      {tier.ctaKey === 'getStarted' ? t.nav.getStarted : t.nav.contact}
                    </Link>
                  </div>
                </div>
              </StaggerCard>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          CTA
          ================================================================ */}
      <section className="relative py-24 md:py-32">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] rounded-full bg-[#2d8a8a]/[0.03] blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 md:px-12 text-center">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] font-[family-name:var(--font-heading)] mb-6">
              {t.neuralForgePage.ctaTitle}<span className="gradient-text-nebula">{t.neuralForgePage.ctaTitleAccent}</span>{t.neuralForgePage.ctaTitleEnd}
            </h2>
            <p className="max-w-xl mx-auto text-base text-gray-400 leading-relaxed mb-10">
              {t.neuralForgePage.ctaDescription}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 rounded-full bg-[#2d8a8a] px-8 py-4 text-sm font-medium tracking-wide text-white transition-all duration-300 hover:bg-[#3aafaf] hover:shadow-[0_0_30px_rgba(45,138,138,0.3)]"
              >
                {t.nav.getStarted}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-full glass px-8 py-4 text-sm font-medium tracking-wide text-gray-300 hover:text-white transition-all duration-300 hover:border-white/10"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5" />
                  <path d="m12 19-7-7 7-7" />
                </svg>
                {t.nav.services}
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

    </main>
  );
}
