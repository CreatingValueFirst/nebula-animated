'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

interface BookingResult {
  success: boolean;
  eventId?: string;
  meetLink?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const STEP_LABELS = ['Date', 'Time', 'Details', 'Confirmed'];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function formatTimeFromISO(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function formatReadableDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/** Returns 0=Mon ... 6=Sun for the first day of the month */
function getFirstDayOfWeek(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Convert Sun=0 to Mon-based index
}

// ---------------------------------------------------------------------------
// Step indicator
// ---------------------------------------------------------------------------
function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {STEP_LABELS.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`h-2 w-2 rounded-full transition-all duration-500 ${
                i < current
                  ? 'bg-[#2d8a8a] shadow-[0_0_8px_rgba(45,138,138,0.5)]'
                  : i === current
                    ? 'bg-[#2d8a8a] shadow-[0_0_12px_rgba(45,138,138,0.6)] scale-125'
                    : 'bg-white/10'
              }`}
            />
            <span className={`text-[10px] tracking-wider uppercase transition-colors duration-300 ${
              i <= current ? 'text-[#2d8a8a]' : 'text-white/20'
            }`}>
              {label}
            </span>
          </div>
          {i < STEP_LABELS.length - 1 && (
            <div className={`w-8 h-px mb-4 transition-colors duration-500 ${
              i < current ? 'bg-[#2d8a8a]/50' : 'bg-white/[0.06]'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Calendar grid
// ---------------------------------------------------------------------------
function CalendarGrid({
  selectedDate,
  onSelectDate,
  viewMonth,
  viewYear,
  onPrevMonth,
  onNextMonth,
}: {
  selectedDate: Date | null;
  onSelectDate: (d: Date) => void;
  viewMonth: number;
  viewYear: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth);

  const canGoPrev = viewYear > today.getFullYear() || (viewYear === today.getFullYear() && viewMonth > today.getMonth());

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  // fill trailing nulls to complete the grid row
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div>
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={onPrevMonth}
          disabled={!canGoPrev}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.06] text-gray-400 transition-all duration-300 hover:bg-white/[0.08] hover:text-white disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <span className="text-sm font-semibold tracking-wide text-white font-[family-name:var(--font-heading)]">
          {MONTHS[viewMonth]} {viewYear}
        </span>

        <button
          onClick={onNextMonth}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.06] text-gray-400 transition-all duration-300 hover:bg-white/[0.08] hover:text-white"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[10px] tracking-[0.15em] uppercase text-gray-500 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} className="h-10" />;
          }

          const date = new Date(viewYear, viewMonth, day);
          date.setHours(0, 0, 0, 0);

          const isPast = date < today;
          const dayOfWeek = date.getDay();
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
          const isDisabled = isPast || isWeekend;
          const isToday = isSameDay(date, today);
          const isSelected = selectedDate !== null && isSameDay(date, selectedDate);

          return (
            <button
              key={`day-${day}`}
              disabled={isDisabled}
              onClick={() => onSelectDate(date)}
              className={`
                relative h-10 w-full rounded-lg text-sm font-medium transition-all duration-300
                ${isDisabled
                  ? 'text-white/10 cursor-not-allowed'
                  : isSelected
                    ? 'bg-[#2d8a8a] text-white shadow-[0_0_20px_rgba(45,138,138,0.3)]'
                    : 'text-gray-300 hover:bg-white/[0.06] hover:text-white'
                }
              `}
            >
              {day}
              {isToday && !isSelected && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-[#2d8a8a]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Time slot grid
// ---------------------------------------------------------------------------
function TimeSlotGrid({
  slots,
  loading,
  selectedSlot,
  onSelectSlot,
}: {
  slots: TimeSlot[];
  loading: boolean;
  selectedSlot: TimeSlot | null;
  onSelectSlot: (s: TimeSlot) => void;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-11 rounded-xl skeleton" />
        ))}
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2d8a8a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-3 opacity-40">
          <circle cx="12" cy="12" r="10" />
          <path d="m15 9-6 6" />
          <path d="m9 9 6 6" />
        </svg>
        <p className="text-sm text-gray-500">No available slots for this date</p>
        <p className="text-xs text-gray-600 mt-1">Try selecting a different day</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {slots.map((slot) => {
        const time = formatTimeFromISO(slot.start);
        const isSelected = selectedSlot?.start === slot.start;

        return (
          <button
            key={slot.start}
            disabled={!slot.available}
            onClick={() => onSelectSlot(slot)}
            className={`
              relative h-11 rounded-xl text-sm font-medium transition-all duration-300
              ${!slot.available
                ? 'bg-white/[0.02] border border-white/[0.04] text-white/15 line-through cursor-not-allowed'
                : isSelected
                  ? 'bg-[#2d8a8a] border border-[#2d8a8a] text-white shadow-[0_0_16px_rgba(45,138,138,0.25)]'
                  : 'bg-white/[0.03] border border-[#2d8a8a]/20 text-gray-300 hover:border-[#2d8a8a]/50 hover:bg-[#2d8a8a]/10 hover:text-white'
              }
            `}
          >
            {time}
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Slide transition wrapper
// ---------------------------------------------------------------------------
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
};

// ---------------------------------------------------------------------------
// Main BookingModal
// ---------------------------------------------------------------------------
export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  // Step 1 state
  const now = new Date();
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Step 2 state
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  // Step 3 state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Step 4 state
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setStep(0);
        setDirection(1);
        setSelectedDate(null);
        setSlots([]);
        setSelectedSlot(null);
        setName('');
        setEmail('');
        setNotes('');
        setSubmitting(false);
        setSubmitError('');
        setBookingResult(null);
        const now = new Date();
        setViewMonth(now.getMonth());
        setViewYear(now.getFullYear());
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Fetch slots when date is selected
  const fetchSlots = useCallback(async (date: Date) => {
    setSlotsLoading(true);
    setSlots([]);
    setSelectedSlot(null);

    try {
      const dateStr = formatDate(date);
      const res = await fetch(`/api/booking/slots?date=${dateStr}`);
      if (res.ok) {
        const data = await res.json();
        setSlots(data.slots || []);
      } else {
        setSlots([]);
      }
    } catch {
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  }, []);

  // Handlers
  const handleDateSelect = useCallback((d: Date) => {
    setSelectedDate(d);
    setDirection(1);
    setStep(1);
    fetchSlots(d);
  }, [fetchSlots]);

  const handleSlotSelect = useCallback((slot: TimeSlot) => {
    setSelectedSlot(slot);
    setDirection(1);
    setStep(2);
  }, []);

  const handleBack = useCallback((targetStep: number) => {
    setDirection(-1);
    setStep(targetStep);
  }, []);

  const handlePrevMonth = useCallback(() => {
    setViewMonth((m) => {
      if (m === 0) {
        setViewYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  }, []);

  const handleNextMonth = useCallback(() => {
    setViewMonth((m) => {
      if (m === 11) {
        setViewYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!selectedDate || !selectedSlot || !name.trim() || !email.trim()) return;
    setSubmitting(true);
    setSubmitError('');

    try {
      const res = await fetch('/api/booking/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          date: formatDate(selectedDate),
          startTime: selectedSlot.start,
          endTime: selectedSlot.end,
          notes: notes.trim() || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setBookingResult(data);
        setDirection(1);
        setStep(3);
      } else {
        const data = await res.json().catch(() => ({}));
        setSubmitError(data.error || 'Failed to create booking. Please try again.');
      }
    } catch {
      setSubmitError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [selectedDate, selectedSlot, name, email, notes]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 z-[61] flex items-end sm:items-center justify-center p-0 sm:p-6"
          >
            <div
              className="relative w-full sm:max-w-[480px] max-h-[90dvh] sm:max-h-[85vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-[#0a0a0f]/95 backdrop-blur-xl border border-[#2d8a8a]/15 shadow-[0_0_60px_rgba(45,138,138,0.08),0_0_120px_rgba(45,138,138,0.04)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.06] text-gray-500 transition-all duration-300 hover:bg-white/[0.08] hover:text-white"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>

              {/* Content */}
              <div className="p-6 sm:p-8">
                {/* Header */}
                <div className="mb-2 pr-8">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-[#2d8a8a] mb-1.5">Discovery Session</p>
                  <h2 className="text-xl font-bold tracking-[-0.02em] text-white font-[family-name:var(--font-heading)]">
                    Schedule a Call
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">Book a 30-minute session with our team</p>
                </div>

                {/* Step indicator */}
                <div className="mt-5">
                  <StepIndicator current={step} />
                </div>

                {/* Step content with animated transitions */}
                <div className="relative overflow-hidden min-h-[320px]">
                  <AnimatePresence mode="wait" custom={direction}>
                    {/* Step 0: Date selection */}
                    {step === 0 && (
                      <motion.div
                        key="step-0"
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                      >
                        <p className="text-xs text-gray-400 mb-4">Select a date for your discovery call</p>
                        <CalendarGrid
                          selectedDate={selectedDate}
                          onSelectDate={handleDateSelect}
                          viewMonth={viewMonth}
                          viewYear={viewYear}
                          onPrevMonth={handlePrevMonth}
                          onNextMonth={handleNextMonth}
                        />
                      </motion.div>
                    )}

                    {/* Step 1: Time slot selection */}
                    {step === 1 && (
                      <motion.div
                        key="step-1"
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-xs text-gray-400">Available times for</p>
                            <p className="text-sm font-medium text-white mt-0.5">
                              {selectedDate ? formatReadableDate(formatDate(selectedDate)) : ''}
                            </p>
                          </div>
                          <button
                            onClick={() => handleBack(0)}
                            className="text-[11px] tracking-wider uppercase text-[#2d8a8a] hover:text-[#3aafaf] transition-colors duration-300"
                          >
                            Change date
                          </button>
                        </div>

                        <TimeSlotGrid
                          slots={slots}
                          loading={slotsLoading}
                          selectedSlot={selectedSlot}
                          onSelectSlot={handleSlotSelect}
                        />
                      </motion.div>
                    )}

                    {/* Step 2: Confirm & book */}
                    {step === 2 && (
                      <motion.div
                        key="step-2"
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                      >
                        {/* Summary bar */}
                        <div className="flex items-center justify-between rounded-xl bg-white/[0.03] border border-white/[0.06] px-4 py-3 mb-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2d8a8a]/10 text-[#2d8a8a]">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="18" height="18" x="3" y="4" rx="2" />
                                <line x1="16" x2="16" y1="2" y2="6" />
                                <line x1="8" x2="8" y1="2" y2="6" />
                                <line x1="3" x2="21" y1="10" y2="10" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">
                                {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                                {selectedSlot ? ` at ${formatTimeFromISO(selectedSlot.start)}` : ''}
                              </p>
                              <p className="text-[11px] text-gray-600">30 min discovery call</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleBack(1)}
                            className="text-[11px] tracking-wider uppercase text-[#2d8a8a] hover:text-[#3aafaf] transition-colors duration-300"
                          >
                            Change
                          </button>
                        </div>

                        {/* Form */}
                        <div className="space-y-4">
                          <div>
                            <label className="block text-[10px] tracking-[0.15em] uppercase text-gray-500 mb-1.5">Name</label>
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Your full name"
                              required
                              className="w-full rounded-xl bg-white/[0.04] border border-white/[0.06] px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all duration-300 focus:border-[#2d8a8a]/40 focus:bg-white/[0.06] focus:ring-2 focus:ring-[#2d8a8a]/10"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] tracking-[0.15em] uppercase text-gray-500 mb-1.5">Email</label>
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="you@company.com"
                              required
                              className="w-full rounded-xl bg-white/[0.04] border border-white/[0.06] px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all duration-300 focus:border-[#2d8a8a]/40 focus:bg-white/[0.06] focus:ring-2 focus:ring-[#2d8a8a]/10"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] tracking-[0.15em] uppercase text-gray-500 mb-1.5">Notes <span className="text-gray-700 normal-case tracking-normal">(optional)</span></label>
                            <textarea
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              placeholder="Anything you'd like to discuss?"
                              rows={3}
                              className="w-full resize-none rounded-xl bg-white/[0.04] border border-white/[0.06] px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all duration-300 focus:border-[#2d8a8a]/40 focus:bg-white/[0.06] focus:ring-2 focus:ring-[#2d8a8a]/10"
                            />
                          </div>

                          {submitError && (
                            <p className="text-xs text-red-400/80 bg-red-400/5 rounded-lg px-3 py-2 border border-red-400/10">
                              {submitError}
                            </p>
                          )}

                          <motion.button
                            onClick={handleSubmit}
                            disabled={submitting || !name.trim() || !email.trim()}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="relative w-full rounded-xl bg-[#2d8a8a] px-6 py-3.5 text-sm font-semibold tracking-wider uppercase text-white transition-all duration-300 hover:bg-[#2d8a8a]/90 hover:shadow-[0_0_30px_rgba(45,138,138,0.3)] disabled:opacity-40 disabled:cursor-not-allowed overflow-hidden"
                          >
                            <span className={`inline-flex items-center gap-2 transition-opacity duration-300 ${submitting ? 'opacity-0' : 'opacity-100'}`}>
                              Confirm Booking
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m9 12 2 2 4-4" />
                                <circle cx="12" cy="12" r="10" />
                              </svg>
                            </span>

                            {submitting && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                              </div>
                            )}
                          </motion.button>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: Confirmation */}
                    {step === 3 && (
                      <motion.div
                        key="step-3"
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="flex flex-col items-center justify-center py-8 text-center"
                      >
                        {/* Animated checkmark */}
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.5, delay: 0.15, type: 'spring', stiffness: 200, damping: 15 }}
                          className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#2d8a8a]/10 shadow-[0_0_40px_rgba(45,138,138,0.15)]"
                        >
                          <motion.svg
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#2d8a8a"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                          >
                            <motion.path
                              d="m9 12 2 2 4-4"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 0.4, delay: 0.5 }}
                            />
                            <circle cx="12" cy="12" r="10" />
                          </motion.svg>
                        </motion.div>

                        <motion.h3
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3, duration: 0.4 }}
                          className="text-lg font-semibold text-white font-[family-name:var(--font-heading)] mb-1"
                        >
                          Your call is booked!
                        </motion.h3>

                        <motion.p
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4, duration: 0.4 }}
                          className="text-sm text-gray-400 max-w-xs mb-6"
                        >
                          {selectedDate ? formatReadableDate(formatDate(selectedDate)) : ''}
                          {selectedSlot ? ` at ${formatTimeFromISO(selectedSlot.start)}` : ''}
                          <span className="block text-xs text-gray-600 mt-1">30 min discovery call -- a calendar invite has been sent to your email</span>
                        </motion.p>

                        {/* Meet link */}
                        {bookingResult?.meetLink && (
                          <motion.a
                            href={bookingResult.meetLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.4 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center gap-2 rounded-xl border border-[#2d8a8a]/30 bg-[#2d8a8a]/5 px-5 py-2.5 text-xs font-semibold tracking-wider uppercase text-[#2d8a8a] transition-all duration-300 hover:bg-[#2d8a8a]/10 hover:border-[#2d8a8a]/50 hover:shadow-[0_0_20px_rgba(45,138,138,0.15)] mb-4"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="m15 10 5-3v10l-5-3Z" />
                              <rect width="13" height="14" x="2" y="5" rx="2" />
                            </svg>
                            Join via Google Meet
                          </motion.a>
                        )}

                        <motion.button
                          onClick={onClose}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 }}
                          className="text-xs text-gray-500 hover:text-gray-300 transition-colors duration-300 mt-2"
                        >
                          Close
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
