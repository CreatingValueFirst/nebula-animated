'use client';

import React, { useRef, useEffect, useState } from 'react';
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
// Typing Code Animation
// ---------------------------------------------------------------------------
const CODE_LINES = [
  { text: 'import', color: '#c4623a' },
  { text: ' { NeuralEngine }', color: '#e8e8ec' },
  { text: ' from', color: '#c4623a' },
  { text: " '@nebula/ai';", color: '#2d8a8a' },
  { text: '\n', color: '' },
  { text: '\n', color: '' },
  { text: 'const', color: '#c4623a' },
  { text: ' model', color: '#4a9eff' },
  { text: ' = ', color: '#e8e8ec' },
  { text: 'await', color: '#c4623a' },
  { text: ' NeuralEngine', color: '#e8e8ec' },
  { text: '.create', color: '#4a9eff' },
  { text: '({', color: '#e8e8ec' },
  { text: '\n', color: '' },
  { text: '  architecture', color: '#e8e8ec' },
  { text: ': ', color: '#e8e8ec' },
  { text: "'transformer-xl'", color: '#2d8a8a' },
  { text: ',', color: '#e8e8ec' },
  { text: '\n', color: '' },
  { text: '  layers', color: '#e8e8ec' },
  { text: ': ', color: '#e8e8ec' },
  { text: '128', color: '#c4623a' },
  { text: ',', color: '#e8e8ec' },
  { text: '\n', color: '' },
  { text: '  precision', color: '#e8e8ec' },
  { text: ': ', color: '#e8e8ec' },
  { text: "'fp16'", color: '#2d8a8a' },
  { text: ',', color: '#e8e8ec' },
  { text: '\n', color: '' },
  { text: '});', color: '#e8e8ec' },
  { text: '\n', color: '' },
  { text: '\n', color: '' },
  { text: 'const', color: '#c4623a' },
  { text: ' prediction', color: '#4a9eff' },
  { text: ' = ', color: '#e8e8ec' },
  { text: 'model', color: '#e8e8ec' },
  { text: '.predict', color: '#4a9eff' },
  { text: '(data);', color: '#e8e8ec' },
  { text: '\n', color: '' },
  { text: 'console', color: '#e8e8ec' },
  { text: '.log', color: '#4a9eff' },
  { text: '(', color: '#e8e8ec' },
  { text: "'Accuracy:'", color: '#2d8a8a' },
  { text: ', prediction.', color: '#e8e8ec' },
  { text: 'score', color: '#4a9eff' },
  { text: ');', color: '#e8e8ec' },
  { text: '\n', color: '' },
  { text: '// => Accuracy: 0.9847', color: 'rgba(255,255,255,0.3)' },
];

function TypingCodeEditor() {
  const [visibleChars, setVisibleChars] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const totalChars = CODE_LINES.reduce((acc, l) => acc + l.text.length, 0);

  useEffect(() => {
    if (!isInView) return;
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setVisibleChars(current);
      if (current >= totalChars) {
        clearInterval(interval);
      }
    }, 28);
    return () => clearInterval(interval);
  }, [isInView, totalChars]);

  // Build visible text
  let charsLeft = visibleChars;
  const rendered: React.ReactNode[] = [];
  for (let i = 0; i < CODE_LINES.length; i++) {
    const line = CODE_LINES[i];
    if (charsLeft <= 0) break;
    const showLen = Math.min(charsLeft, line.text.length);
    const showText = line.text.slice(0, showLen);
    charsLeft -= showLen;
    if (line.text === '\n') {
      rendered.push(<br key={`br-${i}`} />);
    } else {
      rendered.push(
        <span key={i} style={{ color: line.color }}>
          {showText}
        </span>
      );
    }
  }

  return (
    <div ref={ref} className="w-full max-w-2xl mx-auto">
      <div className="rounded-2xl overflow-hidden border border-white/[0.06]">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.03] border-b border-white/[0.04]">
          <div className="w-3 h-3 rounded-full bg-[#8b2020]/60" />
          <div className="w-3 h-3 rounded-full bg-[#c4623a]/40" />
          <div className="w-3 h-3 rounded-full bg-[#2d8a8a]/40" />
          <span className="ml-3 text-[11px] text-gray-600 tracking-wider">
            model.ts
          </span>
        </div>
        {/* Code area */}
        <div className="p-5 sm:p-6 bg-[#0d0d14] font-mono text-sm sm:text-[13px] leading-relaxed min-h-[280px]">
          <div className="flex">
            {/* Line numbers */}
            <div className="pr-4 sm:pr-6 text-right select-none text-gray-700 text-xs leading-relaxed">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            {/* Code content */}
            <div className="flex-1 overflow-x-auto">
              <code>{rendered}</code>
              {/* Blinking cursor */}
              {visibleChars < totalChars && (
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="inline-block w-[2px] h-[14px] bg-[#2d8a8a] ml-[1px] align-middle"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Before/After Timeline
// ---------------------------------------------------------------------------
function BeforeAfter() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <div ref={ref} className="w-full max-w-3xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-0">
        {/* Before */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="glass rounded-2xl md:rounded-r-none p-8 md:p-10 text-center md:border-r-0"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-gray-500 mb-4">
            Manual Development
          </p>
          <div className="text-4xl sm:text-5xl font-bold text-white/30 font-[family-name:var(--font-heading)] mb-2">
            6 months
          </div>
          <p className="text-sm text-gray-500">
            Traditional sprint cycles, manual code review, extensive debugging
          </p>
        </motion.div>

        {/* After */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
          transition={{
            duration: 0.6,
            delay: 0.15,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="relative glass rounded-2xl md:rounded-l-none p-8 md:p-10 text-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#2d8a8a]/5 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <p className="text-xs tracking-[0.3em] uppercase text-[#2d8a8a] mb-4">
              With Code Pulsar
            </p>
            <div className="text-4xl sm:text-5xl font-bold gradient-text-nebula font-[family-name:var(--font-heading)] mb-2">
              3 weeks
            </div>
            <p className="text-sm text-gray-400">
              AI-accelerated development, automated testing, intelligent
              optimization
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tech Stack Pills
// ---------------------------------------------------------------------------
function TechStack() {
  const languages = [
    { name: 'Python', color: '#2d8a8a' },
    { name: 'TypeScript', color: '#4a9eff' },
    { name: 'Rust', color: '#c4623a' },
    { name: 'Go', color: '#2d8a8a' },
    { name: 'Java', color: '#c4623a' },
    { name: 'C++', color: '#4a9eff' },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="flex flex-wrap items-center justify-center gap-3 sm:gap-4"
    >
      {languages.map((lang) => (
        <motion.div
          key={lang.name}
          variants={staggerChild}
          whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          className="glass glass-hover rounded-full px-6 py-3 transition-colors duration-300 cursor-default"
        >
          <span
            className="text-sm font-medium tracking-wider"
            style={{ color: lang.color }}
          >
            {lang.name}
          </span>
        </motion.div>
      ))}
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
export default function CodePulsarPage() {
  const { t } = useLanguage();
  const features = [
    {
      title: 'AI Code Generation & Completion',
      description:
        'Context-aware code generation that understands your entire codebase. From single functions to complete modules, our AI writes production-ready code that follows your team\'s conventions.',
      icon: 'code',
    },
    {
      title: 'Automated Testing & Bug Detection',
      description:
        'AI-driven test generation that achieves comprehensive coverage. Static analysis powered by deep learning catches bugs that traditional linters miss entirely.',
      icon: 'shield',
    },
    {
      title: 'Code Review & Optimization',
      description:
        'Intelligent code review that goes beyond syntax. Performance bottlenecks, security vulnerabilities, and architectural concerns identified before they reach production.',
      icon: 'search',
    },
    {
      title: 'Legacy Code Modernization',
      description:
        'Transform aging codebases into modern, maintainable architectures. Our AI understands legacy patterns and rewrites them following current best practices.',
      icon: 'refresh',
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
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-[#c4623a]/[0.04] blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[300px] rounded-full bg-[#4a9eff]/[0.03] blur-[120px]" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-6 text-xs sm:text-sm tracking-[0.3em] uppercase text-[#c4623a]"
          >
            AI-Powered Development
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-[-0.03em] text-white font-[family-name:var(--font-heading)] leading-[0.9]"
          >
            CODE
            <br />
            <span className="gradient-text-nebula">PULSAR</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-6 max-w-lg text-base sm:text-lg text-gray-400 leading-relaxed"
          >
            Code at the Speed of Thought
          </motion.p>

          {/* Code Editor */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="mt-12 w-full"
          >
            <TypingCodeEditor />
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
          FEATURES
          ================================================================ */}
      <section className="relative py-28 md:py-36">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 right-1/4 w-[600px] h-[400px] rounded-full bg-[#c4623a]/[0.02] blur-[120px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
          <AnimatedSection className="text-center mb-16 md:mb-20">
            <p className="mb-4 text-xs tracking-[0.3em] uppercase text-[#c4623a]">
              Capabilities
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] font-[family-name:var(--font-heading)]">
              Development{' '}
              <span className="gradient-text-nebula">Superpowers</span>
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {features.map((feature, i) => {
              const cardRef = useRef<HTMLDivElement>(null);
              const cardInView = useInView(cardRef, {
                once: true,
                amount: 0.3,
              });
              return (
                <motion.div
                  key={feature.title}
                  ref={cardRef}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  animate={cardInView ? 'visible' : 'hidden'}
                  whileHover={{ y: -4, transition: { duration: 0.25 } }}
                  className="group relative rounded-2xl glass glass-hover p-8 md:p-10 transition-colors duration-300"
                >
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-[#c4623a]/5 to-[#4a9eff]/5" />
                  <div className="relative z-10">
                    <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-[#c4623a]/10 text-[#c4623a]">
                      <FeatureIcon type={feature.icon} />
                    </div>
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
          BEFORE / AFTER
          ================================================================ */}
      <AnimatedSection className="relative py-28 md:py-36">
        <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
          <div className="text-center mb-16 md:mb-20">
            <p className="mb-4 text-xs tracking-[0.3em] uppercase text-[#4a9eff]">
              Impact
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] font-[family-name:var(--font-heading)]">
              The{' '}
              <span className="gradient-text-nebula">Acceleration</span>
            </h2>
          </div>
          <BeforeAfter />
        </div>
      </AnimatedSection>

      {/* ================================================================
          STATS
          ================================================================ */}
      <section className="relative py-28 md:py-36">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-[#c4623a]/[0.03] blur-[120px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-6 md:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard value="10x" label="Faster Development" index={0} />
            <StatCard value="60%" label="Fewer Bugs" index={1} />
            <StatCard value="85%" label="Less Boilerplate" index={2} />
          </div>
        </div>
      </section>

      {/* ================================================================
          TECH STACK
          ================================================================ */}
      <AnimatedSection className="relative py-28 md:py-36">
        <div className="relative z-10 mx-auto max-w-4xl px-6 md:px-12 text-center">
          <p className="mb-4 text-xs tracking-[0.3em] uppercase text-[#2d8a8a]">
            Languages
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] font-[family-name:var(--font-heading)] mb-12">
            We Speak{' '}
            <span className="gradient-text-nebula">Every Language</span>
          </h2>
          <TechStack />
        </div>
      </AnimatedSection>

      {/* ================================================================
          CTA
          ================================================================ */}
      <section className="relative py-28 md:py-36">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#c4623a]/20 to-transparent" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl px-6 md:px-12 text-center">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] font-[family-name:var(--font-heading)] mb-6">
              Ready to{' '}
              <span className="gradient-text-nebula">
                Accelerate Development
              </span>
              ?
            </h2>
            <p className="text-base md:text-lg text-gray-400 leading-relaxed mb-10 max-w-xl mx-auto">
              Stop writing boilerplate. Start building the future. Let Code
              Pulsar handle the heavy lifting while your team focuses on
              what matters.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="group relative inline-flex items-center gap-2 rounded-xl bg-[#c4623a] px-8 py-4 text-sm font-semibold tracking-wider uppercase text-white transition-all duration-300 hover:bg-[#d4734a] hover:shadow-[0_0_30px_rgba(196,98,58,0.3)]"
              >
                {t.nav.getStarted}
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

// ---------------------------------------------------------------------------
// Feature Icons
// ---------------------------------------------------------------------------
function FeatureIcon({ type }: { type: string }) {
  const cls = 'w-5 h-5';
  switch (type) {
    case 'code':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
    case 'shield':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case 'search':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      );
    case 'refresh':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 2v6h-6" />
          <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
          <path d="M3 22v-6h6" />
          <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
        </svg>
      );
    default:
      return null;
  }
}
