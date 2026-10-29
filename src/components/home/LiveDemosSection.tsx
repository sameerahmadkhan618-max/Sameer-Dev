import React, { useState } from 'react';
import { 
  Play, ShoppingBag, Sliders, Kanban, Sparkles, ArrowUpRight, 
  CheckCircle2, Laptop, ChevronRight, Zap 
} from 'lucide-react';
import { DEMO_WEBSITES, DemoWebsite } from '../demos/demoData';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface LiveDemosSectionProps {
  onLaunchDemo: (demoId: string) => void;
}

export const LiveDemosSection: React.FC<LiveDemosSectionProps> = ({ onLaunchDemo }) => {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.08 });
  const prefersReducedMotion = useReducedMotion();
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const filteredDemos = DEMO_WEBSITES.filter(
    (d) => activeFilter === 'All' || d.category === activeFilter
  );

  return (
    <section
      id="demos"
      ref={ref}
      className="scroll-mt-20 py-28 px-4 sm:px-6 lg:px-8 bg-slate-50/70 border-t border-slate-200/80 relative overflow-hidden"
      aria-label="Interactive Client Demos"
    >
      {/* Subtle Background Mesh Accent */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40 -z-10"
        style={{
          backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto relative z-10 space-y-14">
        {/* Section Header */}
        <div 
          className={`transition-all duration-700 ease-out ${
            prefersReducedMotion || isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-200">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-blue-600 font-semibold tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" aria-hidden="true" />
                <span>INTERACTIVE SHOWCASE</span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-[-0.03em]">
                Live <span className="text-blue-600">Demos</span>
              </h2>
            </div>
            <p className="text-sm font-mono text-slate-600 max-w-md leading-relaxed">
              Test real, functional applications built from scratch. Experience state management, 60FPS canvas game loops, e-commerce checkouts, and client-side utilities directly in your browser.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {['All', 'AI Tool', 'Game', 'E-Commerce', 'Utility', 'SaaS'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeFilter === cat
                    ? 'bg-slate-950 text-white shadow-md shadow-slate-950/20 scale-[1.02]'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat === 'All' ? `All Live Demos (${DEMO_WEBSITES.length})` : cat}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Rich Showcase Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredDemos.map((demo, idx) => {
            const isGame = demo.category === 'Game';
            const isEcommerce = demo.category === 'E-Commerce';
            const isUtility = demo.category === 'Utility';
            const isSaas = demo.category === 'SaaS';

            return (
              <div
                key={demo.id}
                style={{
                  transitionDelay: prefersReducedMotion ? '0ms' : `${idx * 80}ms`,
                }}
                className={`group bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden ${
                  prefersReducedMotion || isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-6'
                }`}
              >
                {/* Visual Screenshot / Simulation Header */}
                <div className="relative h-64 bg-slate-950 flex flex-col justify-between overflow-hidden group/thumb cursor-pointer"
                     onClick={() => onLaunchDemo(demo.id)}>
                  {/* Screenshot Image Background */}
                  <img
                    src={demo.previewImage}
                    alt={`${demo.title} UI Screenshot`}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* High-end gradient vignette for contrast and readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-slate-950/70 pointer-events-none" />

                  {/* Subtle hover color glow */}
                  <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {/* Top Bar inside Card */}
                  <div className="relative z-10 flex items-center justify-between p-5">
                    <span className="text-[11px] font-mono uppercase tracking-wider font-bold px-2.5 py-1 rounded bg-slate-900/80 text-sky-300 border border-slate-700/60 backdrop-blur-md shadow-xs">
                      {demo.badge}
                    </span>

                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono bg-slate-950/80 px-2.5 py-1 rounded-full border border-emerald-500/30 backdrop-blur-md">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                      <span>Ready to Test</span>
                    </div>
                  </div>

                  {/* Middle Center Floating 'Play / Test Demo' overlay button on hover */}
                  <div className="relative z-10 flex items-center justify-center pointer-events-none">
                    <div className="opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-300 px-4 py-2 rounded-xl bg-blue-600/90 text-white font-mono text-xs font-bold tracking-wide shadow-xl shadow-blue-500/25 backdrop-blur-md flex items-center gap-2 border border-blue-400/40">
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Launch Interactive Demo</span>
                    </div>
                  </div>

                  {/* Floating Action Hint at bottom */}
                  <div className="relative z-10 flex items-center justify-between text-xs text-slate-200 px-5 py-3 border-t border-slate-800/80 bg-slate-950/60 backdrop-blur-md">
                    <span className="font-mono text-[11px] text-slate-300 truncate max-w-[220px] sm:max-w-xs">{demo.tagline}</span>
                    <span className="text-sky-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform shrink-0">
                      <span>Launch Sandbox</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                {/* Card Content & Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-blue-600 uppercase">
                        {demo.category}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500 font-mono">100% Functional</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight group-hover:text-blue-600 transition-colors">
                      {demo.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {demo.description}
                    </p>

                    {/* Highlights bullets */}
                    <div className="pt-2 space-y-1.5">
                      {demo.highlights.slice(0, 3).map((h, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom CTA & Tech Stack */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div className="flex flex-wrap gap-1.5">
                      {demo.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => onLaunchDemo(demo.id)}
                      className="w-full py-3 px-4 bg-slate-900 hover:bg-blue-600 text-white font-bold rounded-xl text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-slate-900/10 hover:shadow-blue-600/20 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Launch Interactive Demo Sandbox</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Client Guarantee Callout */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-sky-200 font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>CUSTOM WEB DEVELOPMENT</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              Need a Custom Game, E-Commerce Store, or Web Utility?
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl leading-relaxed">
              Every demo above was built specifically by Sameer with production standards, responsive viewports, and clean code. Ready to start your project?
            </p>
          </div>

          <a
            href="#contact"
            className="px-6 py-3.5 rounded-xl bg-white text-blue-900 hover:bg-sky-50 font-bold text-xs sm:text-sm shadow-lg transition-all hover:scale-105 active:scale-95 shrink-0 flex items-center gap-2"
          >
            <span>Start Your Website</span>
            <ChevronRight className="w-4 h-4 text-blue-600" />
          </a>
        </div>
      </div>
    </section>
  );
};
