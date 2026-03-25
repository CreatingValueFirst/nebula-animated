'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useLanguage } from '../../../i18n/LanguageContext';

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

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const staggerChild = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
};

// ---------------------------------------------------------------------------
// Section Wrapper
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
// Neural Network Visualization (CSS connected dots)
// ---------------------------------------------------------------------------
function NeuralNetwork() {
  // 3 layers of nodes
  const layers = [
    { count: 4, x: 15 },
    { count: 6, x: 38 },
    { count: 6, x: 62 },
    { count: 3, x: 85 },
  ];

  // Build node positions
  const nodes: { id: string; x: number; y: number; layer: number }[] = [];
  layers.forEach((layer, li) => {
    for (let i = 0; i < layer.count; i++) {
      const spacing = 100 / (layer.count + 1);
      nodes.push({
        id: `${li}-${i}`,
        x: layer.x,
        y: spacing * (i + 1),
        layer: li,
      });
    }
  });

  // Build connections between adjacent layers
  const connections: { from: typeof nodes[0]; to: typeof nodes[0]; key: string }[] = [];
  for (let li = 0; li < layers.length - 1; li++) {
    const fromNodes = nodes.filter((n) => n.layer === li);
    const toNodes = nodes.filter((n) => n.layer === li + 1);
    fromNodes.forEach((fn) => {
      toNodes.forEach((tn) => {
        connections.push({ from: fn, to: tn, key: `${fn.id}-${tn.id}` });
      });
    });
  }

  return (
    <div className="relative w-full max-w-lg mx-auto aspect-[16/10]">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Connections */}
        {connections.map((conn, i) => (
          <motion.line
            key={conn.key}
            x1={conn.from.x}
            y1={conn.from.y}
            x2={conn.to.x}
            y2={conn.to.y}
            stroke="rgba(45, 138, 138, 0.12)"
            strokeWidth="0.15"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.8 + i * 0.005,
              ease: 'easeOut',
            }}
          />
        ))}
        {/* Animated signal along select connections */}
        {connections
          .filter((_, i) => i % 5 === 0)
          .map((conn, i) => (
            <motion.circle
              key={`signal-${conn.key}`}
              r="0.5"
              fill="#2d8a8a"
              initial={{ opacity: 0 }}
              animate={{
                cx: [conn.from.x, conn.to.x],
                cy: [conn.from.y, conn.to.y],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 1.5,
                delay: 2 + i * 0.3,
                repeat: Infinity,
                repeatDelay: 4,
                ease: 'easeInOut',
              }}
            />
          ))}
        {/* Nodes */}
        {nodes.map((node, i) => (
          <motion.circle
            key={node.id}
            cx={node.x}
            cy={node.y}
            r="1.5"
            fill={
              node.layer === 0
                ? '#4a9eff'
                : node.layer === layers.length - 1
                  ? '#c4623a'
                  : '#2d8a8a'
            }
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.8 }}
            transition={{
              duration: 0.4,
              delay: 0.3 + i * 0.04,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          />
        ))}
        {/* Outer glow rings on select nodes */}
        {nodes
          .filter((_, i) => i % 3 === 0)
          .map((node) => (
            <motion.circle
              key={`glow-${node.id}`}
              cx={node.x}
              cy={node.y}
              r="2.5"
              fill="none"
              stroke={
                node.layer === 0
                  ? 'rgba(74, 158, 255, 0.3)'
                  : node.layer === layers.length - 1
                    ? 'rgba(196, 98, 58, 0.3)'
                    : 'rgba(45, 138, 138, 0.3)'
              }
              strokeWidth="0.2"
              animate={{
                r: [2.5, 4, 2.5],
                opacity: [0.3, 0, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: 'easeInOut',
              }}
            />
          ))}
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Consultant Profile Card
// ---------------------------------------------------------------------------
function ConsultantCard({
  name,
  role,
  gradient,
  shape,
  index,
}: {
  name: string;
  role: string;
  gradient: string;
  shape: 'circle' | 'hexagon' | 'diamond';
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const shapeClasses: Record<string, string> = {
    circle: 'rounded-full',
    hexagon: 'rounded-2xl rotate-45',
    diamond: 'rounded-xl rotate-45',
  };

  const innerShapeClasses: Record<string, string> = {
    circle: '',
    hexagon: '-rotate-45',
    diamond: '-rotate-45',
  };

  return (
    <motion.div
      ref={ref}
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className="glass glass-hover rounded-2xl p-8 md:p-10 text-center transition-colors duration-300"
    >
      {/* Geometric avatar */}
      <div className="flex justify-center mb-6">
        <div
          className={`w-20 h-20 ${shapeClasses[shape]} overflow-hidden`}
          style={{ background: gradient }}
        >
          <div
            className={`w-full h-full flex items-center justify-center ${innerShapeClasses[shape]}`}
          >
            <span className="text-2xl font-bold text-white/80 font-[family-name:var(--font-heading)]">
              {name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </span>
          </div>
        </div>
      </div>
      <h4 className="text-lg font-semibold text-white mb-1 font-[family-name:var(--font-heading)]">
        {name}
      </h4>
      <p className="text-sm text-[#2d8a8a] tracking-wide">{role}</p>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Client Logo Placeholder
// ---------------------------------------------------------------------------
function ClientLogo({
  name,
  index,
}: {
  name: string;
  index: number;
}) {
  return (
    <motion.div
      custom={index}
      variants={staggerChild}
      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
      className="flex items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] px-6 py-4 sm:px-8 sm:py-5 transition-colors duration-300 hover:border-white/[0.1] hover:bg-white/[0.04]"
    >
      <span className="text-sm sm:text-base font-semibold tracking-wider text-gray-500 uppercase font-[family-name:var(--font-heading)]">
        {name}
      </span>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Engagement Model Card
// ---------------------------------------------------------------------------
function EngagementCard({
  title,
  description,
  features,
  accent,
  index,
}: {
  title: string;
  description: string;
  features: string[];
  accent: string;
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
      className="group relative glass glass-hover rounded-2xl p-8 md:p-10 transition-colors duration-300"
    >
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-[#4a9eff]/5 to-[#2d8a8a]/5" />
      <div className="relative z-10">
        <div
          className="mb-5 h-1 w-12 rounded-full"
          style={{ backgroundColor: accent }}
        />
        <h4 className="text-xl font-semibold text-white mb-3 font-[family-name:var(--font-heading)]">
          {title}
        </h4>
        <p className="text-[15px] text-gray-400 leading-relaxed mb-6">
          {description}
        </p>
        <ul className="space-y-2">
          {features.map((f) => (
            <li
              key={f}
              className="flex items-center gap-2 text-sm text-gray-400"
            >
              <span
                className="w-1 h-1 rounded-full flex-shrink-0"
                style={{ backgroundColor: accent }}
              />
              {f}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Stat Card
// ---------------------------------------------------------------------------
function StatCard({
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
      whileHover={{ y: -4, transition: { duration: 0.25 } }}
      className="glass glass-hover rounded-2xl p-8 text-center transition-colors duration-300"
    >
      <div className="text-3xl sm:text-4xl font-bold tracking-tight gradient-text-nebula font-[family-name:var(--font-heading)]">
        {value}
      </div>
      <div className="mt-2 text-sm text-gray-400 tracking-wide">{label}</div>
    </motion.div>
  );
}

// ===========================================================================
// PAGE
// ===========================================================================
export default function QuantumMindPage() {
  const { t } = useLanguage();
  const approach = [
    {
      step: '01',
      title: t.quantumMindPage.approachStep1Title,
      description: t.quantumMindPage.approachStep1Desc,
    },
    {
      step: '02',
      title: t.quantumMindPage.approachStep2Title,
      description: t.quantumMindPage.approachStep2Desc,
    },
    {
      step: '03',
      title: t.quantumMindPage.approachStep3Title,
      description: t.quantumMindPage.approachStep3Desc,
    },
    {
      step: '04',
      title: t.quantumMindPage.approachStep4Title,
      description: t.quantumMindPage.approachStep4Desc,
    },
  ];

  const consultants = [
    {
      name: t.quantumMindPage.consultant1Name,
      role: t.quantumMindPage.consultant1Role,
      gradient: 'linear-gradient(135deg, #2d8a8a, #4a9eff)',
      shape: 'circle' as const,
    },
    {
      name: t.quantumMindPage.consultant2Name,
      role: t.quantumMindPage.consultant2Role,
      gradient: 'linear-gradient(135deg, #c4623a, #2d8a8a)',
      shape: 'hexagon' as const,
    },
    {
      name: t.quantumMindPage.consultant3Name,
      role: t.quantumMindPage.consultant3Role,
      gradient: 'linear-gradient(135deg, #4a9eff, #c4623a)',
      shape: 'diamond' as const,
    },
  ];

  const clientLogos = [
    'APEX',
    'VERTEX',
    'NEXUS',
    'ATLAS',
    'PRISM',
    'HELIX',
  ];

  const engagements = [
    {
      title: t.quantumMindPage.engagement1Title,
      description: t.quantumMindPage.engagement1Desc,
      features: t.quantumMindPage.engagement1Features,
      accent: '#4a9eff',
    },
    {
      title: t.quantumMindPage.engagement2Title,
      description: t.quantumMindPage.engagement2Desc,
      features: t.quantumMindPage.engagement2Features,
      accent: '#2d8a8a',
    },
    {
      title: t.quantumMindPage.engagement3Title,
      description: t.quantumMindPage.engagement3Desc,
      features: t.quantumMindPage.engagement3Features,
      accent: '#c4623a',
    },
  ];

  return (
    <main className="flex flex-col">
      {/* ================================================================
          HERO
          ================================================================ */}
      <section className="relative min-h-dvh flex flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-16">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/3 w-[600px] h-[400px] rounded-full bg-[#4a9eff]/[0.03] blur-[150px]" />
          <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[400px] rounded-full bg-[#2d8a8a]/[0.03] blur-[130px]" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto">
          {/* Exclusive badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-[#4a9eff]/20 bg-[#4a9eff]/[0.06] px-5 py-2 text-xs tracking-[0.2em] uppercase text-[#4a9eff]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4a9eff] animate-pulse" />
              {t.quantumMindPage.heroBadge}
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-6 text-xs sm:text-sm tracking-[0.3em] uppercase text-[#4a9eff]"
          >
            {t.quantumMindPage.heroLabel}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-[-0.03em] text-white font-[family-name:var(--font-heading)] leading-[0.9]"
          >
            {t.quantumMindPage.heroTitle1}
            <br />
            <span className="gradient-text-nebula">{t.quantumMindPage.heroTitle2}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-6 max-w-lg text-base sm:text-lg text-gray-400 leading-relaxed"
          >
            {t.quantumMindPage.heroSubtitle}
          </motion.p>

          {/* Neural Network Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="mt-12 w-full"
          >
            <NeuralNetwork />
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="mt-16"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-[10px] tracking-[0.3em] uppercase text-gray-500">
                {t.quantumMindPage.scrollIndicator}
              </span>
              <div className="h-8 w-[1px] bg-gradient-to-b from-gray-500 to-transparent" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================================================================
          APPROACH
          ================================================================ */}
      <section className="relative py-28 md:py-36">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/4 w-[600px] h-[400px] rounded-full bg-[#4a9eff]/[0.02] blur-[120px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
          <AnimatedSection className="text-center mb-16 md:mb-20">
            <p className="mb-4 text-xs tracking-[0.3em] uppercase text-[#4a9eff]">
              {t.quantumMindPage.approachLabel}
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] font-[family-name:var(--font-heading)]">
              {t.quantumMindPage.approachTitle}
              <span className="gradient-text-nebula">{t.quantumMindPage.approachTitleAccent}</span>
            </h2>
          </AnimatedSection>

          <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-2 md:gap-6 lg:gap-8">
            {approach.map((item, i) => {
              const cardRef = useRef<HTMLDivElement>(null);
              const cardInView = useInView(cardRef, {
                once: true,
                amount: 0.3,
              });
              return (
                <motion.div
                  key={item.step}
                  ref={cardRef}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  animate={cardInView ? 'visible' : 'hidden'}
                  whileHover={{ y: -4, transition: { duration: 0.25 } }}
                  className="group relative glass glass-hover rounded-2xl p-8 md:p-10 transition-colors duration-300"
                >
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-[#4a9eff]/5 to-[#2d8a8a]/5" />
                  <div className="relative z-10">
                    <span className="text-4xl sm:text-5xl font-bold text-white/[0.06] font-[family-name:var(--font-heading)] absolute -top-2 -left-1 select-none">
                      {item.step}
                    </span>
                    <div className="pt-6">
                      <h3 className="mb-3 text-xl font-semibold tracking-tight text-white font-[family-name:var(--font-heading)]">
                        {item.title}
                      </h3>
                      <p className="text-[15px] leading-relaxed text-gray-400">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================
          STATS
          ================================================================ */}
      <section className="relative py-28 md:py-36">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-[#4a9eff]/[0.03] blur-[120px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-6 md:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard value={t.quantumMindPage.stat1Value} label={t.quantumMindPage.stat1Label} index={0} />
            <StatCard value={t.quantumMindPage.stat2Value} label={t.quantumMindPage.stat2Label} index={1} />
            <StatCard value={t.quantumMindPage.stat3Value} label={t.quantumMindPage.stat3Label} index={2} />
          </div>
        </div>
      </section>

      {/* ================================================================
          TEAM
          ================================================================ */}
      <AnimatedSection className="relative py-28 md:py-36">
        <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
          <div className="text-center mb-16 md:mb-20">
            <p className="mb-4 text-xs tracking-[0.3em] uppercase text-[#2d8a8a]">
              {t.quantumMindPage.teamLabel}
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] font-[family-name:var(--font-heading)]">
              {t.quantumMindPage.teamTitle}
              <span className="gradient-text-nebula">{t.quantumMindPage.teamTitleAccent}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
            {consultants.map((c, i) => (
              <ConsultantCard
                key={c.name}
                name={c.name}
                role={c.role}
                gradient={c.gradient}
                shape={c.shape}
                index={i}
              />
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ================================================================
          CLIENT LOGOS
          ================================================================ */}
      <section className="relative py-28 md:py-36">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
        </div>
        <div className="relative z-10 mx-auto max-w-5xl px-6 md:px-12 text-center">
          <AnimatedSection>
            <p className="mb-12 text-xs tracking-[0.3em] uppercase text-gray-500">
              {t.quantumMindPage.clientLogosLabel}
            </p>
          </AnimatedSection>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {clientLogos.map((logo, i) => (
              <ClientLogo key={logo} name={logo} index={i} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================================================================
          ENGAGEMENT MODELS
          ================================================================ */}
      <section className="relative py-28 md:py-36">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[400px] rounded-full bg-[#c4623a]/[0.02] blur-[120px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
          <AnimatedSection className="text-center mb-16 md:mb-20">
            <p className="mb-4 text-xs tracking-[0.3em] uppercase text-[#c4623a]">
              {t.quantumMindPage.engagementLabel}
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] font-[family-name:var(--font-heading)]">
              {t.quantumMindPage.engagementTitle}
              <span className="gradient-text-nebula">{t.quantumMindPage.engagementTitleAccent}</span>
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {engagements.map((eng, i) => (
              <EngagementCard
                key={eng.title}
                title={eng.title}
                description={eng.description}
                features={eng.features}
                accent={eng.accent}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          CTA
          ================================================================ */}
      <section className="relative py-28 md:py-36">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#4a9eff]/20 to-transparent" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl px-6 md:px-12 text-center">
          <AnimatedSection>
            <div className="mb-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#4a9eff]/20 bg-[#4a9eff]/[0.06] px-5 py-2 text-xs tracking-[0.2em] uppercase text-[#4a9eff]">
                {t.quantumMindPage.ctaBadge}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] font-[family-name:var(--font-heading)] mb-6">
              {t.quantumMindPage.ctaTitle}
              <span className="gradient-text-nebula">
                {t.quantumMindPage.ctaTitleAccent}
              </span>
              {t.quantumMindPage.ctaTitleEnd}
            </h2>
            <p className="text-base md:text-lg text-gray-400 leading-relaxed mb-10 max-w-xl mx-auto">
              {t.quantumMindPage.ctaDescription}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="group relative inline-flex items-center gap-2 rounded-xl bg-[#4a9eff] px-8 py-4 text-sm font-semibold tracking-wider uppercase text-white transition-all duration-300 hover:bg-[#5aafff] hover:shadow-[0_0_30px_rgba(74,158,255,0.3)]"
              >
                {t.contact.scheduleCall}
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-xl glass glass-hover px-8 py-4 text-sm font-medium tracking-wider uppercase text-gray-300 transition-colors duration-300 hover:text-white"
              >
                {t.nav.services}
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

    </main>
  );
}
