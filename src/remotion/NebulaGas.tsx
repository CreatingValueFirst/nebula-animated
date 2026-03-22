'use client';

import React, { useMemo } from 'react';
import { useCurrentFrame, interpolate, AbsoluteFill } from 'remotion';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface NebulaGasProps {
  width: number;
  height: number;
  density?: number; // 0-1, default 0.7
}

interface GasCloud {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  color1: string;
  color2: string;
  driftSpeedX: number;
  driftSpeedY: number;
  driftPhaseX: number;
  driftPhaseY: number;
  driftAmplitudeX: number;
  driftAmplitudeY: number;
  scaleBase: number;
  scalePulseSpeed: number;
  scalePulsePhase: number;
}

interface DustParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  driftSpeedX: number;
  driftSpeedY: number;
  driftPhaseX: number;
  driftPhaseY: number;
  twinkleSpeed: number;
  twinklePhase: number;
  twinkles: boolean;
}

interface NebulaWisp {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  color: string;
  driftPhase: number;
}

interface EnergyFilament {
  id: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  pulseSpeed: number;
  pulsePhase: number;
  opacity: number;
  thickness: number;
}

// ---------------------------------------------------------------------------
// Deterministic pseudo-random (same algorithm as Stars.tsx for consistency)
// ---------------------------------------------------------------------------

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// Deterministic sine-wave helper: returns value in [-1, 1]
function sineWave(frame: number, speed: number, phase: number): number {
  return Math.sin((frame * speed * 0.02) + phase);
}

// ---------------------------------------------------------------------------
// Palette
// ---------------------------------------------------------------------------

const NEBULA_COLORS = [
  '#2d8a8a', // teal
  '#c4623a', // orange
  '#8b2020', // crimson
  '#4a9eff', // blue
  '#c4847a', // pink
];

const DUST_COLORS = [
  'rgba(255, 255, 255,',       // white
  'rgba(180, 210, 255,',       // pale blue
  'rgba(255, 200, 160,',       // pale orange
  'rgba(200, 230, 255,',       // ice blue
  'rgba(255, 220, 200,',       // warm white
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const NebulaGas: React.FC<NebulaGasProps> = ({
  width,
  height,
  density = 0.7,
}) => {
  const frame = useCurrentFrame();

  // Scale counts by density
  const cloudCount = Math.round(interpolate(density, [0, 1], [4, 12]));
  const dustCount = Math.round(interpolate(density, [0, 1], [40, 150]));
  const wispCount = Math.round(interpolate(density, [0, 1], [2, 6]));
  const filamentCount = Math.round(interpolate(density, [0, 1], [1, 5]));

  // -----------------------------------------------------------------------
  // 1. GAS CLOUDS
  // -----------------------------------------------------------------------

  const gasClouds = useMemo<GasCloud[]>(() => {
    return Array.from({ length: cloudCount }, (_, i) => {
      const seed = (i + 1) * 1000;
      const r = (offset: number) => seededRandom(seed + offset);

      const c1Index = Math.floor(r(1) * NEBULA_COLORS.length);
      const c2Index = (c1Index + 1 + Math.floor(r(2) * (NEBULA_COLORS.length - 1))) % NEBULA_COLORS.length;

      return {
        id: i,
        x: r(3) * 100,
        y: r(4) * 100,
        size: 200 + r(5) * 400,
        opacity: 0.05 + r(6) * 0.10,
        color1: NEBULA_COLORS[c1Index],
        color2: NEBULA_COLORS[c2Index],
        driftSpeedX: 0.3 + r(7) * 0.7,
        driftSpeedY: 0.3 + r(8) * 0.7,
        driftPhaseX: r(9) * Math.PI * 2,
        driftPhaseY: r(10) * Math.PI * 2,
        driftAmplitudeX: 15 + r(11) * 40,
        driftAmplitudeY: 10 + r(12) * 30,
        scaleBase: 0.9 + r(13) * 0.2,
        scalePulseSpeed: 0.2 + r(14) * 0.4,
        scalePulsePhase: r(15) * Math.PI * 2,
      };
    });
  }, [cloudCount]);

  // -----------------------------------------------------------------------
  // 2. COSMIC DUST PARTICLES
  // -----------------------------------------------------------------------

  const dustParticles = useMemo<DustParticle[]>(() => {
    return Array.from({ length: dustCount }, (_, i) => {
      const seed = (i + 1) * 2000;
      const r = (offset: number) => seededRandom(seed + offset);

      const colorIndex = Math.floor(r(1) * DUST_COLORS.length);

      return {
        id: i,
        x: r(2) * 100,
        y: r(3) * 100,
        size: 1 + r(4) * 2,
        color: DUST_COLORS[colorIndex],
        opacity: 0.2 + r(5) * 0.6,
        driftSpeedX: 0.1 + r(6) * 0.5,
        driftSpeedY: 0.1 + r(7) * 0.5,
        driftPhaseX: r(8) * Math.PI * 2,
        driftPhaseY: r(9) * Math.PI * 2,
        twinkleSpeed: 0.8 + r(10) * 2.0,
        twinklePhase: r(11) * Math.PI * 2,
        twinkles: r(12) > 0.4, // ~60% of particles twinkle
      };
    });
  }, [dustCount]);

  // -----------------------------------------------------------------------
  // 3. NEBULA WISPS
  // -----------------------------------------------------------------------

  const nebulaWisps = useMemo<NebulaWisp[]>(() => {
    return Array.from({ length: wispCount }, (_, i) => {
      const seed = (i + 1) * 3000;
      const r = (offset: number) => seededRandom(seed + offset);

      return {
        id: i,
        x: 10 + r(1) * 80,
        y: 10 + r(2) * 80,
        width: 300 + r(3) * 400,
        height: 40 + r(4) * 80,
        rotation: r(5) * 360,
        rotationSpeed: 0.05 + r(6) * 0.15,
        opacity: 0.03 + r(7) * 0.06,
        color: NEBULA_COLORS[Math.floor(r(8) * NEBULA_COLORS.length)],
        driftPhase: r(9) * Math.PI * 2,
      };
    });
  }, [wispCount]);

  // -----------------------------------------------------------------------
  // 4. ENERGY FILAMENTS
  // -----------------------------------------------------------------------

  const energyFilaments = useMemo<EnergyFilament[]>(() => {
    return Array.from({ length: filamentCount }, (_, i) => {
      const seed = (i + 1) * 4000;
      const r = (offset: number) => seededRandom(seed + offset);

      return {
        id: i,
        x1: r(1) * 100,
        y1: r(2) * 100,
        x2: r(3) * 100,
        y2: r(4) * 100,
        color: NEBULA_COLORS[Math.floor(r(5) * NEBULA_COLORS.length)],
        pulseSpeed: 0.5 + r(6) * 1.5,
        pulsePhase: r(7) * Math.PI * 2,
        opacity: 0.06 + r(8) * 0.12,
        thickness: 0.5 + r(9) * 1.5,
      };
    });
  }, [filamentCount]);

  // -----------------------------------------------------------------------
  // RENDER: Gas Clouds Layer
  // -----------------------------------------------------------------------

  const renderGasClouds = () => (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {gasClouds.map((cloud) => {
        const driftX = sineWave(frame, cloud.driftSpeedX, cloud.driftPhaseX) * cloud.driftAmplitudeX;
        const driftY = sineWave(frame, cloud.driftSpeedY, cloud.driftPhaseY) * cloud.driftAmplitudeY;
        const scalePulse = cloud.scaleBase + sineWave(frame, cloud.scalePulseSpeed, cloud.scalePulsePhase) * 0.05;

        // Translate percentage-based position to pixel offset from center of blob
        const posX = (cloud.x / 100) * width - cloud.size / 2;
        const posY = (cloud.y / 100) * height - cloud.size / 2;

        return (
          <div
            key={`cloud-${cloud.id}`}
            style={{
              position: 'absolute',
              left: posX + driftX,
              top: posY + driftY,
              width: cloud.size,
              height: cloud.size,
              borderRadius: '50%',
              background: `radial-gradient(ellipse at center, ${cloud.color1}88 0%, ${cloud.color2}44 40%, transparent 70%)`,
              opacity: cloud.opacity,
              transform: `scale(${scalePulse})`,
              mixBlendMode: 'screen',
              willChange: 'transform, opacity',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );

  // -----------------------------------------------------------------------
  // RENDER: Cosmic Dust Particles Layer
  // -----------------------------------------------------------------------

  const renderDustParticles = () => (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {dustParticles.map((p) => {
        const driftX = sineWave(frame, p.driftSpeedX, p.driftPhaseX) * 8;
        const driftY = sineWave(frame, p.driftSpeedY, p.driftPhaseY) * 8;

        // Twinkle: oscillate between 30% and 100% of base opacity
        let currentOpacity = p.opacity;
        if (p.twinkles) {
          const twinkleFactor = 0.3 + 0.7 * ((sineWave(frame, p.twinkleSpeed, p.twinklePhase) + 1) / 2);
          currentOpacity = p.opacity * twinkleFactor;
        }

        const posX = (p.x / 100) * width + driftX;
        const posY = (p.y / 100) * height + driftY;

        return (
          <div
            key={`dust-${p.id}`}
            style={{
              position: 'absolute',
              left: posX,
              top: posY,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              backgroundColor: `${p.color} ${currentOpacity})`,
              boxShadow: p.size > 1.8
                ? `0 0 ${p.size * 2}px ${p.size}px ${p.color} ${currentOpacity * 0.4})`
                : undefined,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );

  // -----------------------------------------------------------------------
  // RENDER: Nebula Wisps Layer
  // -----------------------------------------------------------------------

  const renderNebulaWisps = () => (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {nebulaWisps.map((wisp) => {
        const currentRotation = wisp.rotation + sineWave(frame, wisp.rotationSpeed, wisp.driftPhase) * 15;
        const breathe = 1 + sineWave(frame, 0.15, wisp.driftPhase) * 0.08;
        const driftX = sineWave(frame, 0.2, wisp.driftPhase) * 20;
        const driftY = sineWave(frame, 0.15, wisp.driftPhase + 1.5) * 15;

        const posX = (wisp.x / 100) * width - wisp.width / 2;
        const posY = (wisp.y / 100) * height - wisp.height / 2;

        return (
          <div
            key={`wisp-${wisp.id}`}
            style={{
              position: 'absolute',
              left: posX + driftX,
              top: posY + driftY,
              width: wisp.width,
              height: wisp.height,
              borderRadius: '50%',
              background: `radial-gradient(ellipse at center, ${wisp.color}66 0%, ${wisp.color}22 30%, transparent 65%)`,
              opacity: wisp.opacity,
              transform: `rotate(${currentRotation}deg) scaleX(${breathe * 2.5}) scaleY(${breathe})`,
              mixBlendMode: 'screen',
              willChange: 'transform',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );

  // -----------------------------------------------------------------------
  // RENDER: Energy Filaments Layer (SVG)
  // -----------------------------------------------------------------------

  const renderEnergyFilaments = () => {
    // Unique gradient IDs per filament
    const gradientIds = energyFilaments.map((f) => `filament-grad-${f.id}`);

    return (
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <defs>
            {energyFilaments.map((f, i) => {
              // Pulse travels along the filament: animated stop-opacity
              const pulsePosition = ((sineWave(frame, f.pulseSpeed, f.pulsePhase) + 1) / 2);
              const midStop = Math.max(0.1, Math.min(0.9, pulsePosition));

              return (
                <linearGradient
                  key={gradientIds[i]}
                  id={gradientIds[i]}
                  x1={`${f.x1}%`}
                  y1={`${f.y1}%`}
                  x2={`${f.x2}%`}
                  y2={`${f.y2}%`}
                >
                  <stop offset="0%" stopColor={f.color} stopOpacity={f.opacity * 0.2} />
                  <stop offset={`${midStop * 100}%`} stopColor={f.color} stopOpacity={f.opacity * 1.5} />
                  <stop offset="100%" stopColor={f.color} stopOpacity={f.opacity * 0.2} />
                </linearGradient>
              );
            })}

            {/* Soft glow filter */}
            <filter id="filament-glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {energyFilaments.map((f, i) => {
            // Animate endpoints with subtle drift
            const x1 = (f.x1 / 100) * width + sineWave(frame, 0.3, f.pulsePhase) * 10;
            const y1 = (f.y1 / 100) * height + sineWave(frame, 0.25, f.pulsePhase + 1) * 10;
            const x2 = (f.x2 / 100) * width + sineWave(frame, 0.2, f.pulsePhase + 2) * 10;
            const y2 = (f.y2 / 100) * height + sineWave(frame, 0.35, f.pulsePhase + 3) * 10;

            // Curved control points for organic shape
            const midX = (x1 + x2) / 2 + sineWave(frame, 0.15, f.pulsePhase + 4) * 40;
            const midY = (y1 + y2) / 2 + sineWave(frame, 0.2, f.pulsePhase + 5) * 30;

            const breatheOpacity = 0.6 + 0.4 * ((sineWave(frame, f.pulseSpeed * 0.7, f.pulsePhase + 6) + 1) / 2);

            return (
              <g key={`filament-${f.id}`} opacity={breatheOpacity}>
                {/* Glow layer */}
                <path
                  d={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
                  fill="none"
                  stroke={`url(#${gradientIds[i]})`}
                  strokeWidth={f.thickness * 4}
                  strokeLinecap="round"
                  filter="url(#filament-glow)"
                  opacity={0.4}
                />
                {/* Core line */}
                <path
                  d={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
                  fill="none"
                  stroke={`url(#${gradientIds[i]})`}
                  strokeWidth={f.thickness}
                  strokeLinecap="round"
                />
                {/* Bright point at pulse position */}
                {(() => {
                  const t = (sineWave(frame, f.pulseSpeed, f.pulsePhase) + 1) / 2;
                  const pX = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * midX + t * t * x2;
                  const pY = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * midY + t * t * y2;
                  return (
                    <circle
                      cx={pX}
                      cy={pY}
                      r={f.thickness * 2}
                      fill={f.color}
                      opacity={f.opacity * 2}
                      filter="url(#filament-glow)"
                    />
                  );
                })()}
              </g>
            );
          })}
        </svg>
      </AbsoluteFill>
    );
  };

  // -----------------------------------------------------------------------
  // MAIN RENDER
  // -----------------------------------------------------------------------

  return (
    <AbsoluteFill
      style={{
        width,
        height,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Layer 1: Gas Clouds (deepest, largest, most diffuse) */}
      {renderGasClouds()}

      {/* Layer 2: Nebula Wisps (elongated ghostly shapes) */}
      {renderNebulaWisps()}

      {/* Layer 3: Energy Filaments (SVG curves with pulsing glow) */}
      {renderEnergyFilaments()}

      {/* Layer 4: Cosmic Dust (closest to camera, tiny particles) */}
      {renderDustParticles()}
    </AbsoluteFill>
  );
};
