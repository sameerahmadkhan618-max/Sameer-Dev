import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown, ArrowUpRight, ChevronDown } from 'lucide-react';
import { DeveloperPortrait3D } from './DeveloperPortrait3D';
import { HeroVideoBackground } from './HeroVideoBackground';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import hero3dBg from '../../assets/images/hero_3d_bg.jpg';

interface HeroProps {
  onNavigate?: (href: string) => void;
}

const TRUST_SKILLS = [
  'React',
  'TypeScript',
  'JavaScript',
  'Tailwind CSS',
  'Vite',
];

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const { ref, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.05 });
  const prefersReducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement | null>(null);

  // Mouse Parallax Engine (desktop only with fine pointer)
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [isFinePointer, setIsFinePointer] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    setIsFinePointer(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsFinePointer(e.matches);
    };

    mediaQuery.addEventListener('change', handleMediaChange);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || !isFinePointer) return;

    let animationFrameId: number | null = null;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let isRunning = false;

    const loop = () => {
      if (document.hidden) {
        isRunning = false;
        animationFrameId = null;
        return;
      }

      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      const diffX = Math.abs(targetX - currentX);
      const diffY = Math.abs(targetY - currentY);

      if (diffX > 0.001 || diffY > 0.001) {
        setParallax({
          x: Math.round(currentX * 100) / 100,
          y: Math.round(currentY * 100) / 100,
        });
        animationFrameId = requestAnimationFrame(loop);
      } else {
        // Pointer is settled/idle; snap to target and pause rAF loop
        currentX = targetX;
        currentY = targetY;
        setParallax({
          x: Math.round(currentX * 100) / 100,
          y: Math.round(currentY * 100) / 100,
        });
        isRunning = false;
        animationFrameId = null;
      }
    };

    const startLoopIfNeeded = () => {
      if (!isRunning && !document.hidden) {
        isRunning = true;
        animationFrameId = requestAnimationFrame(loop);
      }
    };

    const handlePointerMove = (e: MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      targetX = (e.clientX - w / 2) / (w / 2);
      targetY = (e.clientY - h / 2) / (h / 2);
      startLoopIfNeeded();
    };

    const handlePointerLeave = () => {
      targetX = 0;
      targetY = 0;
      startLoopIfNeeded();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animationFrameId !== null) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
        isRunning = false;
      } else {
        // If there is still a difference between current and target when returning, resume
        if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
          startLoopIfNeeded();
        }
      }
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('mouseleave', handlePointerLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseleave', handlePointerLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [prefersReducedMotion, isFinePointer]);

  const handleCtaClick = (href: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(href);
    } else {
      const targetId = href.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    }
  };

  const px = isFinePointer && !prefersReducedMotion ? parallax.x : 0;
  const py = isFinePointer && !prefersReducedMotion ? parallax.y : 0;

  return (
    <section
      id="home"
      ref={(node) => {
        heroRef.current = node;
        if (ref && 'current' in ref) {
          (ref as React.MutableRefObject<HTMLElement | null>).current = node;
        }
      }}
      className="relative min-h-[96vh] flex flex-col justify-between pt-28 pb-12 sm:pb-16 lg:pt-36 lg:pb-16 overflow-hidden bg-white"
      aria-label="Introduction"
    >
      {/* Layer 1: Subtle Developer Coding Video in background */}
      <HeroVideoBackground />

      {/* Layer 2: 3D Image Artwork provided by user with subtle cinematic drift & mouse parallax */}
      <div 
        className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none transition-transform duration-500 ease-out"
        style={{
          transform: px !== 0 || py !== 0 ? `translate3d(${px * 3.5}px, ${py * 3.5}px, 0)` : undefined,
        }}
        aria-hidden="true"
      >
        <img 
          src={hero3dBg} 
          alt="3D Developer Artwork" 
          className={`w-full h-full object-cover object-right md:object-[80%_center] opacity-60 sm:opacity-70 lg:opacity-80 filter contrast-105 saturate-105 ${
            !prefersReducedMotion ? 'animate-bg-cinematic' : ''
          }`}
        />
        {/* Soft gradient masks ensuring left editorial typography has pristine legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/20 md:to-transparent w-full md:w-3/5" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/40" />
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-white to-transparent" />
      </div>

      {/* Layer 3: Very Light Blue Radial Depth & Atmospheric Glow with slow breathing motion */}
      <div 
        className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] lg:w-[1000px] lg:h-[1000px] bg-gradient-to-tr from-blue-500/[0.05] via-sky-400/[0.06] to-amber-400/[0.02] rounded-full blur-[140px] pointer-events-none transition-transform duration-700 ease-out ${
          !prefersReducedMotion ? 'animate-glow-breathe' : ''
        }`}
        style={{
          transform: `translate3d(calc(-50% + ${px * 6}px), calc(-50% + ${py * 6}px), 0)`,
        }}
        aria-hidden="true" 
      />

      {/* Layer 4: Faint Technical Grid Background with subtle drift */}
      <div 
        className={`absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none ${
          !prefersReducedMotion ? 'animate-grid-drift' : ''
        }`} 
        aria-hidden="true" 
      />

      {/* Main Hero Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT COLUMN: Large Editorial Typography & Staggered Entrance Sequence */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* 1. Small Technical Eyebrow (Entrance step 1) */}
            <div 
              className={!prefersReducedMotion && isVisible ? 'animate-hero-fade-up' : ''}
              style={{ animationDelay: '0ms', animationFillMode: 'both' }}
            >
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-50/90 border border-slate-200/90 shadow-sm text-xs font-mono text-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)] animate-pulse" aria-hidden="true" />
                <span className="tracking-widest uppercase font-semibold text-slate-900">WEB DEVELOPER</span>
                <span className="text-slate-300">•</span>
                <span className="text-blue-600 font-semibold tracking-wide">SAMEERDEV</span>
              </div>
            </div>

            {/* 2. Large Editorial Headline (Entrance step 2, clean reveal, no typewriter) */}
            <div 
              className={`space-y-2 ${!prefersReducedMotion && isVisible ? 'animate-hero-heading' : ''}`}
              style={{ animationDelay: '100ms', animationFillMode: 'both' }}
            >
              <h1 className="text-[42px] leading-[1.08] sm:text-6xl md:text-7xl lg:text-[76px] xl:text-[84px] font-black text-slate-950 tracking-[-0.035em]">
                <span className="block">I Build Modern</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700">
                  Digital Experiences
                </span>
              </h1>
            </div>

            {/* 3. Concise Professional Supporting Statement (Entrance step 3) */}
            <div
              className={!prefersReducedMotion && isVisible ? 'animate-hero-fade-up' : ''}
              style={{ animationDelay: '200ms', animationFillMode: 'both' }}
            >
              <p className="text-base sm:text-lg md:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl">
                I create modern, responsive and high-performance websites and web applications for businesses, creators and individuals. Focused on clean engineering and intuitive user experience.
              </p>
            </div>

            {/* 4. Action CTAs with Premium Microinteractions (Entrance step 4) */}
            <div 
              className={`flex flex-wrap items-center gap-3.5 pt-1 ${
                !prefersReducedMotion && isVisible ? 'animate-hero-fade-up' : ''
              }`}
              style={{ animationDelay: '300ms', animationFillMode: 'both' }}
            >
              <a
                href="#projects"
                onClick={(e) => handleCtaClick('#projects', e)}
                className="group btn-micro-fx inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 sm:py-4 text-sm sm:text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-xl shadow-blue-600/25 hover:shadow-blue-600/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                <span>View My Work</span>
                <ArrowDown className="w-4 h-4 transition-transform duration-200 group-hover:translate-y-1" />
              </a>

              <a
                href="#demos"
                onClick={(e) => handleCtaClick('#demos', e)}
                className="group btn-micro-fx inline-flex items-center justify-center gap-2 px-5 py-3.5 sm:py-4 text-sm sm:text-base font-semibold text-blue-700 bg-blue-50/90 hover:bg-blue-100/90 border border-blue-200/90 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Test Live Demos</span>
              </a>

              <a
                href="#contact"
                onClick={(e) => handleCtaClick('#contact', e)}
                className="group btn-micro-fx inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 sm:py-4 text-sm sm:text-base font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                <span>Let's Work Together</span>
                <ArrowUpRight className="w-4 h-4 text-blue-600 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
              </a>
            </div>

            {/* 5. Hero Trust Strip (Entrance step 5) */}
            <div 
              className={`pt-4 border-t border-slate-200/70 ${
                !prefersReducedMotion && isVisible ? 'animate-hero-fade-up' : ''
              }`}
              style={{ animationDelay: '400ms', animationFillMode: 'both' }}
            >
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mr-1">
                  Core Stack:
                </span>
                {TRUST_SKILLS.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-3 py-1 rounded-lg bg-white border border-slate-200/80 shadow-sm text-xs font-medium text-slate-700 hover:border-blue-300 hover:text-blue-600 hover:-translate-y-0.5 transition-all duration-150"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Large 3D Developer Portrait Centerpiece (lg:col-span-5) */}
          <div 
            className={`lg:col-span-5 relative flex justify-center lg:justify-end transition-all duration-700 delay-200 ease-out ${
              prefersReducedMotion || isVisible
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-8 scale-95'
            }`}
          >
            {/* 3D Image Ambient Backdrop behind portrait */}
            <div 
              className="absolute -inset-8 -z-10 rounded-full overflow-hidden opacity-30 blur-lg pointer-events-none hidden sm:block transition-transform duration-500 ease-out"
              style={{
                transform: px !== 0 || py !== 0 ? `translate3d(${px * 4}px, ${py * 4}px, 0)` : undefined,
              }}
              aria-hidden="true"
            >
              <img 
                src={hero3dBg} 
                alt="" 
                className="w-full h-full object-cover rounded-full scale-105"
              />
            </div>
            <DeveloperPortrait3D 
              parallax={parallax}
              isFinePointer={isFinePointer}
            />
          </div>

        </div>
      </div>

      {/* Bottom Minimal Scroll Indicator with Gentle Pulse (No Aggressive Bounce) */}
      <div className="w-full flex justify-center pt-8 relative z-10">
        <a
          href="#about"
          onClick={(e) => handleCtaClick('#about', e)}
          className="group inline-flex flex-col items-center gap-1.5 text-[11px] font-mono tracking-widest uppercase text-slate-400 hover:text-blue-600 transition-colors"
          aria-label="Scroll to explore"
        >
          <span>SCROLL TO EXPLORE</span>
          <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors ${
            !prefersReducedMotion ? 'animate-scroll-pulse' : ''
          }`} />
        </a>
      </div>
    </section>
  );
};
