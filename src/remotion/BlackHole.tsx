'use client';

import React, { useMemo } from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  AbsoluteFill,
} from 'remotion';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export interface BlackHoleProps {
  /** Diameter of the entire black hole system in pixels */
  size?: number;
  /** Glow brightness multiplier, 0-1 */
  intensity?: number;
}

interface StarParticle {
  id: number;
  angle: number;
  distance: number;
  baseSize: number;
  baseOpacity: number;
  orbitSpeed: number;
  color: string;
  twinkleOffset: number;
}

interface JetParticle {
  id: number;
  offset: number;
  size: number;
  opacity: number;
  xDrift: number;
  speed: number;
}

// ─────────────────────────────────────────────────────────────
// DETERMINISTIC RANDOM -- stable across all frames
// ─────────────────────────────────────────────────────────────

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function seededRange(seed: number, min: number, max: number): number {
  return min + seededRandom(seed) * (max - min);
}

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────

const LOOP_FRAMES = 600;
const STAR_COUNT = 32;
const JET_PARTICLE_COUNT = 14;
const WAVE_COUNT = 4;
const DISK_RING_COUNT = 6;

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────

export const BlackHole: React.FC<BlackHoleProps> = ({
  size = 300,
  intensity = 0.85,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Seamless loop
  const loopFrame = frame % LOOP_FRAMES;
  const loopProgress = loopFrame / LOOP_FRAMES;

  // ─── CORE DIMENSIONS ───────────────────────────────────
  const ehR = size * 0.14; // event horizon radius
  const psR = size * 0.185; // photon sphere radius
  const diskInner = size * 0.22;
  const diskOuter = size * 0.46;
  const jetLen = size * 0.85;
  const jetW = size * 0.055;
  const center = size / 2;

  // ─── ENTRANCE ──────────────────────────────────────────
  const entranceSpring = spring({
    frame,
    fps,
    config: { damping: 80, stiffness: 30, mass: 1.5 },
  });
  const eScale = interpolate(entranceSpring, [0, 1], [0.25, 1]);
  const eOpacity = interpolate(entranceSpring, [0, 1], [0, 1]);

  // ─── DISK ROTATION (full turn over LOOP_FRAMES) ───────
  const diskDeg = loopProgress * 360;

  // ─── PHOTON RING PULSE ────────────────────────────────
  const pulseCycle = (loopFrame % 120) / 120;
  const pulse = interpolate(
    pulseCycle,
    [0, 0.25, 0.5, 0.75, 1],
    [0.72, 1, 0.82, 0.95, 0.72],
  );

  // ─── JET SWAY ─────────────────────────────────────────
  const sway = interpolate(
    pulseCycle,
    [0, 0.25, 0.5, 0.75, 1],
    [-1.2, 0.6, 1.2, -0.6, -1.2],
  );

  // ─── GRAVITATIONAL WAVE STAGGER ───────────────────────
  const waveGap = LOOP_FRAMES / WAVE_COUNT;

  // ─── GENERATE STABLE STAR PARTICLES ────────────────────
  const stars = useMemo<StarParticle[]>(() => {
    const palette = [
      'rgba(255,255,255,',
      'rgba(180,210,255,',
      'rgba(255,240,200,',
      'rgba(210,225,255,',
    ];
    return Array.from({ length: STAR_COUNT }, (_, i) => {
      const s = i + 1;
      return {
        id: i,
        angle: seededRange(s * 1.1, 0, Math.PI * 2),
        distance: seededRange(s * 2.3, size * 0.26, size * 0.52),
        baseSize: seededRange(s * 3.7, 1, 2.8),
        baseOpacity: seededRange(s * 5.1, 0.35, 0.92),
        orbitSpeed: seededRange(s * 7.3, 0.12, 0.55),
        color: palette[Math.floor(seededRandom(s * 11.3) * palette.length)],
        twinkleOffset: seededRandom(s * 13.7) * LOOP_FRAMES,
      };
    });
  }, [size]);

  // ─── GENERATE STABLE JET PARTICLES ─────────────────────
  const jetsTop = useMemo<JetParticle[]>(
    () =>
      Array.from({ length: JET_PARTICLE_COUNT }, (_, i) => ({
        id: i,
        offset: seededRandom(i * 3.1 + 100) * LOOP_FRAMES,
        size: seededRange(i * 5.7 + 100, 1.2, 3.2),
        opacity: seededRange(i * 7.3 + 100, 0.3, 0.78),
        xDrift: seededRange(i * 9.1 + 100, -0.35, 0.35),
        speed: seededRange(i * 11.7 + 100, 0.55, 1.35),
      })),
    [],
  );

  const jetsBot = useMemo<JetParticle[]>(
    () =>
      Array.from({ length: JET_PARTICLE_COUNT }, (_, i) => ({
        id: i + JET_PARTICLE_COUNT,
        offset: seededRandom(i * 3.1 + 200) * LOOP_FRAMES,
        size: seededRange(i * 5.7 + 200, 1.2, 3.2),
        opacity: seededRange(i * 7.3 + 200, 0.3, 0.78),
        xDrift: seededRange(i * 9.1 + 200, -0.35, 0.35),
        speed: seededRange(i * 11.7 + 200, 0.55, 1.35),
      })),
    [],
  );

  // ─── STAR POSITION WITH GRAVITATIONAL LENSING ──────────
  function starPos(star: StarParticle) {
    const orbitAngle = star.angle + loopProgress * Math.PI * 2 * star.orbitSpeed;
    const prox = 1 - Math.min(star.distance / (size * 0.52), 1);
    const lensShift = prox * prox * size * 0.07;
    const lensAngle = prox * loopProgress * Math.PI * 0.4;
    const effAngle = orbitAngle + lensAngle;
    const effDist = star.distance + lensShift * Math.sin(orbitAngle * 2);
    return {
      x: Math.cos(effAngle) * effDist,
      y: Math.sin(effAngle) * effDist,
    };
  }

  // ─── JET PARTICLE HELPERS ──────────────────────────────
  function jetY(p: JetParticle, dir: 1 | -1) {
    const half = LOOP_FRAMES * 0.5;
    const cyc = ((loopFrame + p.offset) % half) / half;
    return dir * (ehR * 0.7 + cyc * jetLen * p.speed);
  }

  function jetOp(p: JetParticle) {
    const half = LOOP_FRAMES * 0.5;
    const cyc = ((loopFrame + p.offset) % half) / half;
    return interpolate(
      cyc,
      [0, 0.08, 0.55, 1],
      [0, p.opacity * intensity, p.opacity * intensity * 0.45, 0],
    );
  }

  // ─────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        transform: `scale(${eScale})`,
        opacity: eOpacity,
      }}
    >
      {/* ═══════════════════════════════════════════════════
          LAYER 0 -- BACKGROUND NEBULA
      ═══════════════════════════════════════════════════ */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          overflow: 'hidden',
        }}
      >
        <img
          src="/nebula-4k.jpg"
          alt=""
          style={{
            position: 'absolute',
            top: '-20%',
            left: '-20%',
            width: '140%',
            height: '140%',
            objectFit: 'cover',
            transform: `translate(${Math.sin(loopProgress * Math.PI * 2) * 1.5}%, ${Math.cos(loopProgress * Math.PI * 2) * 1}%) scale(${1.05 + Math.sin(loopProgress * Math.PI * 2) * 0.02})`,
            filter: `brightness(${0.28 + intensity * 0.12})`,
            opacity: 0.55,
          }}
        />
        {/* Darkening radial toward center */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(
              circle at 50% 50%,
              rgba(0,0,0,0.96) 0%,
              rgba(0,0,0,0.72) ${((ehR / size) * 100 * 1.6).toFixed(1)}%,
              rgba(0,0,0,0.3) ${((diskOuter / size) * 100).toFixed(1)}%,
              rgba(0,0,0,0.06) 68%,
              transparent 100%
            )`,
          }}
        />
      </div>

      {/* ═══════════════════════════════════════════════════
          LAYER 1 -- GRAVITATIONAL WAVES
      ═══════════════════════════════════════════════════ */}
      {Array.from({ length: WAVE_COUNT }, (_, i) => {
        const wf = (loopFrame + i * waveGap) % LOOP_FRAMES;
        const wp = wf / LOOP_FRAMES;
        const wr = interpolate(wp, [0, 1], [ehR * 1.3, size * 0.48]);
        const wo = interpolate(wp, [0, 0.12, 0.65, 1], [0, 0.055 * intensity, 0.025 * intensity, 0]);
        return (
          <div
            key={`gw-${i}`}
            style={{
              position: 'absolute',
              left: center - wr,
              top: center - wr,
              width: wr * 2,
              height: wr * 2,
              borderRadius: '50%',
              border: `1px solid rgba(160,200,255,${wo})`,
              boxShadow: `0 0 ${4 + wp * 8}px rgba(160,200,255,${wo * 0.5}), inset 0 0 ${2 + wp * 4}px rgba(160,200,255,${wo * 0.3})`,
              pointerEvents: 'none',
            }}
          />
        );
      })}

      {/* ═══════════════════════════════════════════════════
          LAYER 2 -- BACKGROUND STARS (gravitational lensing)
      ═══════════════════════════════════════════════════ */}
      {stars.map((star) => {
        const pos = starPos(star);
        const dist = Math.sqrt(pos.x * pos.x + pos.y * pos.y);
        if (dist < ehR * 1.15) return null;

        const tc = ((loopFrame + star.twinkleOffset) % 80) / 80;
        const twinkle = interpolate(tc, [0, 0.25, 0.5, 0.75, 1], [0.4, 1, 0.45, 0.88, 0.4]);

        const proxGlow =
          dist < psR * 2.2
            ? interpolate(dist, [psR * 1.15, psR * 2.2], [2.5, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })
            : 0;

        const op = star.baseOpacity * twinkle * intensity;
        const sz = star.baseSize + proxGlow;

        return (
          <div
            key={`s-${star.id}`}
            style={{
              position: 'absolute',
              left: center + pos.x,
              top: center + pos.y,
              width: sz,
              height: sz,
              borderRadius: '50%',
              backgroundColor: `${star.color}${op})`,
              boxShadow: `0 0 ${sz * 2 + proxGlow * 3}px ${sz + proxGlow * 2}px ${star.color}${op * 0.5})`,
              transform: 'translate(-50%,-50%)',
              pointerEvents: 'none',
            }}
          />
        );
      })}

      {/* ═══════════════════════════════════════════════════
          LAYER 3 -- PARTICLE JETS (behind the disk)
      ═══════════════════════════════════════════════════ */}
      {/* --- Top jet beam --- */}
      <div
        style={{
          position: 'absolute',
          left: center - jetW / 2,
          top: center - ehR * 0.5 - jetLen,
          width: jetW,
          height: jetLen,
          background: `linear-gradient(to top, rgba(136,187,255,${(0.22 * intensity).toFixed(3)}) 0%, rgba(100,160,255,${(0.13 * intensity).toFixed(3)}) 30%, rgba(68,136,204,${(0.05 * intensity).toFixed(3)}) 60%, transparent 100%)`,
          filter: `blur(${(jetW * 0.28).toFixed(1)}px)`,
          transform: `rotate(${(-sway * 0.5).toFixed(2)}deg)`,
          transformOrigin: 'bottom center',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: center - jetW * 0.18,
          top: center - ehR * 0.5 - jetLen * 0.82,
          width: jetW * 0.36,
          height: jetLen * 0.82,
          background: `linear-gradient(to top, rgba(200,220,255,${(0.32 * intensity).toFixed(3)}) 0%, rgba(160,200,255,${(0.18 * intensity).toFixed(3)}) 40%, transparent 100%)`,
          filter: `blur(${(jetW * 0.13).toFixed(1)}px)`,
          transform: `rotate(${(-sway * 0.5).toFixed(2)}deg)`,
          transformOrigin: 'bottom center',
          pointerEvents: 'none',
        }}
      />
      {/* Top jet particles */}
      {jetsTop.map((p) => {
        const yp = jetY(p, -1);
        const op = jetOp(p);
        const xo = p.xDrift * jetW + Math.sin((loopFrame + p.offset) * 0.03) * jetW * 0.25;
        return (
          <div
            key={`jt-${p.id}`}
            style={{
              position: 'absolute',
              left: center + xo,
              top: center + yp,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              backgroundColor: `rgba(180,210,255,${op})`,
              boxShadow: `0 0 ${p.size * 2}px rgba(140,190,255,${op * 0.55})`,
              transform: 'translate(-50%,-50%)',
              pointerEvents: 'none',
            }}
          />
        );
      })}

      {/* --- Bottom jet beam --- */}
      <div
        style={{
          position: 'absolute',
          left: center - jetW / 2,
          top: center + ehR * 0.5,
          width: jetW,
          height: jetLen,
          background: `linear-gradient(to bottom, rgba(136,187,255,${(0.22 * intensity).toFixed(3)}) 0%, rgba(100,160,255,${(0.13 * intensity).toFixed(3)}) 30%, rgba(68,136,204,${(0.05 * intensity).toFixed(3)}) 60%, transparent 100%)`,
          filter: `blur(${(jetW * 0.28).toFixed(1)}px)`,
          transform: `rotate(${(sway * 0.5).toFixed(2)}deg)`,
          transformOrigin: 'top center',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: center - jetW * 0.18,
          top: center + ehR * 0.5,
          width: jetW * 0.36,
          height: jetLen * 0.82,
          background: `linear-gradient(to bottom, rgba(200,220,255,${(0.32 * intensity).toFixed(3)}) 0%, rgba(160,200,255,${(0.18 * intensity).toFixed(3)}) 40%, transparent 100%)`,
          filter: `blur(${(jetW * 0.13).toFixed(1)}px)`,
          transform: `rotate(${(sway * 0.5).toFixed(2)}deg)`,
          transformOrigin: 'top center',
          pointerEvents: 'none',
        }}
      />
      {/* Bottom jet particles */}
      {jetsBot.map((p) => {
        const yp = jetY(p, 1);
        const op = jetOp(p);
        const xo = p.xDrift * jetW + Math.sin((loopFrame + p.offset) * 0.03) * jetW * 0.25;
        return (
          <div
            key={`jb-${p.id}`}
            style={{
              position: 'absolute',
              left: center + xo,
              top: center + yp,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              backgroundColor: `rgba(180,210,255,${op})`,
              boxShadow: `0 0 ${p.size * 2}px rgba(140,190,255,${op * 0.55})`,
              transform: 'translate(-50%,-50%)',
              pointerEvents: 'none',
            }}
          />
        );
      })}

      {/* ═══════════════════════════════════════════════════
          LAYER 4 -- SVG DEFINITIONS (shared by front+back disk)
      ═══════════════════════════════════════════════════ */}
      <svg
        width={0}
        height={0}
        style={{ position: 'absolute' }}
        aria-hidden="true"
      >
        <defs>
          {/* Doppler-shifted accretion gradient */}
          <linearGradient id="bh-accGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a0d4ff" stopOpacity={0.92 * intensity} />
            <stop offset="18%" stopColor="#e8f0ff" stopOpacity={0.96 * intensity} />
            <stop offset="45%" stopColor="#ff8844" stopOpacity={0.72 * intensity} />
            <stop offset="70%" stopColor="#cc4422" stopOpacity={0.48 * intensity} />
            <stop offset="100%" stopColor="#a0d4ff" stopOpacity={0.92 * intensity} />
          </linearGradient>

          {/* Disk glow filter */}
          <filter id="bh-diskGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation={size * 0.007} result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="bh-diskGlowOuter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation={size * 0.014} result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Photon ring glow */}
          <filter id="bh-photonGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation={size * 0.005} result="b1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation={size * 0.014} result="b2" />
            <feMerge>
              <feMergeNode in="b2" />
              <feMergeNode in="b1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Lensing arc glow */}
          <linearGradient id="bh-lensGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a0d4ff" stopOpacity={0.48 * intensity} />
            <stop offset="30%" stopColor="#e8f0ff" stopOpacity={0.68 * intensity} />
            <stop offset="70%" stopColor="#ff8844" stopOpacity={0.38 * intensity} />
            <stop offset="100%" stopColor="#a0d4ff" stopOpacity={0.48 * intensity} />
          </linearGradient>

          <filter id="bh-lensGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation={size * 0.004} />
          </filter>

          {/* Clip: back half (above center -- top of tilted disk goes behind BH) */}
          <clipPath id="bh-backClip">
            <rect x="0" y="0" width={size} height={center} />
          </clipPath>

          {/* Clip: front half */}
          <clipPath id="bh-frontClip">
            <rect x="0" y={center} width={size} height={center} />
          </clipPath>

          {/* Mask: cut the event horizon out of the front disk */}
          <mask id="bh-frontMask">
            <rect x="0" y="0" width={size} height={size} fill="white" />
            <ellipse cx={center} cy={center} rx={ehR * 1.08} ry={ehR * 0.36} fill="black" />
          </mask>
        </defs>
      </svg>

      {/* ═══════════════════════════════════════════════════
          LAYER 5 -- ACCRETION DISK: BACK HALF (behind BH)
      ═══════════════════════════════════════════════════ */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible' }}
      >
        <g
          clipPath="url(#bh-backClip)"
          transform={`rotate(${diskDeg}, ${center}, ${center})`}
          filter="url(#bh-diskGlowOuter)"
        >
          {Array.from({ length: DISK_RING_COUNT }, (_, i) => {
            const t = i / (DISK_RING_COUNT - 1);
            const rx = interpolate(t, [0, 1], [diskInner, diskOuter]);
            const ry = rx * 0.3;
            const op =
              interpolate(t, [0, 0.25, 0.65, 1], [0.55, 1, 0.68, 0.28]) * intensity;
            const sw = interpolate(t, [0, 0.4, 1], [size * 0.011, size * 0.017, size * 0.007]);
            return (
              <ellipse
                key={`br-${i}`}
                cx={center}
                cy={center}
                rx={rx}
                ry={ry}
                fill="none"
                stroke="url(#bh-accGrad)"
                strokeWidth={sw}
                opacity={op}
              />
            );
          })}
        </g>
      </svg>

      {/* ═══════════════════════════════════════════════════
          LAYER 6 -- EVENT HORIZON
      ═══════════════════════════════════════════════════ */}
      <div
        style={{
          position: 'absolute',
          left: center - ehR,
          top: center - ehR,
          width: ehR * 2,
          height: ehR * 2,
          borderRadius: '50%',
          background: `radial-gradient(circle at 50% 50%, #000 0%, #000 58%, rgba(0,0,0,0.98) 68%, rgba(0,0,0,0.88) 80%, rgba(0,0,0,0.55) 90%, transparent 100%)`,
          boxShadow: `0 0 ${ehR * 0.3}px ${ehR * 0.1}px rgba(0,0,0,0.82), 0 0 ${ehR * 0.8}px ${ehR * 0.4}px rgba(0,0,0,0.55), 0 0 ${ehR * 1.4}px ${ehR * 0.55}px rgba(0,0,0,0.28)`,
          zIndex: 10,
        }}
      />

      {/* ═══════════════════════════════════════════════════
          LAYER 7 -- PHOTON SPHERE (Einstein ring)
      ═══════════════════════════════════════════════════ */}
      <div
        style={{
          position: 'absolute',
          left: center - psR,
          top: center - psR,
          width: psR * 2,
          height: psR * 2,
          borderRadius: '50%',
          border: `${(size * 0.005).toFixed(1)}px solid rgba(200,224,255,${(0.68 * pulse * intensity).toFixed(3)})`,
          boxShadow: [
            `0 0 ${(size * 0.02 * pulse).toFixed(1)}px rgba(200,224,255,${(0.48 * pulse * intensity).toFixed(3)})`,
            `0 0 ${(size * 0.05 * pulse).toFixed(1)}px rgba(160,200,255,${(0.28 * pulse * intensity).toFixed(3)})`,
            `0 0 ${(size * 0.09 * pulse).toFixed(1)}px rgba(120,170,255,${(0.12 * pulse * intensity).toFixed(3)})`,
            `inset 0 0 ${(size * 0.012 * pulse).toFixed(1)}px rgba(200,224,255,${(0.28 * pulse * intensity).toFixed(3)})`,
            `inset 0 0 ${(size * 0.035 * pulse).toFixed(1)}px rgba(160,200,255,${(0.12 * pulse * intensity).toFixed(3)})`,
          ].join(','),
          zIndex: 11,
          pointerEvents: 'none',
        }}
      />
      {/* Secondary photon ring */}
      <div
        style={{
          position: 'absolute',
          left: center - psR * 1.09,
          top: center - psR * 1.09,
          width: psR * 2.18,
          height: psR * 2.18,
          borderRadius: '50%',
          border: `${(size * 0.002).toFixed(1)}px solid rgba(180,210,255,${(0.22 * pulse * intensity).toFixed(3)})`,
          boxShadow: `0 0 ${(size * 0.028 * pulse).toFixed(1)}px rgba(160,200,255,${(0.1 * pulse * intensity).toFixed(3)})`,
          zIndex: 11,
          pointerEvents: 'none',
        }}
      />

      {/* ═══════════════════════════════════════════════════
          LAYER 8 -- ACCRETION DISK: FRONT HALF (over BH)
      ═══════════════════════════════════════════════════ */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible', zIndex: 12 }}
      >
        <g
          clipPath="url(#bh-frontClip)"
          transform={`rotate(${diskDeg}, ${center}, ${center})`}
          filter="url(#bh-diskGlow)"
          mask="url(#bh-frontMask)"
        >
          {Array.from({ length: DISK_RING_COUNT }, (_, i) => {
            const t = i / (DISK_RING_COUNT - 1);
            const rx = interpolate(t, [0, 1], [diskInner, diskOuter]);
            const ry = rx * 0.3;
            const op =
              interpolate(t, [0, 0.25, 0.65, 1], [0.65, 1, 0.75, 0.32]) * intensity;
            const sw = interpolate(t, [0, 0.4, 1], [size * 0.012, size * 0.019, size * 0.008]);
            return (
              <ellipse
                key={`fr-${i}`}
                cx={center}
                cy={center}
                rx={rx}
                ry={ry}
                fill="none"
                stroke="url(#bh-accGrad)"
                strokeWidth={sw}
                opacity={op}
              />
            );
          })}
        </g>
      </svg>

      {/* ═══════════════════════════════════════════════════
          LAYER 9 -- DISK GLOW HALO (diffused light in disk plane)
      ═══════════════════════════════════════════════════ */}
      <div
        style={{
          position: 'absolute',
          left: center - diskOuter * 1.18,
          top: center - diskOuter * 0.22,
          width: diskOuter * 2.36,
          height: diskOuter * 0.44,
          borderRadius: '50%',
          background: `radial-gradient(ellipse at 50% 50%, rgba(160,200,255,${(0.07 * intensity).toFixed(3)}) 0%, rgba(180,140,100,${(0.035 * intensity).toFixed(3)}) 40%, transparent 68%)`,
          filter: `blur(${(size * 0.028).toFixed(1)}px)`,
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* ═══════════════════════════════════════════════════
          LAYER 10 -- INNER ACCRETION GLOW (hot edge)
      ═══════════════════════════════════════════════════ */}
      <div
        style={{
          position: 'absolute',
          left: center - diskInner * 1.12,
          top: center - diskInner * 0.36,
          width: diskInner * 2.24,
          height: diskInner * 0.72,
          borderRadius: '50%',
          background: `radial-gradient(ellipse at 50% 50%, rgba(220,240,255,${(0.16 * intensity * pulse).toFixed(3)}) 0%, rgba(180,210,255,${(0.08 * intensity * pulse).toFixed(3)}) 40%, transparent 78%)`,
          filter: `blur(${(size * 0.01).toFixed(1)}px)`,
          zIndex: 13,
          pointerEvents: 'none',
        }}
      />

      {/* ═══════════════════════════════════════════════════
          LAYER 11 -- GRAVITATIONAL LENSING ARCS
          Light from the back of the disk bending over the top
      ═══════════════════════════════════════════════════ */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible', zIndex: 14 }}
      >
        <ellipse
          cx={center}
          cy={center}
          rx={ehR * 1.52}
          ry={ehR * 0.52}
          fill="none"
          stroke="url(#bh-lensGrad)"
          strokeWidth={size * 0.0055}
          opacity={0.58 * intensity * pulse}
          filter="url(#bh-lensGlow)"
          transform={`rotate(${(diskDeg * 0.3).toFixed(2)}, ${center}, ${center})`}
        />
        <ellipse
          cx={center}
          cy={center - ehR * 0.04}
          rx={ehR * 1.22}
          ry={ehR * 0.38}
          fill="none"
          stroke="url(#bh-lensGrad)"
          strokeWidth={size * 0.003}
          opacity={0.32 * intensity * pulse}
          filter="url(#bh-lensGlow)"
          transform={`rotate(${(diskDeg * 0.2).toFixed(2)}, ${center}, ${center})`}
        />
      </svg>

      {/* ═══════════════════════════════════════════════════
          LAYER 12 -- AMBIENT GLOW
      ═══════════════════════════════════════════════════ */}
      <div
        style={{
          position: 'absolute',
          left: center - size * 0.34,
          top: center - size * 0.34,
          width: size * 0.68,
          height: size * 0.68,
          borderRadius: '50%',
          background: `radial-gradient(circle at 50% 50%, rgba(140,180,255,${(0.035 * intensity * pulse).toFixed(3)}) 0%, rgba(120,160,240,${(0.018 * intensity).toFixed(3)}) 40%, transparent 68%)`,
          filter: `blur(${(size * 0.045).toFixed(1)}px)`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ═══════════════════════════════════════════════════
          LAYER 13 -- DOPPLER HIGHLIGHT
          Brighter hotspot on the approaching side of the disk
      ═══════════════════════════════════════════════════ */}
      {(() => {
        const ang = (diskDeg * Math.PI) / 180;
        const hx = center + Math.cos(ang) * diskInner * 1.28;
        const hy = center + Math.sin(ang) * diskInner * 0.4;
        const hs = size * 0.055;
        const approaching = Math.cos(ang) < 0;
        const hop = approaching
          ? interpolate(Math.cos(ang), [-1, -0.25], [0.22 * intensity, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })
          : 0;
        return (
          <div
            style={{
              position: 'absolute',
              left: hx - hs / 2,
              top: hy - hs / 2,
              width: hs,
              height: hs,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(220,240,255,${hop}) 0%, rgba(180,210,255,${hop * 0.5}) 40%, transparent 68%)`,
              filter: `blur(${(size * 0.008).toFixed(1)}px)`,
              zIndex: 15,
              pointerEvents: 'none',
            }}
          />
        );
      })()}
    </div>
  );
};
