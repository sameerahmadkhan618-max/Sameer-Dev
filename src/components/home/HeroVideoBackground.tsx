import React, { useRef, useEffect, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import codingVideo from '../../assets/videos/coding_video_loop.mp4';

export const HeroVideoBackground: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();
  
  // Track desktop vs mobile (width >= 768px for desktop video)
  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return window.innerWidth >= 768;
  });

  // Track window resize for desktop media query
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Video Autoplay & tab visibility handler (Only runs on desktop when not reduced-motion)
  useEffect(() => {
    if (!isDesktop || prefersReducedMotion) {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      return;
    }

    const videoEl = videoRef.current;
    if (!videoEl) return;

    const playVideo = () => {
      if (videoEl && !prefersReducedMotion && !document.hidden) {
        videoEl.play().catch(() => {});
      }
    };

    const handleVisibilityChange = () => {
      if (!videoEl) return;
      if (document.hidden || prefersReducedMotion) {
        videoEl.pause();
      } else {
        playVideo();
      }
    };

    // Lazy load the video on desktop
    videoEl.load();
    playVideo();

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isDesktop, prefersReducedMotion]);

  // High-performance digital code rain canvas (subtle watermark depth)
  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number | null = null;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleCanvasResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleCanvasResize, { passive: true });

    // Characters for developer code stream
    const chars = '01{}<>/*=+$#@!%&λπReactTypeScriptAsyncAwaitConstReturnSameerDev'.split('');
    const fontSize = 14;
    const columns = Math.floor(width / 24);
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -100);
    }

    let frameCount = 0;

    const draw = () => {
      if (document.hidden) {
        animationFrameId = null;
        return;
      }

      frameCount++;
      // Draw at 30fps for CPU/battery efficiency
      if (frameCount % 2 === 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
        ctx.fillRect(0, 0, width, height);

        ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

        for (let i = 0; i < drops.length; i++) {
          const char = chars[Math.floor(Math.random() * chars.length)];
          const x = i * 24;
          const y = drops[i] * fontSize;

          // Soft blue and amber code accents in light background
          const isAmber = i % 6 === 0;
          if (isAmber) {
            ctx.fillStyle = '#d97706';
            ctx.shadowColor = 'rgba(245, 158, 11, 0.3)';
            ctx.shadowBlur = 2;
          } else {
            ctx.fillStyle = '#0284c7';
            ctx.shadowColor = 'rgba(2, 132, 199, 0.25)';
            ctx.shadowBlur = 2;
          }

          ctx.fillText(char, x, y);
          ctx.shadowBlur = 0;

          if (y > height && Math.random() > 0.985) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    const handleCanvasVisibilityChange = () => {
      if (document.hidden) {
        if (animationFrameId !== null) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      } else {
        if (animationFrameId === null) {
          animationFrameId = requestAnimationFrame(draw);
        }
      }
    };

    document.addEventListener('visibilitychange', handleCanvasVisibilityChange);

    if (!document.hidden) {
      animationFrameId = requestAnimationFrame(draw);
    }

    return () => {
      window.removeEventListener('resize', handleCanvasResize);
      document.removeEventListener('visibilitychange', handleCanvasVisibilityChange);
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <div 
        className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white via-sky-50/40 to-slate-50/60" 
        aria-hidden="true" 
      />
    );
  }

  return (
    <div 
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0 bg-slate-50/60" 
      aria-hidden="true"
    >
      {/* Mobile Optimization: Video is never rendered on <768px screens. CSS subtle pattern handles mobile aesthetic */}
      {isDesktop ? (
        <video
          ref={videoRef}
          src={codingVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          className="w-full h-full object-cover object-center opacity-18 sm:opacity-22 select-none filter contrast-105 brightness-105 mix-blend-multiply"
        />
      ) : (
        /* Mobile background gradient & pattern fallback (lightweight, zero video overhead) */
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-white to-slate-50/50" />
      )}

      {/* Layer 2: Subtle Digital Code Stream Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-10"
      />

      {/* Layer 3: Clean Light Gradient Overlays keeping background subtly blended into white theme */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/85 via-white/60 to-white pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-white/75 via-transparent to-white/75 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-50" />
    </div>
  );
};
