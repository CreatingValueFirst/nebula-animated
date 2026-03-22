'use client';

import React, { useRef } from 'react';

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
// Animated Counter
// ---------------------------------------------------------------------------
function AnimatedCounter({ value, suffix = '' }: { value: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {value}{suffix}
    </motion.span>
  );
}

// ---------------------------------------------------------------------------
// Timeline Data
// ---------------------------------------------------------------------------
const timelineEvents = [
  {
    year: '2024',
    quarter: 'Q1',
    title: 'Founded in San Francisco',
    description:
      'Three researchers from Stanford AI Lab founded Heaven Interactive with a vision to build artificial intelligence that amplifies human potential.',
  },
  {
    year: '2024',
    quarter: 'Q3',
    title: 'First Neural Architecture Breakthrough',
    description:
      'Published groundbreaking research on adaptive neural architectures, achieving state-of-the-art results across 14 benchmark datasets.',
  },
  {
    year: '2025',
    quarter: 'Q1',
    title: 'Series A -- $25M Raised',
    description:
      'Led by Horizon Ventures with participation from key strategic partners. Team expanded to 50 members across engineering, research, and operations.',
  },
  {
    year: '2025',
    quarter: 'Q3',
    title: 'Launched Voice Cosmos & Vision Nebula',
    description:
      'Two flagship products went live, serving over 200 enterprise clients in the first quarter. Voice Cosmos set new standards for real-time speech synthesis.',
  },
  {
    year: '2026',
    quarter: 'Q1',
    title: 'Global Expansion',
    description:
      'Opened offices in London, Tokyo, and Berlin. Grew to 150+ team members and secured partnerships with multiple Fortune 500 companies.',
  },
];

// ---------------------------------------------------------------------------
// Values Data
// ---------------------------------------------------------------------------
const values = [
  {
    title: 'Innovation',
    description:
      'We push the boundaries of what AI can achieve. Every challenge is an opportunity to create something the world has never seen.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4" />
        <path d="m6.34 6.34 2.83 2.83" />
        <path d="M2 12h4" />
        <path d="m6.34 17.66 2.83-2.83" />
        <path d="M12 18v4" />
        <path d="m17.66 17.66-2.83-2.83" />
        <path d="M18 12h4" />
        <path d="m17.66 6.34-2.83 2.83" />
      </svg>
    ),
    gradient: 'from-[#2d8a8a]/10 to-[#4a9eff]/10',
    iconColor: 'text-[#2d8a8a]',
    iconBg: 'bg-[#2d8a8a]/10',
  },
  {
    title: 'Transparency',
    description:
      'We believe trust is earned through openness. Our models, our methods, and our intentions are always clear to the people we serve.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
    ),
    gradient: 'from-[#4a9eff]/10 to-[#2d8a8a]/10',
    iconColor: 'text-[#4a9eff]',
    iconBg: 'bg-[#4a9eff]/10',
  },
  {
    title: 'Impact',
    description:
      'Technology without purpose is noise. Every product we build is measured by the real-world difference it makes for the people who use it.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    gradient: 'from-[#c4623a]/10 to-[#2d8a8a]/10',
    iconColor: 'text-[#c4623a]',
    iconBg: 'bg-[#c4623a]/10',
  },
  {
    title: 'Excellence',
    description:
      'Good enough is never enough. We hold ourselves to the highest standard in research rigor, engineering quality, and client partnership.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    gradient: 'from-[#2d8a8a]/10 to-[#c4623a]/10',
    iconColor: 'text-[#2d8a8a]',
    iconBg: 'bg-[#2d8a8a]/10',
  },
];

// ---------------------------------------------------------------------------
// Leadership Data
// ---------------------------------------------------------------------------
const leadership = [
  {
    name: 'Elena Vasquez',
    title: 'Chief Executive Officer',
    bio: 'Former VP of AI Research at DeepMind. PhD in Machine Learning from Stanford. Published 40+ papers on neural architecture search.',
    pattern: 'radial-gradient(circle at 30% 30%, #2d8a8a 0%, transparent 50%), radial-gradient(circle at 70% 70%, #c4623a 0%, transparent 50%)',
  },
  {
    name: 'Marcus Chen',
    title: 'Chief Technology Officer',
    bio: 'Ex-Google Brain engineer. Architect of three production ML systems serving billions of requests. MIT CS alumnus.',
    pattern: 'radial-gradient(circle at 60% 20%, #4a9eff 0%, transparent 50%), radial-gradient(circle at 30% 80%, #2d8a8a 0%, transparent 50%)',
  },
  {
    name: 'Sarah Okonkwo',
    title: 'VP of Engineering',
    bio: 'Previously led infrastructure at Anthropic. Built distributed systems handling petabyte-scale data at Netflix.',
    pattern: 'radial-gradient(circle at 40% 60%, #c4623a 0%, transparent 50%), radial-gradient(circle at 80% 20%, #4a9eff 0%, transparent 50%)',
  },
  {
    name: 'Dr. James Park',
    title: 'Head of Research',
    bio: 'Pioneer in multimodal learning. Former professor at CMU. Holds 12 patents in computer vision and natural language processing.',
    pattern: 'radial-gradient(circle at 70% 40%, #2d8a8a 0%, transparent 50%), radial-gradient(circle at 20% 70%, #c4623a 0%, transparent 50%)',
  },
  {
    name: 'Amara Singh',
    title: 'VP of Sales',
    bio: 'Scaled enterprise revenue from zero to $100M at two AI startups. Former management consultant at McKinsey.',
    pattern: 'radial-gradient(circle at 50% 30%, #4a9eff 0%, transparent 50%), radial-gradient(circle at 50% 80%, #2d8a8a 0%, transparent 50%)',
  },
  {
    name: 'Liam Foster',
    title: 'VP of Design',
    bio: 'Led design at Figma and Stripe. Believes the best AI experiences feel invisible. Rhode Island School of Design graduate.',
    pattern: 'radial-gradient(circle at 30% 50%, #c4623a 0%, transparent 50%), radial-gradient(circle at 80% 50%, #4a9eff 0%, transparent 50%)',
  },
];

// ---------------------------------------------------------------------------
// Partners
// ---------------------------------------------------------------------------
const partners = [
  'Horizon Ventures',
  'Eclipse Capital',
  'Apex Partners',
  'Stratosphere Fund',
  'NovaBridge AI',
  'Titan Capital',
];

// ===========================================================================
// PAGE
// ===========================================================================
export default function AboutPage() {
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
        {/* Parallax nebula background */}
        <motion.div className="absolute inset-[-10%] w-[120%] h-[120%]" style={{ y: heroY }}>
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            poster="/nebula-4k.jpg"
          >
            <source src="/cosmic-video-2.mp4" type="video/mp4" />
          </video>
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
            Our Story
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-[-0.03em] text-white font-[family-name:var(--font-heading)] leading-[0.9]"
          >
            ABOUT
            <br />
            <span className="gradient-text-nebula">HEAVEN INTERACTIVE</span>
          </motion.h1>
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
              Scroll
            </span>
            <div className="h-8 w-[1px] bg-gradient-to-b from-gray-500 to-transparent" />
          </motion.div>
        </motion.div>
      </section>

      {/* =============================================================
          MISSION STATEMENT
          ============================================================= */}
      <section className="relative py-28 md:py-36">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-[#2d8a8a]/[0.03] blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 md:px-12 text-center">
          <AnimatedSection>
            <p className="mb-6 text-xs tracking-[0.3em] uppercase text-[#2d8a8a]">
              Our Mission
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-medium tracking-[-0.02em] text-white font-[family-name:var(--font-heading)] leading-[1.3]">
              We believe artificial intelligence should amplify human potential, not replace it.
            </h2>
            <p className="mt-8 text-lg md:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto">
              We build AI that serves humanity&apos;s greatest ambitions -- tools that make experts more powerful, organizations more effective, and breakthroughs more achievable.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* =============================================================
          STATS ROW
          ============================================================= */}
      <section className="relative py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <AnimatedSection>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {[
                { value: '2024', label: 'Founded' },
                { value: '150+', label: 'Team Members' },
                { value: '12', label: 'Countries' },
                { value: '$50M+', label: 'Revenue' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.1,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="text-center"
                >
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] text-white font-[family-name:var(--font-heading)]">
                    <AnimatedCounter value={stat.value} />
                  </div>
                  <div className="mt-2 text-sm text-gray-500 tracking-wider uppercase">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>

          {/* Divider */}
          <div className="mt-20 h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        </div>
      </section>

      {/* =============================================================
          TIMELINE
          ============================================================= */}
      <section className="relative py-28 md:py-36">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-[#c4623a]/[0.02] blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 md:px-12">
          <AnimatedSection className="mb-16 md:mb-20 text-center">
            <p className="mb-4 text-xs tracking-[0.3em] uppercase text-[#c4623a]">
              Our Journey
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] font-[family-name:var(--font-heading)]">
              Building the{' '}
              <span className="gradient-text-nebula">Future</span>
            </h2>
          </AnimatedSection>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[19px] md:left-1/2 md:-translate-x-[0.5px] top-0 bottom-0 w-[1px] bg-gradient-to-b from-[#2d8a8a]/40 via-[#c4623a]/20 to-transparent" />

            {timelineEvents.map((event, i) => {
              const isLeft = i % 2 === 0;
              return (
                <TimelineItem
                  key={`${event.year}-${event.quarter}`}
                  event={event}
                  index={i}
                  isLeft={isLeft}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* =============================================================
          VALUES
          ============================================================= */}
      <section className="relative py-28 md:py-36">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full bg-[#4a9eff]/[0.02] blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
          <AnimatedSection className="mb-16 md:mb-20 text-center">
            <p className="mb-4 text-xs tracking-[0.3em] uppercase text-[#4a9eff]">
              What We Stand For
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] font-[family-name:var(--font-heading)]">
              Our <span className="gradient-text-nebula">Values</span>
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            {values.map((value, i) => (
              <ValueCard key={value.title} value={value} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* =============================================================
          LEADERSHIP
          ============================================================= */}
      <section className="relative py-28 md:py-36">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/4 w-[600px] h-[400px] rounded-full bg-[#2d8a8a]/[0.02] blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
          <AnimatedSection className="mb-16 md:mb-20 text-center">
            <p className="mb-4 text-xs tracking-[0.3em] uppercase text-[#2d8a8a]">
              Leadership
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] font-[family-name:var(--font-heading)]">
              The Team Behind{' '}
              <span className="gradient-text-nebula">Heaven</span>
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {leadership.map((person, i) => (
              <LeadershipCard key={person.name} person={person} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* =============================================================
          PARTNERS
          ============================================================= */}
      <section className="relative py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <AnimatedSection className="text-center">
            <p className="mb-12 text-xs tracking-[0.3em] uppercase text-gray-500">
              Backed By
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 md:gap-x-16">
              {partners.map((partner, i) => (
                <motion.span
                  key={partner}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="text-lg md:text-xl font-semibold tracking-tight text-gray-600 hover:text-gray-400 transition-colors duration-300 font-[family-name:var(--font-heading)]"
                >
                  {partner}
                </motion.span>
              ))}
            </div>
          </AnimatedSection>

          {/* Divider */}
          <div className="mt-20 h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
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
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] text-white font-[family-name:var(--font-heading)] mb-6">
              Join Our <span className="gradient-text-nebula">Team</span>
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed mb-10 max-w-xl mx-auto">
              We&apos;re looking for exceptional people who want to shape the future of artificial intelligence. If that&apos;s you, we&apos;d love to hear from you.
            </p>
            <Link href="/contact">
              <motion.span
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-3 rounded-full bg-[#2d8a8a] px-8 py-4 text-sm font-semibold tracking-wider uppercase text-white transition-all duration-300 hover:bg-[#2d8a8a]/90 hover:shadow-[0_0_30px_rgba(45,138,138,0.3)]"
              >
                Get In Touch
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
// Timeline Item Component
// ---------------------------------------------------------------------------
function TimelineItem({
  event,
  index,
  isLeft,
}: {
  event: (typeof timelineEvents)[number];
  index: number;
  isLeft: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div
      ref={ref}
      className={`relative flex items-start mb-12 last:mb-0 ${
        isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
      }`}
    >
      {/* Dot */}
      <div className="absolute left-[15px] md:left-1/2 md:-translate-x-1/2 top-1 z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative"
        >
          <div className="w-[9px] h-[9px] rounded-full bg-[#2d8a8a]" />
          <div className="absolute inset-0 rounded-full bg-[#2d8a8a] animate-pulse-glow" />
        </motion.div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -24 : 24 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isLeft ? -24 : 24 }}
        transition={{
          duration: 0.5,
          delay: index * 0.1 + 0.15,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        className={`ml-12 md:ml-0 md:w-[calc(50%-2rem)] ${
          isLeft ? 'md:mr-auto md:pr-8 md:text-right' : 'md:ml-auto md:pl-8 md:text-left'
        }`}
      >
        <div className="flex items-center gap-3 mb-2 md:mb-3">
          <span
            className={`text-xs tracking-[0.2em] uppercase text-[#2d8a8a] font-semibold ${
              isLeft ? 'md:order-2' : ''
            }`}
          >
            {event.year} {event.quarter}
          </span>
        </div>
        <h3 className="text-lg md:text-xl font-semibold tracking-tight text-white font-[family-name:var(--font-heading)] mb-2">
          {event.title}
        </h3>
        <p className="text-sm text-gray-400 leading-relaxed">
          {event.description}
        </p>
      </motion.div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Value Card Component
// ---------------------------------------------------------------------------
function ValueCard({
  value,
  index,
}: {
  value: (typeof values)[number];
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
      <div
        className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br ${value.gradient}`}
      />
      <div className="relative z-10">
        <div
          className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl ${value.iconBg} ${value.iconColor}`}
        >
          {value.icon}
        </div>
        <h3 className="mb-3 text-xl font-semibold tracking-tight text-white font-[family-name:var(--font-heading)]">
          {value.title}
        </h3>
        <p className="text-[15px] leading-relaxed text-gray-400">
          {value.description}
        </p>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Leadership Card Component
// ---------------------------------------------------------------------------
function LeadershipCard({
  person,
  index,
}: {
  person: (typeof leadership)[number];
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
      className="group relative rounded-2xl glass glass-hover p-8 transition-colors duration-300 text-center"
    >
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-[#2d8a8a]/5 to-[#c4623a]/5" />

      <div className="relative z-10">
        {/* Geometric avatar */}
        <div className="mx-auto mb-6 w-20 h-20 rounded-full overflow-hidden ring-2 ring-white/[0.06] group-hover:ring-[#2d8a8a]/30 transition-all duration-500">
          <div
            className="w-full h-full"
            style={{
              background: `${person.pattern}, linear-gradient(135deg, #0d0d14, #1a1a2e)`,
            }}
          />
        </div>
        <h3 className="text-lg font-semibold tracking-tight text-white font-[family-name:var(--font-heading)]">
          {person.name}
        </h3>
        <p className="mt-1 text-xs tracking-[0.15em] uppercase text-[#2d8a8a]">
          {person.title}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-gray-400">
          {person.bio}
        </p>
      </div>
    </motion.div>
  );
}
