'use client';

import React, { useRef, useState } from 'react';

import Link from 'next/link';
import { useLanguage } from '../../i18n/LanguageContext';
import CosmicVideo from '../../components/CosmicVideo';
import BookingModal from '../../components/BookingModal';
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
// FAQ Data type
// ---------------------------------------------------------------------------
interface FaqDataItem {
  question: string;
  answer: string;
}

// ---------------------------------------------------------------------------
// Icons for contact info
// ---------------------------------------------------------------------------
const emailIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
const phoneIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const hqIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const hoursIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const facebookIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const githubIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);
const linkedinIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// ===========================================================================
// PAGE
// ===========================================================================
export default function ContactPage() {
  const { t } = useLanguage();

  const faqData: FaqDataItem[] = [
    { question: t.contactPage.faq1Q, answer: t.contactPage.faq1A },
    { question: t.contactPage.faq2Q, answer: t.contactPage.faq2A },
    { question: t.contactPage.faq3Q, answer: t.contactPage.faq3A },
    { question: t.contactPage.faq4Q, answer: t.contactPage.faq4A },
    { question: t.contactPage.faq5Q, answer: t.contactPage.faq5A },
  ];

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);

  const contactInfo = [
    { label: t.contact.email, value: 'info@heaven-interactive.com', icon: emailIcon, href: 'mailto:info@heaven-interactive.com' },
    { label: t.contact.phone, value: '+359 898 34 5752', icon: phoneIcon, href: 'tel:+359898345752' },
    { label: t.contact.hq, value: 'Sofia, Lozenets, Bulgaria', icon: hqIcon, href: 'https://maps.google.com/?q=Sofia+Lozenets+Bulgaria' },
    { label: t.contact.hours, value: t.contact.hoursValue, icon: hoursIcon, href: undefined },
    { label: 'Facebook', value: 'Heaven Interactive', icon: facebookIcon, href: 'https://www.facebook.com/profile.php?id=61568535414612' },
    { label: 'GitHub', value: 'CreatingValueFirst', icon: githubIcon, href: 'https://github.com/CreatingValueFirst?tab=repositories' },
    { label: 'LinkedIn', value: 'Dimitar Roussev', icon: linkedinIcon, href: 'https://www.linkedin.com/in/dimitar-roussev-281906340/' },
  ];

  const serviceOptions = [
    t.services.neuralForge,
    t.services.voiceCosmos,
    t.services.visionNebula,
    t.services.dataSingularity,
    t.services.codePulsar,
    t.services.quantumMind,
    t.contact.notSure,
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      company: formData.get('company') as string,
      service: formData.get('service') as string,
      message: formData.get('message') as string,
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsSubmitted(true);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to send. Please try again.');
      }
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex flex-col">
      {/* =============================================================
          HERO
          ============================================================= */}
      <section ref={heroRef} className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
        <motion.div className="absolute inset-[-10%] w-[120%] h-[120%]" style={{ y: heroY }}>
          <CosmicVideo
            baseName="cosmic-video-9-hd"
            poster="/nebula-4k.jpg"
            className="absolute inset-0 w-full h-full object-cover"
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
            {t.contact.badge}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[-0.03em] text-white font-[family-name:var(--font-heading)] leading-[0.9]"
          >
            {t.contact.title}
            <br />
            <span className="gradient-text-nebula">{t.contact.title2}</span>
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
                  {t.contact.formTitle}
                </h2>
                <p className="text-sm text-gray-400 mb-8">
                  {t.contact.formSubtitle}
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
                        {t.contact.sent}
                      </h3>
                      <p className="text-sm text-gray-400 max-w-sm">
                        {t.contact.sentDesc}
                      </p>
                      <button
                        onClick={() => setIsSubmitted(false)}
                        className="mt-6 text-sm text-[#2d8a8a] hover:text-[#3aafaf] transition-colors duration-300"
                      >
                        {t.contactPage.sendAnother}
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
                            {t.contact.name}
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            placeholder={t.contact.namePlaceholder}
                            className="w-full rounded-xl bg-white/[0.04] border border-white/[0.06] px-4 py-3.5 text-sm text-white placeholder-gray-600 outline-none transition-all duration-300 focus:border-[#2d8a8a]/40 focus:bg-white/[0.06] focus:ring-2 focus:ring-[#2d8a8a]/10"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-xs tracking-[0.15em] uppercase text-gray-400 mb-2">
                            {t.contact.email}
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            placeholder={t.contact.emailPlaceholder}
                            className="w-full rounded-xl bg-white/[0.04] border border-white/[0.06] px-4 py-3.5 text-sm text-white placeholder-gray-600 outline-none transition-all duration-300 focus:border-[#2d8a8a]/40 focus:bg-white/[0.06] focus:ring-2 focus:ring-[#2d8a8a]/10"
                          />
                        </div>
                      </div>

                      {/* Company + Service row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="company" className="block text-xs tracking-[0.15em] uppercase text-gray-400 mb-2">
                            {t.contact.company}
                          </label>
                          <input
                            type="text"
                            id="company"
                            name="company"
                            placeholder={t.contact.companyPlaceholder}
                            className="w-full rounded-xl bg-white/[0.04] border border-white/[0.06] px-4 py-3.5 text-sm text-white placeholder-gray-600 outline-none transition-all duration-300 focus:border-[#2d8a8a]/40 focus:bg-white/[0.06] focus:ring-2 focus:ring-[#2d8a8a]/10"
                          />
                        </div>
                        <div>
                          <label htmlFor="service" className="block text-xs tracking-[0.15em] uppercase text-gray-400 mb-2">
                            {t.contact.serviceInterest}
                          </label>
                          <div className="relative">
                            <select
                              id="service"
                              name="service"
                              defaultValue=""
                              className="w-full appearance-none rounded-xl bg-white/[0.04] border border-white/[0.06] px-4 py-3.5 text-sm text-white outline-none transition-all duration-300 focus:border-[#2d8a8a]/40 focus:bg-white/[0.06] focus:ring-2 focus:ring-[#2d8a8a]/10 [&:invalid]:text-gray-600"
                            >
                              <option value="" disabled className="bg-[#0d0d14] text-gray-500">
                                {t.contact.selectService}
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
                          {t.contact.message}
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={5}
                          placeholder={t.contact.messagePlaceholder}
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
                          {t.contact.send}
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
                    {t.contact.scheduleCall}
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    {t.contactPage.bookDiscoveryDesc}
                  </p>
                  <motion.button
                    onClick={() => setBookingOpen(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#2d8a8a]/10 border border-[#2d8a8a]/30 px-5 py-2.5 text-xs font-semibold tracking-wider uppercase text-[#2d8a8a] transition-all duration-300 hover:bg-[#2d8a8a]/20 hover:border-[#2d8a8a]/50 hover:shadow-[0_0_20px_rgba(45,138,138,0.15)]"
                  >
                    {t.contactPage.bookATime}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="18" x="3" y="4" rx="2" />
                      <line x1="16" x2="16" y1="2" y2="6" />
                      <line x1="8" x2="8" y1="2" y2="6" />
                      <line x1="3" x2="21" y1="10" y2="10" />
                    </svg>
                  </motion.button>
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
              {t.contact.faq}
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] font-[family-name:var(--font-heading)]">
              {t.contact.faq}
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

      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
    </main>
  );
}

// ---------------------------------------------------------------------------
// Contact Info Content (shared between link and div)
// ---------------------------------------------------------------------------
function ContactInfoContent({ info }: { info: { label: string; value: string; icon: React.ReactNode; href: string | undefined } }) {
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
  faq: FaqDataItem;
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
