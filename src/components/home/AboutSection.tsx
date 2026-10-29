import React from 'react';
import { Code2, Smartphone, Users } from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export const AboutSection: React.FC = () => {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });
  const prefersReducedMotion = useReducedMotion();

  const principles = [
    {
      title: 'Clean Code',
      tagline: 'Maintainable & Scalable',
      description: 'Writing structured, strictly typed, and self-documenting code built for longevity and performance.',
      icon: Code2,
    },
    {
      title: 'Responsive Design',
      tagline: 'Device-Agnostic Layouts',
      description: 'Crafting fluid visual layouts that adapt seamlessly across mobile screens, tablets, and high-resolution monitors.',
      icon: Smartphone,
    },
    {
      title: 'User Focused',
      tagline: 'Intuitive & Accessible',
      description: 'Building purposeful micro-interactions and clear visual hierarchy where user intent leads the experience.',
      icon: Users,
    },
  ];

  return (
    <section
      id="about"
      ref={ref}
      className="scroll-mt-20 py-28 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] border-t border-slate-200/80 relative overflow-hidden"
      aria-label="About Sameer"
    >
      {/* Subtle Atmospheric Light Accent */}
      <div 
        className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/[0.03] rounded-full blur-[140px] pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div 
          className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start transition-all duration-700 ease-out ${
            prefersReducedMotion || isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-6'
          }`}
        >
          {/* LEFT: Editorial Heading & Section Tag */}
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-blue-600 font-semibold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" aria-hidden="true" />
              <span>01 / ABOUT ME</span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-[-0.03em] leading-[1.08]">
              About <span className="text-blue-600">Sameer</span>
            </h2>

            <p className="text-sm font-mono text-slate-500 tracking-wide uppercase pt-2">
              Web Developer • Creative Frontend Specialist
            </p>
          </div>

          {/* RIGHT: Professional Text & 3 Principle Cards */}
          <div className="lg:col-span-7 space-y-10">
            <div className="space-y-5 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              <p>
                I am Sameer, a dedicated web developer who engineers modern, responsive, and robust digital web applications. I bridge the gap between creative visual design and rock-solid technical implementation.
              </p>
              <p>
                My philosophy is grounded in creating interfaces that feel effortless to navigate, render instantly, and look remarkable on any display. Every project is crafted with modern industry standards and attention to craft.
              </p>
            </div>

            {/* 3 Small Principle Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {principles.map((p, idx) => {
                const Icon = p.icon;
                return (
                  <div
                    key={p.title}
                    style={{
                      transitionDelay: prefersReducedMotion ? '0ms' : `${idx * 90}ms`,
                    }}
                    className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 space-y-3"
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                        {p.title}
                      </h3>
                      <p className="text-[11px] font-mono text-blue-600 font-medium">
                        {p.tagline}
                      </p>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {p.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
