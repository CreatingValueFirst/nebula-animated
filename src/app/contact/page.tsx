'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from 'framer-motion';

// ---------------------------------------------------------------------------
// Animation helpers
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
// FAQ Data
// ---------------------------------------------------------------------------
const faqData = [
  {
    question: 'How long does implementation take?',
    answer:
      'Most implementations take 4-8 weeks depending on complexity. Simple API integrations can be live in as little as one week. Enterprise deployments with custom model training typically require 8-12 weeks. We provide a detailed timeline during the discovery phase.',
  },
  {
    question: 'What industries do you serve?',
    answer:
      'We serve clients across healthcare, finance, legal, manufacturing, retail, and technology. Our AI solutions are industry-agnostic at the core, with domain-specific fine-tuning available for each sector. We have deep expertise in regulated industries where compliance and data security are paramount.',
  },
  {
    question: 'Do you offer custom solutions?',
    answer:
      'Absolutely. While our core products (Neural Forge, Voice Cosmos, Vision Nebula, and others) cover most use cases, we offer full custom development for unique requirements. Our research team can build bespoke models trained on your proprietary data with enterprise-grade security.',
  },
  {
    question: "What's your pricing model?",
    answer:
      'We offer flexible pricing based on usage and scale. Plans start at $2,500/month for startups, with enterprise pricing based on volume and features. All plans include dedicated support, SLA guarantees, and access to our model improvement pipeline. Contact us for a tailored quote.',
  },
  {
    question: 'Do you provide ongoing support?',
    answer:
      'Yes. Every client gets a dedicated success manager, 24/7 technical support with guaranteed response times, and access to our continuous model improvement program. Enterprise clients receive quarterly business reviews and priority access to new features and research previews.',
  },
];

// ---------------------------------------------------------------------------
// Contact Info Data
// ---------------------------------------------------------------------------
const contactInfo = [
  {
    label: 'Email',
    value: 'hello@heaveninteractive.net',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
    href: 'mailto:hello@heaveninteractive.net',
  },
  {
    label: 'Phone',
    value: '+1 (415) 555-0142',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    href: 'tel:+14155550142',
  },
  {
    label: 'Headquarters',
    value: '548 Market St, San Francisco, CA 94104',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    href: 'https://maps.google.com/?q=548+Market+St+San+Francisco+CA',
  },
  {
    label: 'Hours',
    value: 'Mon-Fri, 9AM-6PM PST',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    href: undefined,
  },
];

// ---------------------------------------------------------------------------
// Service options
// ---------------------------------------------------------------------------
const serviceOptions = [
  'Neural Forge',
  'Voice Cosmos',
  'Vision Nebula',
  'Data Singularity',
  'Code Pulsar',
  'Quantum Mind',
  'Not Sure Yet',
];

// ===========================================================================
// PAGE
// ===========================================================================
export default function ContactPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  }

  return (
    <main className="flex flex-col">
      {/* =============================================================
          NAVIGATION
          ============================================================= */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 lg:px-16 py-6"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0a0a0f]/80 to-transparent pointer-events-none" />
        <Link
          href="/"
          className="relative z-10 text-2xl font-bold tracking-[0.2em] text-white font-[family-name:var(--font-heading)]"
        >
          HEAVEN INTERACTIVE
        </Link>
        <div className="relative z-10 hidden sm:flex items-center gap-8">
          {[
            { label: 'Home', href: '/' },
            { label: 'Explore', href: '/explore' },
            { label: 'About', href: '/about' },
            { label: 'Contact', href: '/contact' },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`relative text-sm tracking-widest uppercase transition-colors duration-300 after:absolute after:bottom-[-4px] after:left-0 after:h-[1px] after:w-0 after:bg-[#2d8a8a] hover:after:w-full after:transition-all after:duration-300 ${
                link.label === 'Contact'
                  ? 'text-white after:w-full after:bg-[#2d8a8a]'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </motion.nav>

      {/* =============================================================
          HERO
          ============================================================= */}
      <section ref={heroRef} className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
        <motion.div className="absolute inset-[-10%] w-[120%] h-[120%]" style={{ y: heroY }}>
          <Image
            src="/nebula-2k.jpg"
            alt="Nebula background"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </motion.div>

        <div className="absolute inset-0 bg-[#0a0a0f]/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/50 via-transparent to-[#0a0a0f]" />

        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-4 text-xs sm:text-sm tracking-[0.3em] uppercase text-[#2d8a8a]"
          >
            Get In Touch
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[-0.03em] text-white font-[family-name:var(--font-heading)] leading-[0.9]"
          >
            LET&apos;S BUILD
            <br />
            <span className="gradient-text-nebula">THE FUTURE</span>
          </motion.h1>
        </div>
      </section>

      {/* =============================================================
          CONTACT FORM + INFO
          ============================================================= */}
      <section className="relative py-20 md:py-28 lg:py-36">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-[#2d8a8a]/[0.03] blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#c4623a]/[0.02] blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            {/* LEFT: Form */}
            <AnimatedSection className="lg:col-span-3">
              <div className="rounded-2xl glass p-8 md:p-10 lg:p-12">
                <h2 className="text-2xl md:text-3xl font-bold tracking-[-0.02em] text-white font-[family-name:var(--font-heading)] mb-2">
                  Send us a message
                </h2>
                <p className="text-sm text-gray-400 mb-8">
                  Tell us about your project and we&apos;ll get back to you within 24 hours.
                </p>

                <AnimatePresence mode="wait">
                  {isSubmitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                      className="flex flex-col items-center justify-center py-16 text-center"
                    >
                      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#2d8a8a]/10">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2d8a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m9 12 2 2 4-4" />
                          <circle cx="12" cy="12" r="10" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-white font-[family-name:var(--font-heading)] mb-2">
                        Message Sent
                      </h3>
                      <p className="text-sm text-gray-400 max-w-sm">
                        Thank you for reaching out. Our team will review your inquiry and respond within one business day.
                      </p>
                      <button
                        onClick={() => setIsSubmitted(false)}
                        className="mt-6 text-sm text-[#2d8a8a] hover:text-[#3aafaf] transition-colors duration-300"
                      >
                        Send another message
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      action="#"
                      onSubmit={handleSubmit}
                      className="space-y-6"
                    >
                      {/* Name + Email row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-xs tracking-[0.15em] uppercase text-gray-400 mb-2">
                            Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            placeholder="Your full name"
                            className="w-full rounded-xl bg-white/[0.04] border border-white/[0.06] px-4 py-3.5 text-sm text-white placeholder-gray-600 outline-none transition-all duration-300 focus:border-[#2d8a8a]/40 focus:bg-white/[0.06] focus:ring-2 focus:ring-[#2d8a8a]/10"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-xs tracking-[0.15em] uppercase text-gray-400 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            placeholder="you@company.com"
                            className="w-full rounded-xl bg-white/[0.04] border border-white/[0.06] px-4 py-3.5 text-sm text-white placeholder-gray-600 outline-none transition-all duration-300 focus:border-[#2d8a8a]/40 focus:bg-white/[0.06] focus:ring-2 focus:ring-[#2d8a8a]/10"
                          />
                        </div>
                      </div>

                      {/* Company + Service row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="company" className="block text-xs tracking-[0.15em] uppercase text-gray-400 mb-2">
                            Company
                          </label>
                          <input
                            type="text"
                            id="company"
                            name="company"
                            placeholder="Your company name"
                            className="w-full rounded-xl bg-white/[0.04] border border-white/[0.06] px-4 py-3.5 text-sm text-white placeholder-gray-600 outline-none transition-all duration-300 focus:border-[#2d8a8a]/40 focus:bg-white/[0.06] focus:ring-2 focus:ring-[#2d8a8a]/10"
                          />
                        </div>
                        <div>
                          <label htmlFor="service" className="block text-xs tracking-[0.15em] uppercase text-gray-400 mb-2">
                            Service Interest
                          </label>
                          <div className="relative">
                            <select
                              id="service"
                              name="service"
                              defaultValue=""
                              className="w-full appearance-none rounded-xl bg-white/[0.04] border border-white/[0.06] px-4 py-3.5 text-sm text-white outline-none transition-all duration-300 focus:border-[#2d8a8a]/40 focus:bg-white/[0.06] focus:ring-2 focus:ring-[#2d8a8a]/10 [&:invalid]:text-gray-600"
                            >
                              <option value="" disabled className="bg-[#0d0d14] text-gray-500">
                                Select a service
                              </option>
                              {serviceOptions.map((opt) => (
                                <option key={opt} value={opt} className="bg-[#0d0d14] text-white">
                                  {opt}
                                </option>
                              ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m6 9 6 6 6-6" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <label htmlFor="message" className="block text-xs tracking-[0.15em] uppercase text-gray-400 mb-2">
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={5}
                          placeholder="Tell us about your project, goals, and timeline..."
                          className="w-full resize-none rounded-xl bg-white/[0.04] border border-white/[0.06] px-4 py-3.5 text-sm text-white placeholder-gray-600 outline-none transition-all duration-300 focus:border-[#2d8a8a]/40 focus:bg-white/[0.06] focus:ring-2 focus:ring-[#2d8a8a]/10"
                        />
                      </div>

                      {/* Submit */}
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="relative w-full sm:w-auto rounded-xl bg-[#2d8a8a] px-8 py-4 text-sm font-semibold tracking-wider uppercase text-white transition-all duration-300 hover:bg-[#2d8a8a]/90 hover:shadow-[0_0_30px_rgba(45,138,138,0.3)] disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
                      >
                        <span className={`inline-flex items-center gap-2 transition-opacity duration-300 ${isSubmitting ? 'opacity-0' : 'opacity-100'}`}>
                          Send Message
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14" />
                            <path d="m12 5 7 7-7 7" />
                          </svg>
                        </span>

                        {/* Loading spinner */}
                        {isSubmitting && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          </div>
                        )}
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </AnimatedSection>

            {/* RIGHT: Contact Info */}
            <AnimatedSection delay={0.15} className="lg:col-span-2">
              <div className="space-y-6">
                {contactInfo.map((info, i) => (
                  <motion.div
                    key={info.label}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.1,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                  >
                    {info.href ? (
                      <a
                        href={info.href}
                        target={info.href.startsWith('http') ? '_blank' : undefined}
                        rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="group block rounded-2xl glass glass-hover p-6 transition-colors duration-300"
                      >
                        <ContactInfoContent info={info} />
                      </a>
                    ) : (
                      <div className="group rounded-2xl glass p-6">
                        <ContactInfoContent info={info} />
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Schedule a Call CTA */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: 0.4,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="rounded-2xl border border-dashed border-[#2d8a8a]/20 p-6 text-center"
                >
                  <div className="mb-3 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2d8a8a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                      <line x1="16" x2="16" y1="2" y2="6" />
                      <line x1="8" x2="8" y1="2" y2="6" />
                      <line x1="3" x2="21" y1="10" y2="10" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-white mb-1">
                    Or schedule a call
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Book a 30-minute discovery session with our team
                  </p>
                  <motion.a
                    href="#"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#2d8a8a]/30 px-5 py-2.5 text-xs font-semibold tracking-wider uppercase text-[#2d8a8a] transition-all duration-300 hover:bg-[#2d8a8a]/10 hover:border-[#2d8a8a]/50"
                  >
                    Book a Time
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 17 17 7" />
                      <path d="M7 7h10v10" />
                    </svg>
                  </motion.a>
                </motion.div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* =============================================================
          FAQ
          ============================================================= */}
      <section className="relative py-20 md:py-28 lg:py-36">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-[#4a9eff]/[0.02] blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl px-6 md:px-12">
          <AnimatedSection className="mb-12 md:mb-16 text-center">
            <p className="mb-4 text-xs tracking-[0.3em] uppercase text-[#4a9eff]">
              FAQ
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] font-[family-name:var(--font-heading)]">
              Frequently <span className="gradient-text-nebula">Asked</span>
            </h2>
          </AnimatedSection>

          <div className="space-y-3">
            {faqData.map((faq, i) => (
              <FaqItem
                key={i}
                faq={faq}
                index={i}
                isOpen={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* =============================================================
          FOOTER
          ============================================================= */}
      <footer className="relative border-t border-white/[0.04]">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#2d8a8a]/20 to-transparent" />
        <div className="mx-auto max-w-6xl px-6 md:px-12 py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm text-gray-500 text-center md:text-left">
              &copy; 2026 <span className="text-gray-400">Heaven Interactive</span>. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {[
                { label: 'Home', href: '/' },
                { label: 'Explore', href: '/explore' },
                { label: 'About', href: '/about' },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-gray-500 hover:text-[#2d8a8a] transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Contact Info Content (shared between link and div)
// ---------------------------------------------------------------------------
function ContactInfoContent({ info }: { info: (typeof contactInfo)[number] }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#2d8a8a]/10 text-[#2d8a8a]">
        {info.icon}
      </div>
      <div>
        <p className="text-xs tracking-[0.15em] uppercase text-gray-500 mb-1">
          {info.label}
        </p>
        <p className="text-sm text-white leading-relaxed">
          {info.value}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// FAQ Item Component
// ---------------------------------------------------------------------------
function FaqItem({
  faq,
  index,
  isOpen,
  onToggle,
}: {
  faq: (typeof faqData)[number];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="rounded-2xl glass overflow-hidden"
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between p-6 text-left transition-colors duration-300 hover:bg-white/[0.02]"
      >
        <span className="text-[15px] font-medium text-white pr-4">
          {faq.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0 text-[#2d8a8a]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-0">
              <p className="text-sm text-gray-400 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
