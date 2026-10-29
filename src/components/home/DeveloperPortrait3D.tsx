import React, { useState, useRef, useCallback } from 'react';
import { Sparkles, CheckCircle2, Atom, FileCode2, Code2, Layout } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import heroSecondImg from '../../assets/images/hero_second_img.jpg';
import hero3dBg from '../../assets/images/hero_3d_bg.jpg';
import DitherVeil from './DitherVeil';

interface DeveloperPortrait3DProps {
  className?: string;
  parallax?: { x: number; y: number };
  isFinePointer?: boolean;
}

export const DeveloperPortrait3D: React.FC<DeveloperPortrait3DProps> = ({ 
  className = '',
  parallax = { x: 0, y: 0 },
  isFinePointer = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Subtle restrained tilt (max 4.5 degrees, smooth interpolation)
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !isFinePointer || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Apple-level restraint: 4.5 degrees max
    const rotateX = ((y - centerY) / centerY) * -4.5;
    const rotateY = ((x - centerX) / centerX) * 4.5;
    setRotate({ x: rotateX, y: rotateY });
  }, [prefersReducedMotion, isFinePointer]);

  const handleMouseEnter = () => {
    if (!prefersReducedMotion && isFinePointer) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  const px = isFinePointer && !prefersReducedMotion ? parallax.x : 0;
  const py = isFinePointer && !prefersReducedMotion ? parallax.y : 0;

  return (
    <div 
      className={`relative select-none flex items-center justify-center ${className} ${
        !prefersReducedMotion ? 'animate-portrait-float' : ''
      }`}
      style={{ perspective: '1200px' }}
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label="Sameer - Developer Portrait Showcase"
    >
      {/* Layer 1: Atmospheric 3D Blue & Cyan Ambient Glow with breathing animation */}
      <div 
        className={`absolute -inset-10 rounded-full bg-gradient-to-tr from-blue-600/20 via-sky-400/25 to-amber-300/15 blur-3xl pointer-events-none transition-transform duration-700 ${
          !prefersReducedMotion ? 'animate-glow-breathe' : ''
        }`}
        style={{
          transform: `translate3d(${px * 6}px, ${py * 6}px, 0)`,
          opacity: prefersReducedMotion ? 0.6 : isHovered ? 0.85 : 0.65,
        }}
        aria-hidden="true"
      />

      {/* Layer 2: Subtle 3D background artwork glow behind portrait */}
      <div 
        className="absolute -inset-6 rounded-[36px] overflow-hidden opacity-30 blur-xl pointer-events-none hidden sm:block transition-transform duration-500 ease-out"
        style={{
          transform: `translate3d(${px * 4}px, ${py * 4}px, 0)`,
        }}
        aria-hidden="true"
      >
        <img 
          src={hero3dBg} 
          alt="" 
          className="w-full h-full object-cover scale-110"
        />
      </div>

      {/* Layer 3: Subtle Geometric Technical Orbit Rings */}
      <div 
        className="absolute -inset-8 rounded-full border border-blue-200/50 border-dashed pointer-events-none transition-transform duration-700 ease-out hidden sm:block"
        style={{
          transform: prefersReducedMotion 
            ? 'none' 
            : `translate3d(${px * 3}px, ${py * 3}px, 0) rotate(${isHovered ? 12 : 0}deg) scale(${isHovered ? 1.02 : 1})`,
        }}
        aria-hidden="true"
      />
      <div 
        className="absolute -inset-16 rounded-full border border-slate-200/50 pointer-events-none hidden md:block" 
        aria-hidden="true" 
      />

      {/* Centerpiece 3D Card Container */}
      <div
        className="relative w-72 h-[440px] sm:w-80 sm:h-[490px] md:w-[350px] md:h-[530px] lg:w-[370px] lg:h-[560px] rounded-[32px] p-2 sm:p-2.5 bg-gradient-to-b from-white via-slate-50 to-blue-50/70 border border-slate-200/90 shadow-2xl shadow-blue-500/15 transition-all duration-300 ease-out will-change-transform"
        style={{
          transformStyle: 'preserve-3d',
          transform: prefersReducedMotion
            ? 'none'
            : isHovered
            ? `translate3d(${px * 9}px, ${py * 9}px, 0) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(1.015)`
            : `translate3d(${px * 9}px, ${py * 9}px, 0) rotateX(0deg) rotateY(0deg) scale(1)`,
        }}
      >
        {/* Soft White Cutout Frame with Clean Depth */}
        <div 
          className="relative w-full h-full rounded-[26px] overflow-hidden bg-slate-950 shadow-inner flex items-center justify-center border border-slate-100"
          style={{ transform: prefersReducedMotion ? 'none' : 'translateZ(20px)' }}
        >
          <div style={{ width: '100%', height: '100%', minHeight: '340px', position: 'relative' }} className="w-full h-full">
            <DitherVeil
              src="https://images.unsplash.com/photo-1737071371043-761e02b1ef95?q=80&w=1400&auto=format&fit=crop"
              pattern="floyd"
              pixelSize={2}
              inkColor="#120f17"
              paperColor="#f4f1ea"
              revealRadius={200}
              softness={0.6}
              linger={1}
              fit="contain"
              rimColor="#a78bfa"
              palette="duotone"
              levels={2}
              contrast={1.15}
              brightness={0}
              rim={0}
              reverse={false}
              wander={false}
              clickBurst
            />
          </div>

          {/* Subtitle Bar at bottom of portrait */}
          <div className="absolute bottom-3 inset-x-3 px-3 py-2 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md flex items-center justify-between pointer-events-none z-10">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.7)] animate-pulse" />
              <span className="text-xs font-semibold text-slate-800 tracking-tight">Sameer</span>
            </div>
            <span className="text-[11px] font-mono text-blue-600 font-medium">Interactive Dither</span>
          </div>
        </div>

        {/* Floating Label 1: React (Top-Right) */}
        <div 
          className={`absolute -top-3 -right-3 sm:-right-5 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-lg shadow-blue-500/10 flex items-center gap-1.5 transition-transform duration-300 ${
            !prefersReducedMotion ? 'animate-tech-float-1' : ''
          }`}
          style={{ 
            transform: prefersReducedMotion 
              ? 'none' 
              : `translate3d(${px * 12}px, ${py * 12}px, 40px)` 
          }}
        >
          <Atom className="w-3.5 h-3.5 text-sky-500" />
          <span className="text-xs font-semibold text-slate-800">React</span>
        </div>

        {/* Floating Label 2: TypeScript (Top-Left) */}
        <div 
          className={`absolute top-10 -left-4 sm:-left-6 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-lg shadow-blue-500/10 flex items-center gap-1.5 transition-transform duration-300 ${
            !prefersReducedMotion ? 'animate-tech-float-2' : ''
          }`}
          style={{ 
            transform: prefersReducedMotion 
              ? 'none' 
              : `translate3d(${px * 11}px, ${py * 11}px, 35px)` 
          }}
        >
          <FileCode2 className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-xs font-semibold text-slate-800">TypeScript</span>
        </div>

        {/* Floating Label 3: JavaScript (Bottom-Left) */}
        <div 
          className={`absolute bottom-16 -left-3 sm:-left-5 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-lg shadow-amber-500/10 flex items-center gap-1.5 transition-transform duration-300 ${
            !prefersReducedMotion ? 'animate-tech-float-3' : ''
          }`}
          style={{ 
            transform: prefersReducedMotion 
              ? 'none' 
              : `translate3d(${px * 10}px, ${py * 10}px, 30px)` 
          }}
        >
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-xs font-semibold text-slate-800">JavaScript</span>
        </div>

        {/* Floating Label 4: UI/UX (Bottom-Right) */}
        <div 
          className={`absolute bottom-20 -right-3 sm:-right-5 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-lg shadow-blue-500/10 flex items-center gap-1.5 transition-transform duration-300 ${
            !prefersReducedMotion ? 'animate-tech-float-4' : ''
          }`}
          style={{ 
            transform: prefersReducedMotion 
              ? 'none' 
              : `translate3d(${px * 11}px, ${py * 11}px, 35px)` 
          }}
        >
          <Layout className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-xs font-semibold text-slate-800">UI / UX</span>
        </div>

        {/* Verified Badge (Top edge accent) */}
        <div
          className="absolute -top-3.5 left-6 px-3 py-1 rounded-full bg-white border border-blue-200 shadow-md flex items-center gap-1.5 text-[11px] font-semibold text-slate-800 transition-transform duration-300"
          style={{ 
            transform: prefersReducedMotion 
              ? 'none' 
              : `translate3d(${px * 8}px, ${py * 8}px, 45px)` 
          }}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
          <span>Verified Pro</span>
        </div>

        {/* Amber Sparkle Accent */}
        <div 
          className="absolute -bottom-3 right-8 w-7 h-7 rounded-lg bg-amber-400 border border-amber-300 shadow-md shadow-amber-500/30 flex items-center justify-center text-slate-900 transition-transform duration-300"
          style={{ 
            transform: prefersReducedMotion 
              ? 'none' 
              : `translate3d(${px * 9}px, ${py * 9}px, 40px)` 
          }}
          aria-hidden="true"
        >
          <Sparkles className="w-4 h-4 text-slate-900" />
        </div>
      </div>
    </div>
  );
};
