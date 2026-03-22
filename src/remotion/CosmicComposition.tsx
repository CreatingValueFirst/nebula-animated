'use client';

import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  AbsoluteFill,
} from 'remotion';
import { BlackHole } from './BlackHole';
import { NebulaGas } from './NebulaGas';
import { Stars } from './Stars';
import { TextReveal } from './TextReveal';

// ---------------------------------------------------------------------------
// Service taglines that appear at the bottom
// ---------------------------------------------------------------------------
const SERVICE_TAGLINES = [
  'Neural Forge',
  'Voice Cosmos',
  'Vision Nebula',
  'Data Singularity',
  'Code Pulsar',
  'Quantum Mind',
];

// ---------------------------------------------------------------------------
// CosmicComposition
// 600 frames = 20 seconds at 30fps, loops seamlessly
// ---------------------------------------------------------------------------
export const CosmicComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  // =======================================================================
  // 1. FADE IN FROM PURE BLACK (frames 0-45)
  // =======================================================================
  const fadeIn = interpolate(frame, [0, 45], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // =======================================================================
  // 2. KEN BURNS -- slow cinematic push-in over full duration
  //    Zoom from 1.0x to 1.15x with slight pan toward center
  // =======================================================================
  const zoomScale = interpolate(
    frame,
    [0, durationInFrames],
    [1.0, 1.15],
    { extrapolateRight: 'clamp' },
  );

  // Slow drift toward center-right
  const panX = interpolate(frame, [0, durationInFrames], [0, -2], {
    extrapolateRight: 'clamp',
  });
  const panY = interpolate(frame, [0, durationInFrames], [0, -1.5], {
    extrapolateRight: 'clamp',
  });

  // =======================================================================
  // 3. COLOR SHIFT -- subtle hue rotation
  // =======================================================================
  const hueRotation = interpolate(frame, [0, durationInFrames], [0, 12], {
    extrapolateRight: 'clamp',
  });
  const saturation = interpolate(
    frame,
    [0, durationInFrames * 0.5, durationInFrames],
    [1.0, 1.1, 1.05],
  );

  // =======================================================================
  // 4. VIGNETTE -- pulsing dark edges
  // =======================================================================
  const vignetteCycle = (frame % 120) / 120;
  const vignetteIntensity = interpolate(
    vignetteCycle,
    [0, 0.5, 1],
    [0.6, 0.75, 0.6],
  );

  // =======================================================================
  // 5. BLACK HOLE entrance spring (frames 60-120)
  // =======================================================================
  const blackHoleEnterFrame = 60;

  // Gravitational lensing glow around the black hole
  const lensingOpacity = interpolate(
    frame,
    [blackHoleEnterFrame, blackHoleEnterFrame + 60, durationInFrames],
    [0, 0.5, 0.4],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // =======================================================================
  // 6. SUBTITLE: "Where Intelligence Meets the Infinite" (frames 130-170)
  // =======================================================================
  const subtitleStart = 130;
  const subtitleSpring = spring({
    frame: Math.max(0, frame - subtitleStart),
    fps,
    config: { damping: 70, stiffness: 50, mass: 1.2 },
  });
  const subtitleY = interpolate(subtitleSpring, [0, 1], [40, 0]);
  const subtitleOpacity = interpolate(subtitleSpring, [0, 1], [0, 0.85]);

  // =======================================================================
  // 7. SERVICE TAGLINES (frames 150-200, staggered)
  // =======================================================================
  const taglineBaseFrame = 150;

  // =======================================================================
  // RENDER HELPERS
  // =======================================================================

  const nebulaImageStyle: React.CSSProperties = {
    position: 'absolute',
    top: '-15%',
    left: '-15%',
    width: '130%',
    height: '130%',
    objectFit: 'cover',
    transform: `scale(${zoomScale}) translate(${panX}%, ${panY}%)`,
    willChange: 'transform',
  };

  return (
    <AbsoluteFill style={{ backgroundColor: '#000000', overflow: 'hidden' }}>

      {/* ================================================================
          LAYER 1: Nebula background image with Ken Burns
          ================================================================ */}
      <AbsoluteFill
        style={{
          opacity: fadeIn,
          filter: `hue-rotate(${hueRotation}deg) saturate(${saturation})`,
        }}
      >
        <img
          src="/nebula.jpg"
          alt=""
          style={nebulaImageStyle}
        />
      </AbsoluteFill>

      {/* Back parallax plane (blurred, lower opacity for depth) */}
      <AbsoluteFill
        style={{
          opacity: fadeIn * 0.35,
          filter: `blur(4px) hue-rotate(${hueRotation * 0.7}deg) saturate(${saturation})`,
        }}
      >
        <img
          src="/nebula.jpg"
          alt=""
          style={{
            ...nebulaImageStyle,
            transform: `scale(${zoomScale * 0.97}) translate(${panX * 0.6}%, ${panY * 0.6}%)`,
          }}
        />
      </AbsoluteFill>

      {/* Front parallax plane (screen blend, slight enhancement) */}
      <AbsoluteFill
        style={{
          opacity: fadeIn * 0.12,
          filter: `blur(1px) hue-rotate(${hueRotation * 1.3}deg) saturate(${saturation * 1.1}) brightness(1.3)`,
          mixBlendMode: 'screen',
        }}
      >
        <img
          src="/nebula.jpg"
          alt=""
          style={{
            ...nebulaImageStyle,
            transform: `scale(${zoomScale * 1.04}) translate(${panX * 1.4}%, ${panY * 1.4}%)`,
          }}
        />
      </AbsoluteFill>

      {/* Color shift overlay */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(
            ${120 + frame * 0.2}deg,
            rgba(0, 40, 80, 0.06) 0%,
            rgba(60, 20, 40, 0.04) 50%,
            rgba(0, 60, 60, 0.06) 100%
          )`,
          mixBlendMode: 'overlay',
          opacity: fadeIn,
        }}
      />

      {/* ================================================================
          LAYER 2: NebulaGas overlay -- drifting clouds
          ================================================================ */}
      <Sequence from={30}>
        <AbsoluteFill style={{ opacity: fadeIn * 0.9 }}>
          <NebulaGas width={width} height={height} density={0.6} />
        </AbsoluteFill>
      </Sequence>

      {/* ================================================================
          LAYER 3: Stars twinkling (60 stars)
          ================================================================ */}
      <Sequence from={45}>
        <AbsoluteFill style={{ opacity: fadeIn }}>
          <Stars count={60} />
        </AbsoluteFill>
      </Sequence>

      {/* ================================================================
          LAYER 4: Black Hole (centered, size ~350px)
          Fades in at frame 60, grows with spring animation
          ================================================================ */}
      <Sequence from={blackHoleEnterFrame}>
        <BlackHole size={350} />
      </Sequence>

      {/* ================================================================
          LAYER 5: Gravitational lensing glow around black hole
          ================================================================ */}
      <AbsoluteFill
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: `radial-gradient(
              circle,
              rgba(45, 138, 138, ${lensingOpacity * 0.08}) 0%,
              rgba(74, 158, 255, ${lensingOpacity * 0.04}) 30%,
              rgba(196, 98, 58, ${lensingOpacity * 0.03}) 50%,
              transparent 70%
            )`,
            filter: 'blur(20px)',
            opacity: fadeIn,
          }}
        />
      </AbsoluteFill>

      {/* ================================================================
          LAYER 6: Text overlays
          ================================================================ */}

      {/* Main title: "HEAVEN INTERACTIVE" (frames 90-150) */}
      <Sequence from={90}>
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: 80,
            zIndex: 20,
          }}
        >
          <TextReveal
            text="HEAVEN INTERACTIVE"
            startFrame={0}
            fontSize={82}
            fontWeight={800}
            letterSpacingStart={0.45}
            letterSpacingEnd={0.1}
            color="rgba(255, 255, 255, 0.95)"
            staggerDelay={2}
            yOffset={35}
          />
        </AbsoluteFill>
      </Sequence>

      {/* Subtitle: "Where Intelligence Meets the Infinite" (frames 130-170) */}
      <Sequence from={subtitleStart}>
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 100,
            zIndex: 20,
          }}
        >
          <div
            style={{
              opacity: subtitleOpacity,
              transform: `translateY(${subtitleY}px)`,
              fontSize: 24,
              fontWeight: 300,
              color: 'rgba(200, 215, 235, 0.85)',
              fontFamily:
                "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
              letterSpacing: '0.15em',
              textTransform: 'uppercase' as const,
              textShadow:
                '0 0 30px rgba(100, 160, 255, 0.2), 0 2px 10px rgba(0, 0, 0, 0.5)',
            }}
          >
            Where Intelligence Meets the Infinite
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Service taglines (frames 150-200, staggered appearance) */}
      <Sequence from={taglineBaseFrame}>
        <AbsoluteFill
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            paddingBottom: '12%',
            zIndex: 20,
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {SERVICE_TAGLINES.map((tag, i) => {
              const tagDelay = i * 8;
              const tagFrame = Math.max(0, frame - taglineBaseFrame - tagDelay);
              const tagSpring = spring({
                frame: tagFrame,
                fps,
                config: { damping: 60, stiffness: 70, mass: 0.8 },
              });
              const tagOpacity = interpolate(tagSpring, [0, 1], [0, 0.7]);
              const tagY = interpolate(tagSpring, [0, 1], [16, 0]);

              return (
                <React.Fragment key={tag}>
                  {i > 0 && (
                    <span
                      style={{
                        opacity: tagOpacity * 0.5,
                        fontSize: 13,
                        color: 'rgba(45, 138, 138, 0.6)',
                        transform: `translateY(${tagY}px)`,
                        userSelect: 'none',
                      }}
                    >
                      &#xb7;
                    </span>
                  )}
                  <span
                    style={{
                      opacity: tagOpacity,
                      transform: `translateY(${tagY}px)`,
                      fontSize: 14,
                      fontWeight: 400,
                      color: 'rgba(200, 215, 235, 0.7)',
                      fontFamily:
                        "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase' as const,
                      textShadow: '0 1px 6px rgba(0, 0, 0, 0.5)',
                    }}
                  >
                    {tag}
                  </span>
                </React.Fragment>
              );
            })}
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* ================================================================
          LAYER 7: Vignette (pulsing)
          ================================================================ */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(
            ellipse 70% 60% at 50% 50%,
            transparent 25%,
            rgba(0, 0, 0, ${vignetteIntensity * 0.35}) 60%,
            rgba(0, 0, 0, ${vignetteIntensity}) 100%
          )`,
          opacity: fadeIn,
          pointerEvents: 'none',
        }}
      />

      {/* ================================================================
          LAYER 8: Letterbox bars (cinematic top/bottom gradients)
          ================================================================ */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 12%, transparent 88%, rgba(0,0,0,0.35) 100%)',
          opacity: fadeIn,
          pointerEvents: 'none',
        }}
      />

      {/* ================================================================
          FADE-IN BLACK OVERLAY (initial black that dissolves)
          ================================================================ */}
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
