'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';

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
// Animated Data Grid (pulsing dots)
// ---------------------------------------------------------------------------
function DataGrid() {
  const COLS = 16;
  const ROWS = 10;
  return (
    <div className="relative w-full max-w-lg mx-auto aspect-[16/10]">
      <div
        className="grid gap-[6px] sm:gap-2 w-full h-full"
        style={{
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        }}
      >
        {Array.from({ length: COLS * ROWS }).map((_, i) => {
          const col = i % COLS;
          const row = Math.floor(i / COLS);
          const distFromCenter = Math.sqrt(
            Math.pow(col - COLS / 2, 2) + Math.pow(row - ROWS / 2, 2)
          );
          const intensity = Math.max(0, 1 - distFromCenter / 9);
          const isTeal = intensity > 0.5;
          const isOrange = intensity > 0.3 && intensity <= 0.5;
          return (
            <motion.div
              key={i}
              className="rounded-full"
              style={{
                backgroundColor: isTeal
                  ? `rgba(45, 138, 138, ${0.3 + intensity * 0.7})`
                  : isOrange
                    ? `rgba(196, 98, 58, ${0.2 + intensity * 0.5})`
                    : 'rgba(255, 255, 255, 0.06)',
              }}
              animate={{
                scale: isTeal ? [1, 1.4, 1] : isOrange ? [1, 1.2, 1] : 1,
                opacity: isTeal
                  ? [0.5, 1, 0.5]
                  : isOrange
                    ? [0.3, 0.7, 0.3]
                    : 0.15,
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: 'easeInOut',
              }}
            />
          );
        })}
      </div>
      {/* Glow overlay */}
      <div className="absolute inset-0 pointer-events-none bg-radial-[ellipse_at_center] from-[#2d8a8a]/10 via-transparent to-transparent" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Animated Bar Chart
// ---------------------------------------------------------------------------
function AnimatedBarChart() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });

  const traditional = [35, 42, 38, 45, 40, 48, 44, 50];
  const aiPowered = [35, 52, 61, 72, 78, 88, 92, 97];

  return (
    <div ref={ref} className="w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-6 mb-6 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-white/20" />
          <span className="text-xs text-gray-500 uppercase tracking-wider">
            Traditional
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-[#2d8a8a]" />
          <span className="text-xs text-gray-500 uppercase tracking-wider">
            AI-Powered
          </span>
        </div>
      </div>
      <div className="flex items-end gap-[6px] sm:gap-2 h-48 sm:h-64">
        {traditional.map((val, i) => (
          <div key={i} className="flex-1 flex items-end gap-[2px] sm:gap-1 h-full">
            <motion.div
              className="flex-1 rounded-t-sm bg-white/10"
              initial={{ height: 0 }}
              animate={isInView ? { height: `${val}%` } : { height: 0 }}
              transition={{
                duration: 0.8,
                delay: i * 0.08,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            />
            <motion.div
              className="flex-1 rounded-t-sm"
              style={{
                background: `linear-gradient(to top, #2d8a8a, ${aiPowered[i] > 80 ? '#3aafaf' : '#2d8a8a'})`,
              }}
              initial={{ height: 0 }}
              animate={isInView ? { height: `${aiPowered[i]}%` } : { height: 0 }}
              transition={{
                duration: 0.8,
                delay: i * 0.08 + 0.15,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-3 px-1">
        {['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8'].map((q) => (
          <span key={q} className="text-[10px] text-gray-600 tracking-wider">
            {q}
          </span>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Data Flow Pipeline
// ---------------------------------------------------------------------------
function DataFlowPipeline() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const steps = [
    { label: 'Raw Data', icon: 'db' },
    { label: 'Processing', icon: 'cpu' },
    { label: 'AI Models', icon: 'brain' },
    { label: 'Insights', icon: 'chart' },
    { label: 'Action', icon: 'rocket' },
  ];

  return (
    <div ref={ref} className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row items-center gap-3 md:gap-0">
        {steps.map((step, i) => (
          <React.Fragment key={step.label}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={
                isInView
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.8 }
              }
              transition={{
                duration: 0.5,
                delay: i * 0.15,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="relative group flex-shrink-0"
            >
              <div className="glass glass-hover rounded-xl px-5 py-4 sm:px-6 sm:py-5 text-center min-w-[120px] transition-colors duration-300">
                <div className="mb-2 flex justify-center">
                  <PipelineIcon type={step.icon} />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-300 tracking-wide">
                  {step.label}
                </span>
              </div>
              {/* Active pulse ring */}
              <motion.div
                className="absolute -inset-[1px] rounded-xl border border-[#2d8a8a]/0"
                animate={
                  isInView
                    ? {
                        borderColor: [
                          'rgba(45,138,138,0)',
                          'rgba(45,138,138,0.3)',
                          'rgba(45,138,138,0)',
                        ],
                      }
                    : {}
                }
                transition={{
                  duration: 2,
                  delay: i * 0.3 + 1,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              />
            </motion.div>
            {i < steps.length - 1 && (
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={
                  isInView
                    ? { opacity: 1, scaleX: 1 }
                    : { opacity: 0, scaleX: 0 }
                }
                transition={{ duration: 0.4, delay: i * 0.15 + 0.1 }}
                className="hidden md:block w-8 lg:w-12 h-[1px] bg-gradient-to-r from-[#2d8a8a]/40 to-[#2d8a8a]/10 origin-left"
              />
            )}
            {i < steps.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 0.4 } : { opacity: 0 }}
                transition={{ duration: 0.4, delay: i * 0.15 + 0.1 }}
                className="block md:hidden h-6 w-[1px] bg-gradient-to-b from-[#2d8a8a]/40 to-[#2d8a8a]/10"
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function PipelineIcon({ type }: { type: string }) {
  const cls = 'w-5 h-5 text-[#2d8a8a]';
  switch (type) {
    case 'db':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
          <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
        </svg>
      );
    case 'cpu':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <rect x="9" y="9" width="6" height="6" />
          <path d="M15 2v2M9 2v2M15 20v2M9 20v2M2 15h2M2 9h2M20 15h2M20 9h2" />
        </svg>
      );
    case 'brain':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z" />
          <path d="M9 21h6M10 17v4M14 17v4" />
        </svg>
      );
    case 'chart':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18" />
          <path d="M7 16l4-8 4 4 5-10" />
        </svg>
      );
    case 'rocket':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
          <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
          <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
          <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
        </svg>
      );
    default:
      return null;
  }
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
export default function DataSingularityPage() {
  const features = [
    {
      title: 'Predictive Modeling & Forecasting',
      description:
        'Machine learning models that see patterns invisible to the human eye. Forecast revenue, demand, churn, and market shifts with precision that transforms uncertainty into strategy.',
      color: '#2d8a8a',
    },
    {
      title: 'Anomaly Detection & Risk Assessment',
      description:
        'Real-time surveillance of your data streams. Our AI catches outliers, fraud signals, and system anomalies before they cascade into costly failures.',
      color: '#c4623a',
    },
    {
      title: 'Customer Behavior Analysis',
      description:
        'Deep behavioral segmentation powered by neural networks. Understand not just what your customers do, but predict what they will do next.',
      color: '#4a9eff',
    },
    {
      title: 'Real-time Data Pipelines',
      description:
        'Stream processing architecture that ingests, transforms, and serves insights at the speed of your business. Sub-second latency from event to action.',
      color: '#2d8a8a',
    },
  ];

  const industries = [
    {
      name: 'Finance',
      desc: 'Risk modeling, fraud detection, algorithmic trading signals',
    },
    {
      name: 'E-commerce',
      desc: 'Demand forecasting, dynamic pricing, recommendation engines',
    },
    {
      name: 'Healthcare',
      desc: 'Patient outcome prediction, resource optimization, diagnostics',
    },
    {
      name: 'Energy',
      desc: 'Grid load forecasting, predictive maintenance, consumption analysis',
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
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full bg-[#2d8a8a]/[0.04] blur-[150px]" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-6 text-xs sm:text-sm tracking-[0.3em] uppercase text-[#2d8a8a]"
          >
            Predictive Analytics
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-[-0.03em] text-white font-[family-name:var(--font-heading)] leading-[0.9]"
          >
            DATA
            <br />
            <span className="gradient-text-nebula">SINGULARITY</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-6 max-w-lg text-base sm:text-lg text-gray-400 leading-relaxed"
          >
            Turn Data Into Destiny
          </motion.p>

          {/* Data Grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="mt-12 w-full"
          >
            <DataGrid />
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
                Explore
              </span>
              <div className="h-8 w-[1px] bg-gradient-to-b from-gray-500 to-transparent" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================================================================
          LIVE CHART SECTION
          ================================================================ */}
      <AnimatedSection className="relative py-28 md:py-36">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/4 w-[600px] h-[400px] rounded-full bg-[#2d8a8a]/[0.02] blur-[120px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
          <div className="text-center mb-16">
            <p className="mb-4 text-xs tracking-[0.3em] uppercase text-[#2d8a8a]">
              Performance
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] font-[family-name:var(--font-heading)]">
              AI-Powered Predictions
              <br />
              <span className="gradient-text-nebula">vs Traditional</span>
            </h2>
          </div>
          <AnimatedBarChart />
        </div>
      </AnimatedSection>

      {/* ================================================================
          FEATURES
          ================================================================ */}
      <section className="relative py-28 md:py-36">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] rounded-full bg-[#c4623a]/[0.02] blur-[100px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
          <AnimatedSection className="text-center mb-16 md:mb-20">
            <p className="mb-4 text-xs tracking-[0.3em] uppercase text-[#c4623a]">
              Capabilities
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] font-[family-name:var(--font-heading)]">
              Intelligence{' '}
              <span className="gradient-text-nebula">Stack</span>
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {features.map((feature, i) => {
              const ref = useRef<HTMLDivElement>(null);
              const isInView = useInView(ref, { once: true, amount: 0.3 });
              return (
                <motion.div
                  key={feature.title}
                  ref={ref}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  animate={isInView ? 'visible' : 'hidden'}
                  whileHover={{ y: -4, transition: { duration: 0.25 } }}
                  className="group relative rounded-2xl glass glass-hover p-8 md:p-10 transition-colors duration-300"
                >
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-[#2d8a8a]/5 to-[#c4623a]/5" />
                  <div className="relative z-10">
                    <div
                      className="mb-5 h-1 w-12 rounded-full"
                      style={{ backgroundColor: feature.color }}
                    />
                    <h3 className="mb-3 text-xl font-semibold tracking-tight text-white font-[family-name:var(--font-heading)]">
                      {feature.title}
                    </h3>
                    <p className="text-[15px] leading-relaxed text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================
          INDUSTRIES
          ================================================================ */}
      <AnimatedSection className="relative py-28 md:py-36">
        <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
          <div className="text-center mb-16 md:mb-20">
            <p className="mb-4 text-xs tracking-[0.3em] uppercase text-[#4a9eff]">
              Industries
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] font-[family-name:var(--font-heading)]">
              Where Data Becomes{' '}
              <span className="gradient-text-nebula">Power</span>
            </h2>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {industries.map((industry) => (
              <motion.div
                key={industry.name}
                variants={staggerChild}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                className="glass glass-hover rounded-2xl p-6 md:p-8 transition-colors duration-300 text-center"
              >
                <h4 className="text-lg font-semibold text-white mb-2 font-[family-name:var(--font-heading)]">
                  {industry.name}
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {industry.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ================================================================
          STATS
          ================================================================ */}
      <section className="relative py-28 md:py-36">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-[#2d8a8a]/[0.03] blur-[120px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-6 md:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard value="3.2x" label="ROI Average" index={0} />
            <StatCard value="40%" label="Cost Reduction" index={1} />
            <StatCard value="89%" label="Forecast Accuracy" index={2} />
          </div>
        </div>
      </section>

      {/* ================================================================
          DATA FLOW PIPELINE
          ================================================================ */}
      <AnimatedSection className="relative py-28 md:py-36">
        <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
          <div className="text-center mb-16 md:mb-20">
            <p className="mb-4 text-xs tracking-[0.3em] uppercase text-[#2d8a8a]">
              Architecture
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] font-[family-name:var(--font-heading)]">
              End-to-End{' '}
              <span className="gradient-text-nebula">Pipeline</span>
            </h2>
          </div>
          <DataFlowPipeline />
        </div>
      </AnimatedSection>

      {/* ================================================================
          CTA
          ================================================================ */}
      <section className="relative py-28 md:py-36">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#2d8a8a]/20 to-transparent" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl px-6 md:px-12 text-center">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] font-[family-name:var(--font-heading)] mb-6">
              Ready to{' '}
              <span className="gradient-text-nebula">
                Unlock Your Data
              </span>
              ?
            </h2>
            <p className="text-base md:text-lg text-gray-400 leading-relaxed mb-10 max-w-xl mx-auto">
              Your data holds the answers. Let our AI find the questions you
              haven&apos;t thought to ask yet.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="group relative inline-flex items-center gap-2 rounded-xl bg-[#2d8a8a] px-8 py-4 text-sm font-semibold tracking-wider uppercase text-white transition-all duration-300 hover:bg-[#3aafaf] hover:shadow-[0_0_30px_rgba(45,138,138,0.3)]"
              >
                Unlock Your Data
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
                Back to Services
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

    </main>
  );
}
