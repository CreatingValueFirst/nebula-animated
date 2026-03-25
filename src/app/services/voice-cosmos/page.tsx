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
// Audio Waveform Bar
// ---------------------------------------------------------------------------
function WaveformBar({ index }: { index: number }) {
  const heights = [20, 35, 55, 40, 65, 45, 70, 50, 35, 60, 45, 30, 55, 40, 25, 50, 65, 35, 45, 55];
  const h = heights[index % heights.length];

  return (
    <motion.div
      className="w-[3px] rounded-full bg-gradient-to-t from-[#c4623a] to-[#c4847a]"
      animate={{
        height: [h * 0.4, h, h * 0.6, h * 0.9, h * 0.4],
      }}
      transition={{
        duration: 1.2 + Math.random() * 0.8,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: index * 0.05,
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Chat bubble for demo
// ---------------------------------------------------------------------------
const chatMessages = [
  { role: 'user' as const, text: 'Hi, I need to reschedule my appointment for tomorrow.' },
  { role: 'agent' as const, text: 'Of course! I can see your appointment for 2:00 PM. Would you prefer morning or afternoon?' },
  { role: 'user' as const, text: 'Morning would be great, around 10 AM if possible.' },
  { role: 'agent' as const, text: 'Perfect. I have rescheduled you for 10:00 AM tomorrow. You will receive a confirmation shortly.' },
];

function ChatBubble({
  message,
  index,
}: {
  message: { role: 'user' | 'agent'; text: string };
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const isAgent = message.role === 'agent';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isAgent ? -20 : 20, y: 10 }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: isAgent ? -20 : 20, y: 10 }}
      transition={{ duration: 0.5, delay: index * 0.2, ease }}
      className={`flex ${isAgent ? 'justify-start' : 'justify-end'}`}
    >
      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3.5 ${
          isAgent
            ? 'glass border-[#c4623a]/10 rounded-bl-sm'
            : 'bg-[#2d8a8a]/10 border border-[#2d8a8a]/20 rounded-br-sm'
        }`}
      >
        <p className="text-[11px] tracking-wider uppercase mb-1.5 font-medium" style={{ color: isAgent ? '#c4623a' : '#2d8a8a' }}>
          {isAgent ? 'Voice Agent' : 'Caller'}
        </p>
        <p className="text-sm text-gray-300 leading-relaxed">
          {message.text}
        </p>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Features
// ---------------------------------------------------------------------------
const features = [
  {
    title: 'Natural Language Understanding',
    description:
      'Multilingual NLU that grasps intent, context, and nuance across 35+ languages. Your agent understands colloquialisms, accents, and complex queries.',
    stat: '35+ Languages',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    title: 'Real-time Voice Synthesis',
    description:
      'Sub-100ms text-to-speech with natural prosody, breathing patterns, and emotional inflection. Indistinguishable from human conversation.',
    stat: '<100ms Latency',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    title: 'Emotion Detection & Adaptation',
    description:
      'Detects frustration, urgency, joy, and hesitation in real-time. The agent adapts tone, pace, and empathy level to match the caller\'s emotional state.',
    stat: '12 Emotions',
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
    title: 'CRM & Calendar Integration',
    description:
      'Connects to Salesforce, HubSpot, Google Calendar, and 200+ tools via API. The agent books, updates, and follows up without human intervention.',
    stat: '200+ Integrations',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
];

// ---------------------------------------------------------------------------
// Use cases
// ---------------------------------------------------------------------------
const useCases = [
  {
    title: 'Customer Support',
    description: '24/7 intelligent support that resolves 80% of inquiries without human escalation.',
    color: '#c4623a',
  },
  {
    title: 'Sales Qualification',
    description: 'Qualify inbound leads in real-time, capture intent, and route hot prospects instantly.',
    color: '#2d8a8a',
  },
  {
    title: 'Appointment Booking',
    description: 'Seamless scheduling that checks availability, confirms, and sends reminders.',
    color: '#4a9eff',
  },
  {
    title: 'Survey Collection',
    description: 'Conversational surveys with 3x higher completion rates than traditional forms.',
    color: '#c4847a',
  },
];

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------
const stats = [
  { value: '500K+', label: 'Conversations Handled' },
  { value: '35', label: 'Languages Supported' },
  { value: '98.5%', label: 'Customer Satisfaction' },
  { value: '<100ms', label: 'Response Latency' },
];

// ===========================================================================
// PAGE
// ===========================================================================
export default function VoiceCosmosPage() {
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
      <section ref={heroRef} className="relative h-[90vh] min-h-[700px] w-full overflow-hidden">
        {/* Parallax nebula */}
        <motion.div className="absolute inset-[-20%] w-[140%] h-[140%]" style={{ y: heroImgY }}>
          <Image src="/nebula-4k.jpg" alt="Voice Cosmos background" fill className="object-cover" sizes="100vw" priority quality={90} />
        </motion.div>

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0a0a0f]/60 to-[#0a0a0f]" />

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
            <Link href="/services" className="hover:text-[#c4623a] transition-colors duration-300">{t.nav.services}</Link>
            <span>/</span>
            <span className="text-[#c4623a]">{t.services.voiceCosmos}</span>
          </motion.div>

          {/* Audio waveform */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0.5 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-10 flex items-end justify-center gap-[3px] h-[70px]"
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <WaveformBar key={i} index={i} />
            ))}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-bold tracking-[-0.04em] font-[family-name:var(--font-heading)] leading-[0.85]"
          >
            <span className="text-white">VOICE</span>
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #c4623a 0%, #c4847a 50%, #c4623a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              COSMOS
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-8 text-lg sm:text-xl md:text-2xl text-gray-300 font-[family-name:var(--font-heading)] tracking-wide"
          >
            AI Voices That <span className="text-[#c4623a]">Understand</span>, Respond, and Connect
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
            className="mt-4 max-w-md text-sm text-gray-500 leading-relaxed"
          >
            Deploy conversational AI agents that handle calls, qualify leads,
            and delight customers -- in any language.
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
                Listen
              </span>
              <div className="h-8 w-[1px] bg-gradient-to-b from-gray-500 to-transparent" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ================================================================
          LIVE DEMO - CHAT CONVERSATION
          ================================================================ */}
      <section className="relative py-24 md:py-32 lg:py-40">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[20%] left-[15%] w-[500px] h-[400px] rounded-full bg-[#c4623a]/[0.02] blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left: text */}
            <AnimatedSection>
              <p className="mb-4 text-xs tracking-[0.3em] uppercase text-[#c4623a]">
                Live Demo
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] font-[family-name:var(--font-heading)] mb-6">
                A conversation,
                <br />
                <span className="gradient-text-nebula">not a script.</span>
              </h2>
              <p className="text-base text-gray-400 leading-relaxed mb-8">
                Our voice agents do not follow rigid decision trees. They engage in
                natural, flowing dialogue -- understanding context, remembering earlier
                parts of the conversation, and adapting in real time.
              </p>
              <div className="space-y-4">
                {[
                  'Handles interruptions and topic changes gracefully',
                  'Remembers context across the entire conversation',
                  'Knows when to escalate to a human agent',
                  'Captures structured data from unstructured speech',
                ].map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#c4623a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="text-sm text-gray-400">{point}</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            {/* Right: chat bubbles */}
            <div>
              <div className="relative rounded-2xl glass p-6 md:p-8">
                {/* Chat header */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/[0.06]">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-[#c4623a]/10 flex items-center justify-center">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c4623a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      </svg>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-[#0a0a0f]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Heaven Voice Agent</p>
                    <p className="text-[11px] text-green-400">Active now</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="space-y-4">
                  {chatMessages.map((msg, i) => (
                    <ChatBubble key={i} message={msg} index={i} />
                  ))}
                </div>

                {/* Typing indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="mt-4 flex items-center gap-2"
                >
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-[#c4623a]/50"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-gray-600">Agent is listening...</span>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          FEATURES
          ================================================================ */}
      <section className="relative py-24 md:py-32">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[40%] right-[10%] w-[400px] h-[400px] rounded-full bg-[#4a9eff]/[0.015] blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
          <AnimatedSection className="mb-16 md:mb-20 text-center">
            <p className="mb-4 text-xs tracking-[0.3em] uppercase text-[#c4623a]">
              Capabilities
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] font-[family-name:var(--font-heading)]">
              Engineered for <span className="gradient-text-nebula">Natural Speech</span>
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {features.map((feature, i) => (
              <StaggerCard key={feature.title} index={i}>
                <div className="group relative h-full rounded-2xl glass glass-hover p-8 md:p-10 transition-all duration-500">
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-br from-[#c4623a]/5 to-transparent" />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#c4623a]/10 text-[#c4623a]">
                        {feature.icon}
                      </div>
                      <span className="text-xs tracking-wider uppercase text-[#c4623a]/60 font-medium">
                        {feature.stat}
                      </span>
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
          USE CASES
          ================================================================ */}
      <section className="relative py-24 md:py-32 lg:py-40">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute bottom-[30%] left-[20%] w-[500px] h-[400px] rounded-full bg-[#c4623a]/[0.02] blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
          <AnimatedSection className="mb-16 md:mb-20 text-center">
            <p className="mb-4 text-xs tracking-[0.3em] uppercase text-[#2d8a8a]">
              Use Cases
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] font-[family-name:var(--font-heading)]">
              Where Voice AI <span className="gradient-text-nebula">Excels</span>
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            {useCases.map((uc, i) => (
              <StaggerCard key={uc.title} index={i}>
                <div className="group relative rounded-2xl glass glass-hover p-8 md:p-10 transition-all duration-500">
                  <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl transition-opacity duration-500 opacity-40 group-hover:opacity-100" style={{ background: `linear-gradient(to right, ${uc.color}, transparent)` }} />
                  <div className="relative z-10">
                    <div className="mb-4 h-2 w-2 rounded-full" style={{ backgroundColor: uc.color }} />
                    <h3 className="mb-3 text-xl font-semibold tracking-tight text-white font-[family-name:var(--font-heading)]">
                      {uc.title}
                    </h3>
                    <p className="text-[15px] leading-relaxed text-gray-400">
                      {uc.description}
                    </p>
                  </div>
                </div>
              </StaggerCard>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          STATS
          ================================================================ */}
      <section className="relative py-20 md:py-28">
        <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
          <AnimatedSection>
            <div className="rounded-2xl glass p-10 md:p-14">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-[family-name:var(--font-heading)] tracking-tight">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-xs tracking-wider uppercase text-gray-500">
                      {stat.label}
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
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] rounded-full bg-[#c4623a]/[0.03] blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 md:px-12 text-center">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] font-[family-name:var(--font-heading)] mb-6">
              Ready to deploy your{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #c4623a, #c4847a)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                voice agent
              </span>
              ?
            </h2>
            <p className="max-w-xl mx-auto text-base text-gray-400 leading-relaxed mb-10">
              From first call to full deployment in under 2 weeks.
              Let us build the voice of your brand.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 rounded-full bg-[#c4623a] px-8 py-4 text-sm font-medium tracking-wide text-white transition-all duration-300 hover:bg-[#d4724a] hover:shadow-[0_0_30px_rgba(196,98,58,0.3)]"
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
