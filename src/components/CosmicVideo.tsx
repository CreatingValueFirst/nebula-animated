'use client';

import React, { useRef, useEffect, useState } from 'react';

interface CosmicVideoProps {
  /** Base name without extension, e.g. "cosmic-video-ultimate" */
  baseName: string;
  poster?: string;
  className?: string;
  priority?: boolean;
}

/**
 * Responsive cosmic background video component.
 * - Desktop: 4K WebM (VP9) with MP4 fallback
 * - Mobile (<768px): 1080p WebM with MP4 fallback
 * - Poster shown while video loads
 */
export default function CosmicVideo({
  baseName,
  poster = '/nebula-4k.jpg',
  className = '',
  priority = false,
}: CosmicVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 768px)');
    setIsMobile(mql.matches);

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // Build source paths
  const suffix = isMobile ? '-mobile' : '';
  const webmSrc = `/${baseName}${suffix}.webm`;
  const mp4Src = `/${baseName}${suffix}.mp4`;
  const mobilePoster = isMobile ? '/nebula-mobile.jpg' : poster;

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      preload={priority ? 'auto' : 'metadata'}
      poster={mobilePoster}
      className={className}
    >
      <source src={webmSrc} type="video/webm" />
      <source src={mp4Src} type="video/mp4" />
    </video>
  );
}
