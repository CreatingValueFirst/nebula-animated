'use client';

import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Sequence,
  AbsoluteFill,
} from 'remotion';
import { Stars } from './Stars';
import { TextReveal } from './TextReveal';

export const NebulaComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // ─────────────────────────────────────────────
  // 1. FADE IN FROM BLACK (first 30 frames)
  // ─────────────────────────────────────────────
  const fadeIn = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // ─────────────────────────────────────────────
  // 2. KEN BURNS — slow cinematic zoom over full duration
  // ─────────────────────────────────────────────
  const zoomScale = interpolate(
    frame,
    [0, durationInFrames],
    [1.0, 1.25],
    { extrapolateRight: 'clamp' }
  );

  // Slow drift to add organic feel (drift toward upper-right where the trunk detail is)
  const panX = interpolate(frame, [0, durationInFrames], [0, -3], {
    extrapolateRight: 'clamp',
  });
  const panY = interpolate(frame, [0, durationInFrames], [0, -2], {
    extrapolateRight: 'clamp',
  });

  // ─────────────────────────────────────────────
  // 3. PARALLAX LAYERS — three depth planes
  // ─────────────────────────────────────────────
  const parallaxBack = {
    scale: zoomScale * 0.98,
    x: panX * 0.6,
    y: panY * 0.6,
    opacity: 0.4,
  };

  const parallaxMid = {
    scale: zoomScale,
    x: panX,
    y: panY,
    opacity: 1,
  };

  const parallaxFront = {
    scale: zoomScale * 1.04,
    x: panX * 1.4,
    y: panY * 1.4,
    opacity: 0.15,
  };

  // ─────────────────────────────────────────────
  // 4. COLOR SHIFT — subtle hue rotation over time
  // ─────────────────────────────────────────────
  const hueRotation = interpolate(frame, [0, durationInFrames], [0, 15], {
    extrapolateRight: 'clamp',
  });

  // Subtle saturation pulse
  const saturation = interpolate(
    frame,
    [0, durationInFrames * 0.5, durationInFrames],
    [1.0, 1.12, 1.05]
  );

  // ─────────────────────────────────────────────
  // 5. VIGNETTE — pulsing dark edges
  // ─────────────────────────────────────────────
  const vignetteCycle = (frame % 90) / 90;
  const vignetteIntensity = interpolate(
    vignetteCycle,
    [0, 0.5, 1],
    [0.65, 0.75, 0.65]
  );

  // ─────────────────────────────────────────────
  // 6. SUBTITLE slide-up animation
  // ─────────────────────────────────────────────
  const subtitleStart = 90;
  const subtitleSpring = spring({
    frame: Math.max(0, frame - subtitleStart),
    fps,
    config: {
      damping: 70,
      stiffness: 50,
      mass: 1.2,
    },
  });

  const subtitleY = interpolate(subtitleSpring, [0, 1], [40, 0]);
  const subtitleOpacity = interpolate(subtitleSpring, [0, 1], [0, 0.85]);

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────

  const nebulaImageStyle = (
    layer: typeof parallaxBack
  ): React.CSSProperties => ({
    position: 'absolute',
    top: '-15%',
    left: '-15%',
    width: '130%',
    height: '130%',
    objectFit: 'cover',
    transform: `scale(${layer.scale}) translate(${layer.x}%, ${layer.y}%)`,
    opacity: layer.opacity,
    willChange: 'transform',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000000',
        overflow: 'hidden',
      }}
    >
      {/* ── PARALLAX BACK LAYER (blurred, low opacity) ── */}
      <AbsoluteFill
        style={{
          opacity: fadeIn,
          filter: `blur(4px) hue-rotate(${hueRotation * 0.7}deg) saturate(${saturation})`,
        }}
      >
        <img
          src="/nebula.jpg"
          alt=""
          style={nebulaImageStyle(parallaxBack)}
        />
      </AbsoluteFill>

      {/* ── PARALLAX MID LAYER (main image) ── */}
      <AbsoluteFill
        style={{
          opacity: fadeIn,
          filter: `hue-rotate(${hueRotation}deg) saturate(${saturation})`,
        }}
      >
        <img
          src="/nebula.jpg"
          alt=""
          style={nebulaImageStyle(parallaxMid)}
        />
      </AbsoluteFill>

      {/* ── PARALLAX FRONT LAYER (enhanced, low opacity for depth) ── */}
      <AbsoluteFill
        style={{
          opacity: fadeIn,
          filter: `blur(1px) hue-rotate(${hueRotation * 1.3}deg) saturate(${saturation * 1.1}) brightness(1.3)`,
          mixBlendMode: 'screen',
        }}
      >
        <img
          src="/nebula.jpg"
          alt=""
          style={nebulaImageStyle(parallaxFront)}
        />
      </AbsoluteFill>

      {/* ── COLOR SHIFT OVERLAY ── */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(
            ${120 + frame * 0.3}deg,
            rgba(0, 40, 80, 0.08) 0%,
            rgba(60, 20, 40, 0.06) 50%,
            rgba(0, 60, 60, 0.08) 100%
          )`,
          mixBlendMode: 'overlay',
          opacity: fadeIn,
        }}
      />

      {/* ── STAR PARTICLES ── */}
      <Sequence from={10}>
        <AbsoluteFill style={{ opacity: fadeIn }}>
          <Stars count={40} />
        </AbsoluteFill>
      </Sequence>

      {/* ── VIGNETTE OVERLAY ── */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(
            ellipse 70% 60% at 50% 50%,
            transparent 30%,
            rgba(0, 0, 0, ${vignetteIntensity * 0.4}) 65%,
            rgba(0, 0, 0, ${vignetteIntensity}) 100%
          )`,
          opacity: fadeIn,
        }}
      />

      {/* ── MAIN TITLE: "EXPLORE THE COSMOS" ── */}
      <Sequence from={60}>
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 20,
          }}
        >
          <TextReveal
            text="EXPLORE THE COSMOS"
            startFrame={0}
            fontSize={88}
            fontWeight={800}
            letterSpacingStart={0.5}
            letterSpacingEnd={0.12}
            color="rgba(255, 255, 255, 0.95)"
            staggerDelay={2}
            yOffset={35}
          />
        </AbsoluteFill>
      </Sequence>

      {/* ── SUBTITLE ── */}
      <Sequence from={subtitleStart}>
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 140,
            zIndex: 20,
          }}
        >
          <div
            style={{
              opacity: subtitleOpacity,
              transform: `translateY(${subtitleY}px)`,
              fontSize: 26,
              fontWeight: 300,
              color: 'rgba(200, 215, 235, 0.85)',
              fontFamily:
                "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              textShadow:
                '0 0 30px rgba(100, 160, 255, 0.2), 0 2px 10px rgba(0, 0, 0, 0.5)',
            }}
          >
            Journey through the Elephant&apos;s Trunk Nebula
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* ── TOP GRADIENT (cinematic letterbox feel) ── */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 15%, transparent 85%, rgba(0,0,0,0.3) 100%)',
          opacity: fadeIn,
          pointerEvents: 'none',
        }}
      />

      {/* ── FADE-IN BLACK OVERLAY ── */}
      <AbsoluteFill
        style={{
          backgroundColor: '#000000',
          opacity: 1 - fadeIn,
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
