import React from 'react';
import { 
  Atom, 
  FileCode2, 
  FileJson, 
  Code, 
  Palette, 
  Wind, 
  Zap,
  CheckCircle2
} from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface TechItem {
  name: string;
  category: string;
  version?: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  size: 'lg' | 'md' | 'sm';
}

export const SkillsSection: React.FC = () => {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });
  const prefersReducedMotion = useReducedMotion();

  const technologies: TechItem[] = [
    {
      name: 'React',
      category: 'Frontend Library',
      description: 'Declarative component architecture, custom hooks, context state management, and modern React 19 paradigms.',
      icon: Atom,
      accentColor: '#38bdf8',
      size: 'lg',
    },
    {
      name: 'TypeScript',
      category: 'Static Typing',
      description: 'Strict type safety, custom generic constraints, union types, and robust enterprise interface contracts.',
      icon: FileCode2,
      accentColor: '#2563eb',
      size: 'lg',
    },
    {
      name: 'JavaScript',
      category: 'Core Language',
      description: 'ES6+ standards, asynchronous promises, async/await pipelines, and performant DOM manipulation.',
      icon: FileJson,
      accentColor: '#f59e0b',
      size: 'md',
    },
    {
      name: 'Tailwind CSS',
      category: 'Design Systems',
      description: 'Modern utility styling, responsive fluid breakpoints, custom design tokens, and optimized CSS bundles.',
      icon: Wind,
      accentColor: '#06b6d4',
      size: 'lg',
    },
    {
      name: 'HTML5',
      category: 'Markup & Semantics',
      description: 'Semantic document tree, ARIA accessibility landmarks, SEO metadata standards, and responsive media tags.',
      icon: Code,
      accentColor: '#ea580c',
      size: 'md',
    },
    {
      name: 'CSS3',
      category: 'Styling & Animation',
      description: 'Modern CSS Grid, Flexbox layouts, smooth transitions, custom properties, and responsive media queries.',
      icon: Palette,
      accentColor: '#3b82f6',
      size: 'md',
    },
    {
      name: 'Vite',
      category: 'Build Tooling',
      description: 'Next-gen lightning HMR development server, optimized ESbuild bundling, and zero-overhead deployments.',
      icon: Zap,
      accentColor: '#8b5cf6',
      size: 'sm',
    },
  ];

  return (
    <section
      id="skills"
      ref={ref}
      className="scroll-mt-20 py-28 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-200/80 relative overflow-hidden"
      aria-label="Technical Skills and Stack"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div 
          className={`space-y-14 transition-all duration-700 ease-out ${
            prefersReducedMotion || isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-6'
          }`}
        >
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-slate-200/80">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-blue-600 font-semibold tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" aria-hidden="true" />
                <span>03 / TECHNICAL STACK</span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-[-0.03em]">
                Technologies &amp; <span className="text-blue-600">Skills</span>
              </h2>
            </div>
            <p className="text-sm font-mono text-slate-500 max-w-sm">
              Modern frontend toolchain focused on clean code, type safety, and fast production rendering.
            </p>
          </div>

          {/* Editorial Technology Wall */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
            {technologies.map((tech, idx) => {
              const Icon = tech.icon;
              const isLarge = tech.size === 'lg';
              const colSpan = isLarge ? 'lg:col-span-6' : 'lg:col-span-4';

              return (
                <div
                  key={tech.name}
                  style={{
                    transitionDelay: prefersReducedMotion ? '0ms' : `${idx * 60}ms`,
                  }}
                  className={`group relative p-7 rounded-3xl bg-slate-50/70 hover:bg-white border border-slate-200/90 hover:border-blue-300 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 ${colSpan} flex flex-col justify-between`}
                >
                  {/* Subtle top indicator */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-800 group-hover:scale-110 group-hover:border-blue-300 group-hover:text-blue-600 transition-all duration-300">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono font-medium text-slate-500">
                        {tech.category}
                      </span>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 opacity-80" />
                  </div>

                  {/* Main Title Typography */}
                  <div className="space-y-2 my-2">
                    <h3 className={`${isLarge ? 'text-3xl' : 'text-2xl'} font-bold text-slate-950 tracking-tight group-hover:text-blue-600 transition-colors`}>
                      {tech.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {tech.description}
                    </p>
                  </div>

                  {/* Bottom Accent Line */}
                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Production Grade</span>
                    <span className="w-2 h-2 rounded-full bg-blue-500/40 group-hover:bg-blue-600 group-hover:scale-125 transition-all" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
