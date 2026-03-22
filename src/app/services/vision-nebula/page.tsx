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
// Scanning line animation component
// ---------------------------------------------------------------------------
function ScanLine() {
  return (
    <motion.div
      className="absolute left-0 right-0 h-[2px] z-20 pointer-events-none"
      style={{
        background: 'linear-gradient(90deg, transparent 0%, #4a9eff 20%, #4a9eff 80%, transparent 100%)',
        boxShadow: '0 0 20px rgba(74, 158, 255, 0.5), 0 0 60px rgba(74, 158, 255, 0.2)',
      }}
      animate={{
        top: ['0%', '100%', '0%'],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Detection box overlay component
// ---------------------------------------------------------------------------
function DetectionBox({
  x,
  y,
  width,
  height,
  label,
  confidence,
  color,
  delay,
}: {
  x: string;
  y: string;
  width: string;
  height: string;
  label: string;
  confidence: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      className="absolute z-30 pointer-events-none"
      style={{ left: x, top: y, width, height }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: [0, 1, 1, 0.7, 1], scale: 1 }}
      transition={{ duration: 1.5, delay, repeat: Infinity, repeatDelay: 4 }}
    >
      <div
        className="w-full h-full rounded-lg border-2"
        style={{ borderColor: color }}
      />
      <div
        className="absolute -top-6 left-0 flex items-center gap-1.5 rounded px-2 py-0.5"
        style={{ backgroundColor: color }}
      >
        <span className="text-[10px] font-medium text-white tracking-wide">
          {label}
        </span>
        <span className="text-[9px] text-white/70">
          {confidence}
        </span>
      </div>
      {/* Corner markers */}
      {[
        'top-0 left-0 border-t-2 border-l-2',
        'top-0 right-0 border-t-2 border-r-2',
        'bottom-0 left-0 border-b-2 border-l-2',
        'bottom-0 right-0 border-b-2 border-r-2',
      ].map((pos) => (
        <div
          key={pos}
          className={`absolute ${pos} w-3 h-3`}
          style={{ borderColor: color }}
        />
      ))}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Features
// ---------------------------------------------------------------------------
const features = [
  {
    title: 'Object Detection & Classification',
    description:
      'State-of-the-art detection models that identify and classify thousands of object categories in real-time. From YOLO to custom architectures for your domain.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <rect x="7" y="7" width="10" height="10" rx="1" />
      </svg>
    ),
  },
  {
    title: 'Facial Recognition & Analysis',
    description:
      'Privacy-first facial analysis for age estimation, sentiment detection, and identity verification. GDPR-compliant with on-device processing options.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
  },
  {
    title: 'Medical Image Processing',
    description:
      'FDA-pathway diagnostic imaging AI for radiology, pathology, and dermatology. Assistive detection that helps clinicians catch what the eye might miss.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    title: 'Industrial Quality Control',
    description:
      'Automated visual inspection for manufacturing lines. Detect defects at microscopic scale with sub-millisecond processing and zero false negatives.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
];

// ---------------------------------------------------------------------------
// Industries
// ---------------------------------------------------------------------------
const industries = [
  {
    name: 'Healthcare',
    description: 'Diagnostic imaging, pathology analysis, patient monitoring, surgical assistance.',
    color: '#4a9eff',
    stat: '15+ Hospital Partners',
  },
  {
    name: 'Manufacturing',
    description: 'Defect detection, assembly verification, predictive maintenance, safety compliance.',
    color: '#2d8a8a',
    stat: '99.99% Uptime',
  },
  {
    name: 'Retail',
    description: 'Shelf analytics, customer flow, inventory monitoring, loss prevention.',
    color: '#c4623a',
    stat: '40% Shrink Reduction',
  },
  {
    name: 'Security',
    description: 'Perimeter monitoring, anomaly detection, crowd analytics, access control.',
    color: '#c4847a',
    stat: '24/7 Surveillance',
  },
];

// ---------------------------------------------------------------------------
// Accuracy stats
// ---------------------------------------------------------------------------
const accuracyStats = [
  { value: '99.7%', label: 'Detection Accuracy', detail: 'Across all benchmarks' },
  { value: 'Real-time', label: 'Processing Speed', detail: '30+ FPS on edge devices' },
  { value: '<50ms', label: 'Edge Inference', detail: 'NVIDIA Jetson & Apple Neural' },
  { value: '10M+', label: 'Images Processed', detail: 'Monthly across deployments' },
];

// ===========================================================================
// PAGE
// ===========================================================================
export default function VisionNebulaPage() {
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
          NAVIGATION
          ================================================================ */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 lg:px-16 py-6"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0a0a0f]/80 to-transparent pointer-events-none" />
        <Link href="/" className="relative z-10 text-2xl font-bold tracking-[0.2em] text-white font-[family-name:var(--font-heading)]">
          HEAVEN
        </Link>
        <div className="relative z-10 hidden sm:flex items-center gap-8">
          <Link href="/" className="relative text-sm tracking-widest uppercase text-gray-300 hover:text-white transition-colors duration-300 after:absolute after:bottom-[-4px] after:left-0 after:h-[1px] after:w-0 after:bg-[#4a9eff] hover:after:w-full after:transition-all after:duration-300">
            Home
          </Link>
          <Link href="/services" className="relative text-sm tracking-widest uppercase text-gray-300 hover:text-white transition-colors duration-300 after:absolute after:bottom-[-4px] after:left-0 after:h-[1px] after:w-0 after:bg-[#4a9eff] hover:after:w-full after:transition-all after:duration-300">
            Services
          </Link>
          <Link href="/contact" className="relative text-sm tracking-widest uppercase text-gray-300 hover:text-white transition-colors duration-300 after:absolute after:bottom-[-4px] after:left-0 after:h-[1px] after:w-0 after:bg-[#4a9eff] hover:after:w-full after:transition-all after:duration-300">
            Contact
          </Link>
        </div>
      </motion.nav>

      {/* ================================================================
          HERO WITH SCANNING LINE
          ================================================================ */}
      <section ref={heroRef} className="relative h-[90vh] min-h-[700px] w-full overflow-hidden">
        {/* Parallax nebula */}
        <motion.div className="absolute inset-[-20%] w-[140%] h-[140%]" style={{ y: heroImgY }}>
          <Image src="/nebula-4k.jpg" alt="Vision Nebula background" fill className="object-cover" sizes="100vw" priority />
        </motion.div>

        {/* Scanning line effect */}
        <ScanLine />

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0a0a0f]/50 to-[#0a0a0f]" />

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-[0.04] z-10" style={{ backgroundImage: 'linear-gradient(rgba(74,158,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(74,158,255,0.3) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        {/* Hero content */}
        <motion.div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center"
          style={{ opacity: heroOpacity }}
        >
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8 flex items-center gap-2 text-xs tracking-widest uppercase text-gray-500"
          >
            <Link href="/services" className="hover:text-[#4a9eff] transition-colors duration-300">Services</Link>
            <span>/</span>
            <span className="text-[#4a9eff]">Vision Nebula</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-bold tracking-[-0.04em] font-[family-name:var(--font-heading)] leading-[0.85]"
          >
            <span className="text-white">VISION</span>
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #4a9eff 0%, #2d8a8a 50%, #4a9eff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              NEBULA
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8 text-lg sm:text-xl md:text-2xl text-gray-300 font-[family-name:var(--font-heading)] tracking-wide"
          >
            See What Others <span className="text-[#4a9eff]">Can&apos;t</span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="mt-4 max-w-md text-sm text-gray-500 leading-relaxed"
          >
            Computer vision and image recognition systems that detect,
            classify, and understand visual data in real-time.
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
                Analyze
              </span>
              <div className="h-8 w-[1px] bg-gradient-to-b from-gray-500 to-transparent" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ================================================================
          IMAGE ANALYSIS DEMO
          ================================================================ */}
      <section className="relative py-24 md:py-32 lg:py-40">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[30%] right-[5%] w-[500px] h-[500px] rounded-full bg-[#4a9eff]/[0.02] blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
          <AnimatedSection className="mb-16 md:mb-20 text-center">
            <p className="mb-4 text-xs tracking-[0.3em] uppercase text-[#4a9eff]">
              Live Analysis
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] font-[family-name:var(--font-heading)]">
              Detection in <span className="gradient-text-nebula">Action</span>
            </h2>
            <p className="mt-6 max-w-xl mx-auto text-base text-gray-400">
              Watch our models analyze and annotate visual data in real-time.
            </p>
          </AnimatedSection>

          {/* Demo image with detection overlays */}
          <AnimatedSection>
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden glass border border-white/[0.06]">
              {/* Nebula image */}
              <Image
                src="/nebula-2k.jpg"
                alt="Vision analysis demo"
                fill
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />

              {/* Scanning line */}
              <ScanLine />

              {/* Detection boxes */}
              <DetectionBox
                x="10%" y="15%" width="25%" height="30%"
                label="Nebula Core" confidence="99.8%"
                color="#4a9eff" delay={0}
              />
              <DetectionBox
                x="55%" y="25%" width="20%" height="25%"
                label="Star Cluster" confidence="97.2%"
                color="#2d8a8a" delay={0.8}
              />
              <DetectionBox
                x="30%" y="55%" width="35%" height="30%"
                label="Dust Lane" confidence="95.6%"
                color="#c4623a" delay={1.6}
              />

              {/* Scan data overlay */}
              <div className="absolute top-4 left-4 z-30">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="glass rounded-lg px-4 py-3"
                >
                  <p className="text-[10px] tracking-widest uppercase text-[#4a9eff] mb-1">Analysis Status</p>
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="h-1.5 w-1.5 rounded-full bg-green-400"
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <p className="text-[11px] text-gray-300">Processing -- 3 objects detected</p>
                  </div>
                </motion.div>
              </div>

              {/* Bottom info bar */}
              <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/80 to-transparent px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] tracking-wider uppercase text-gray-500">Model: YOLO-v9 Custom</span>
                    <span className="text-[10px] tracking-wider uppercase text-gray-500">FPS: 32</span>
                  </div>
                  <span className="text-[10px] tracking-wider uppercase text-[#4a9eff]">Real-time Inference</span>
                </div>
              </div>

              {/* Darkened edges */}
              <div className="absolute inset-0 z-10 shadow-[inset_0_0_60px_rgba(0,0,0,0.5)] pointer-events-none" />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ================================================================
          FEATURES
          ================================================================ */}
      <section className="relative py-24 md:py-32">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[50%] left-[20%] w-[400px] h-[400px] rounded-full bg-[#2d8a8a]/[0.015] blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
          <AnimatedSection className="mb-16 md:mb-20 text-center">
            <p className="mb-4 text-xs tracking-[0.3em] uppercase text-[#4a9eff]">
              Capabilities
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] font-[family-name:var(--font-heading)]">
              What Our Eyes <span className="gradient-text-nebula">See</span>
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {features.map((feature, i) => (
              <StaggerCard key={feature.title} index={i}>
                <div className="group relative h-full rounded-2xl glass glass-hover p-8 md:p-10 transition-all duration-500">
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-br from-[#4a9eff]/5 to-transparent" />
                  <div className="relative z-10">
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#4a9eff]/10 text-[#4a9eff]">
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
          INDUSTRY APPLICATIONS
          ================================================================ */}
      <section className="relative py-24 md:py-32 lg:py-40">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute bottom-[20%] right-[15%] w-[500px] h-[400px] rounded-full bg-[#4a9eff]/[0.02] blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
          <AnimatedSection className="mb-16 md:mb-20 text-center">
            <p className="mb-4 text-xs tracking-[0.3em] uppercase text-[#2d8a8a]">
              Industries
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] font-[family-name:var(--font-heading)]">
              Where We <span className="gradient-text-nebula">Deploy</span>
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            {industries.map((ind, i) => (
              <StaggerCard key={ind.name} index={i}>
                <div className="group relative rounded-2xl glass glass-hover p-8 md:p-10 transition-all duration-500 h-full">
                  {/* Top accent line */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-30 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `linear-gradient(to right, ${ind.color}, transparent)` }}
                  />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-2.5 w-2.5 rounded-full mt-1" style={{ backgroundColor: ind.color }} />
                      <span className="text-[11px] tracking-wider uppercase font-medium" style={{ color: ind.color }}>
                        {ind.stat}
                      </span>
                    </div>
                    <h3 className="mb-3 text-xl font-semibold tracking-tight text-white font-[family-name:var(--font-heading)]">
                      {ind.name}
                    </h3>
                    <p className="text-[15px] leading-relaxed text-gray-400">
                      {ind.description}
                    </p>
                  </div>
                </div>
              </StaggerCard>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          ACCURACY SHOWCASE
          ================================================================ */}
      <section className="relative py-20 md:py-28">
        <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
          <AnimatedSection>
            <div className="rounded-2xl glass p-10 md:p-14 border border-[#4a9eff]/10">
              {/* Section label */}
              <p className="mb-8 text-center text-xs tracking-[0.3em] uppercase text-[#4a9eff]">
                Performance Metrics
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                {accuracyStats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-[family-name:var(--font-heading)] tracking-tight">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-sm font-medium text-gray-300">
                      {stat.label}
                    </p>
                    <p className="mt-1 text-[11px] text-gray-600">
                      {stat.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ================================================================
          CTA
          ================================================================ */}
      <section className="relative py-24 md:py-32">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] rounded-full bg-[#4a9eff]/[0.03] blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 md:px-12 text-center">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] font-[family-name:var(--font-heading)] mb-6">
              Ready to enhance your{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #4a9eff, #2d8a8a)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                vision
              </span>
              ?
            </h2>
            <p className="max-w-xl mx-auto text-base text-gray-400 leading-relaxed mb-10">
              From proof-of-concept to production deployment, we will build
              computer vision systems that see what matters most to your business.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 rounded-full bg-[#4a9eff] px-8 py-4 text-sm font-medium tracking-wide text-white transition-all duration-300 hover:bg-[#5ab0ff] hover:shadow-[0_0_30px_rgba(74,158,255,0.3)]"
              >
                Enhance Your Vision
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
                Back to Services
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ================================================================
          FOOTER
          ================================================================ */}
      <footer className="relative border-t border-white/[0.04]">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#4a9eff]/20 to-transparent" />
        <div className="mx-auto max-w-6xl px-6 md:px-12 py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Link href="/" className="text-lg font-bold tracking-[0.2em] text-gray-500 hover:text-white transition-colors duration-300 font-[family-name:var(--font-heading)]">
              HEAVEN
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/services" className="text-sm text-gray-500 hover:text-[#4a9eff] transition-colors duration-300">Services</Link>
              <Link href="/contact" className="text-sm text-gray-500 hover:text-[#4a9eff] transition-colors duration-300">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
