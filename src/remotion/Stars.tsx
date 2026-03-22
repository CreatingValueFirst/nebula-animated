'use client';

import React, { useMemo } from 'react';
import { useCurrentFrame, interpolate, AbsoluteFill } from 'remotion';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  color: string;
}

// Deterministic pseudo-random generator so stars are stable across frames
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export const Stars: React.FC<{ count?: number }> = ({ count = 40 }) => {
  const frame = useCurrentFrame();

  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: count }, (_, i) => {
      const seed = i + 1;
      const r1 = seededRandom(seed);
      const r2 = seededRandom(seed * 2.1);
      const r3 = seededRandom(seed * 3.7);
      const r4 = seededRandom(seed * 5.3);
      const r5 = seededRandom(seed * 7.9);
      const r6 = seededRandom(seed * 11.3);

      // Slight color variation: white, pale blue, pale gold
      const colors = [
        'rgba(255, 255, 255,',
        'rgba(200, 220, 255,',
        'rgba(255, 240, 200,',
        'rgba(180, 210, 255,',
        'rgba(255, 225, 180,',
      ];

      return {
        id: i,
        x: r1 * 100,
        y: r2 * 100,
        size: 1 + r3 * 3,
        baseOpacity: 0.3 + r4 * 0.7,
        twinkleSpeed: 0.8 + r5 * 2.5,
        twinkleOffset: r6 * Math.PI * 2,
        color: colors[Math.floor(r6 * colors.length)],
      };
    });
  }, [count]);

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 10 }}>
      {stars.map((star) => {
        // Create a smooth twinkle cycle using interpolate with modular input
        const cycleLength = Math.round(60 / star.twinkleSpeed);
        const cyclePosition = (frame + Math.round(star.twinkleOffset * 30)) % cycleLength;

        const twinkleOpacity = interpolate(
          cyclePosition,
          [0, cycleLength * 0.25, cycleLength * 0.5, cycleLength * 0.75, cycleLength],
          [
            star.baseOpacity * 0.3,
            star.baseOpacity,
            star.baseOpacity * 0.4,
            star.baseOpacity * 0.9,
            star.baseOpacity * 0.3,
          ]
        );

        // Subtle glow pulse
        const glowSize = interpolate(
          cyclePosition,
          [0, cycleLength * 0.5, cycleLength],
          [star.size * 1.5, star.size * 3, star.size * 1.5]
        );

        return (
          <div
            key={star.id}
            style={{
              position: 'absolute',
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              borderRadius: '50%',
              backgroundColor: `${star.color} ${twinkleOpacity})`,
              boxShadow: `0 0 ${glowSize}px ${glowSize * 0.5}px ${star.color} ${twinkleOpacity * 0.6})`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
