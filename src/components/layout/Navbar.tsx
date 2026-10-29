import React, { useState, useEffect } from 'react';
import { NAV_ITEMS, PRIMARY_CTA } from '../../data/navigation';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface NavbarProps {
  onNavigate?: (href: string) => void;
  currentHash?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentHash = '' }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Mount trigger for smooth entrance slide-down
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setIsScrolled(currentScroll > 20);

      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const progress = Math.min(100, Math.max(0, (currentScroll / totalScroll) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleLinkClick = (href: string, e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        mounted || prefersReducedMotion ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      } ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-xl border-b border-slate-200/90 shadow-md shadow-slate-200/40 py-3'
          : 'bg-white/70 backdrop-blur-md border-b border-slate-200/40 py-4.5'
      }`}
    >
      {/* Ambient background soft light glow */}
      <div 
        className={`absolute inset-0 -z-10 bg-gradient-to-r from-blue-500/[0.03] via-sky-500/[0.04] to-amber-500/[0.02] transition-opacity duration-700 pointer-events-none ${
          isScrolled ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Zone 1: Brand Wordmark with Animated Pulsing Beacon */}
          <a
            href="#home"
            onClick={(e) => handleLinkClick('#home', e)}
            className="group flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg transition-transform duration-200 hover:scale-[1.02]"
            aria-label="SameerDev Home"
          >
            <span className="font-extrabold tracking-tight">
              Sameer<span className="text-blue-600 transition-colors duration-200 group-hover:text-blue-700">Dev</span>
            </span>

            {/* Glowing Radar Beacon */}
            <span className="relative flex h-2.5 w-2.5 ml-0.5" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
            </span>
          </a>

          {/* Zone 2: Desktop Navigation Links with Animated Floating Island / Pill */}
          <nav
            className="hidden md:flex items-center gap-1 p-1 rounded-2xl bg-slate-100/70 border border-slate-200/70 backdrop-blur-md relative"
            aria-label="Primary Navigation"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {NAV_ITEMS.map((item, index) => {
              const isActive = currentHash === item.href || (item.href === '#home' && !currentHash);
              const isHovered = hoveredIndex === index;

              return (
                <a
                  key={item.label}
                  href={item.href}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onClick={(e) => handleLinkClick(item.href, e)}
                  className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 z-10 ${
                    isActive
                      ? 'text-blue-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  {/* Floating Active Pill */}
                  {isActive && (
                    <span 
                      className="absolute inset-0 rounded-xl bg-white border border-slate-200/90 shadow-xs -z-10 transition-all duration-200" 
                      aria-hidden="true" 
                    />
                  )}

                  {/* Floating Hover Pill */}
                  {isHovered && !isActive && (
                    <span 
                      className="absolute inset-0 rounded-xl bg-slate-200/60 -z-10 transition-all duration-150 animate-in fade-in duration-150" 
                      aria-hidden="true" 
                    />
                  )}
                  
                  <span className="flex items-center gap-1.5">
                    {item.label}
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shadow-[0_0_6px_rgba(37,99,235,0.7)] animate-pulse" />
                    )}
                  </span>
                </a>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action CTA with Animated Light Sweep Shimmer */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href={PRIMARY_CTA.href}
              onClick={(e) => handleLinkClick(PRIMARY_CTA.href, e)}
              className="group relative inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl btn-micro-fx shadow-md shadow-blue-600/20 hover:shadow-blue-600/40 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 whitespace-nowrap"
            >
              {/* Shimmer light sweep animation */}
              <span 
                className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none animate-shimmer-sweep"
                aria-hidden="true" 
              />
              <span className="relative z-10">{PRIMARY_CTA.label}</span>
              <ArrowUpRight className="w-4 h-4 relative z-10 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2.5 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-menu"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Animated Scroll Progress Bar at the bottom edge of header */}
      <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-slate-200/40 overflow-hidden pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-blue-600 via-sky-400 to-amber-400 transition-all duration-150 ease-out shadow-[0_0_10px_rgba(56,189,248,0.8)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-menu"
          className="md:hidden fixed inset-x-0 top-[57px] bottom-0 bg-white/98 backdrop-blur-2xl border-t border-slate-200 z-40 px-6 py-8 flex flex-col justify-between overflow-y-auto animate-in fade-in slide-in-from-top-3 duration-250 shadow-2xl"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
          <nav className="flex flex-col space-y-2">
            {NAV_ITEMS.map((item, idx) => {
              const isActive = currentHash === item.href || (item.href === '#home' && !currentHash);
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleLinkClick(item.href, e)}
                  style={{ animationDelay: `${idx * 40}ms` }}
                  className={`text-base font-medium py-3 px-3.5 rounded-xl transition-all flex items-center justify-between ${
                    isActive
                      ? 'text-blue-600 bg-blue-50 font-semibold border border-blue-200 shadow-xs'
                      : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_6px_rgba(37,99,235,0.6)] animate-pulse" aria-hidden="true" />
                  )}
                </a>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-slate-200 mt-6">
            <a
              href={PRIMARY_CTA.href}
              onClick={(e) => handleLinkClick(PRIMARY_CTA.href, e)}
              className="group relative w-full flex items-center justify-center gap-2 px-6 py-3.5 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl btn-micro-fx shadow-lg shadow-blue-600/25 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none animate-shimmer-sweep" />
              <span className="relative z-10">{PRIMARY_CTA.label}</span>
              <ArrowUpRight className="w-4 h-4 relative z-10" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
