'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

interface CosmicVideoProps {
  baseName: string;
  poster?: string;
  className?: string;
  priority?: boolean;
}

export default function CosmicVideo({
  baseName,
  poster = '/nebula-4k.jpg',
  className = '',
  priority = false,
}: CosmicVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(priority);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 768px)');
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // Intersection observer: only load/play video when visible
  const observerRef = useCallback(
    (node: HTMLVideoElement | null) => {
      if (priority || !node) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { rootMargin: '200px' }
      );
      observer.observe(node);
      return () => observer.disconnect();
    },
    [priority]
  );

  // Pause when off-screen to save resources
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [isVisible]);

  const suffix = isMobile ? '-mobile' : '';
  const webmSrc = `/${baseName}${suffix}.webm`;
  const mp4Src = `/${baseName}${suffix}.mp4`;
  const mobilePoster = isMobile ? '/nebula-mobile.jpg' : poster;

  if (!isVisible && !priority) {
    return (
      <div
        ref={observerRef as unknown as React.Ref<HTMLDivElement>}
        className={className}
        style={{ backgroundImage: `url(${mobilePoster})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
    );
  }

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
