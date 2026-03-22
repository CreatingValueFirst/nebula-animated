'use client';

import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

interface TextRevealProps {
  text: string;
  startFrame: number;
  fontSize?: number;
  fontWeight?: number;
  letterSpacingStart?: number;
  letterSpacingEnd?: number;
  color?: string;
  staggerDelay?: number;
  yOffset?: number;
  style?: React.CSSProperties;
}

export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  startFrame,
  fontSize = 80,
  fontWeight = 700,
  letterSpacingStart = 0.4,
  letterSpacingEnd = 0.08,
  color = 'rgba(255, 255, 255, 0.95)',
  staggerDelay = 2,
  yOffset = 30,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const letters = text.split('');

  // Overall container fade and letter spacing animation
  const containerProgress = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: {
      damping: 80,
      stiffness: 60,
      mass: 1,
    },
  });

  const letterSpacing = interpolate(
    containerProgress,
    [0, 1],
    [letterSpacingStart, letterSpacingEnd]
  );

  // Subtle glow that builds up
  const glowOpacity = interpolate(
    frame - startFrame,
    [0, 30, 60],
    [0, 0, 0.3],
    { extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        letterSpacing: `${letterSpacing}em`,
        textShadow: `0 0 40px rgba(180, 220, 255, ${glowOpacity}), 0 0 80px rgba(100, 160, 255, ${glowOpacity * 0.5})`,
        ...style,
      }}
    >
      {letters.map((letter, index) => {
        const letterStart = startFrame + index * staggerDelay;
        const relativeFrame = Math.max(0, frame - letterStart);

        // Spring for natural entry
        const springProgress = spring({
          frame: relativeFrame,
          fps,
          config: {
            damping: 60,
            stiffness: 80,
            mass: 0.8,
          },
        });

        const opacity = interpolate(springProgress, [0, 1], [0, 1]);
        const translateY = interpolate(springProgress, [0, 1], [yOffset, 0]);

        // Very subtle scale for a breath-like entrance
        const scale = interpolate(springProgress, [0, 0.5, 1], [0.8, 1.02, 1]);

        return (
          <span
            key={`${letter}-${index}`}
            style={{
              display: 'inline-block',
              opacity,
              transform: `translateY(${translateY}px) scale(${scale})`,
              fontSize,
              fontWeight,
              color,
              fontFamily:
                "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
              // Preserve spaces
              whiteSpace: 'pre',
            }}
          >
            {letter}
          </span>
        );
      })}
    </div>
  );
};
