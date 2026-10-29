import React from 'react';
import { 
  Globe, 
  Smartphone, 
  Code2, 
  Briefcase, 
  Layers, 
  Wrench, 
  ShieldCheck,
  ArrowUpRight
} from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface ServiceItem {
  number: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const ServicesSection: React.FC = () => {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });
  const prefersReducedMotion = useReducedMotion();

  const services: ServiceItem[] = [
    {
      number: '01',
      title: 'Website Development',
      description: 'Modern websites built for businesses, creators and individuals.',
      icon: Globe,
    },
    {
      number: '02',
      title: 'Responsive Website Design',
      description: 'Interfaces that work smoothly across desktop, tablet and mobile.',
      icon: Smartphone,
    },
    {
      number: '03',
      title: 'Web Application Development',
      description: 'Interactive web applications with modern user experiences.',
      icon: Code2,
    },
    {
      number: '04',
      title: 'Business Websites',
      description: 'Professional websites designed to establish a strong online presence.',
      icon: Briefcase,
    },
    {
      number: '05',
      title: 'UI Implementation',
      description: 'Converting designs and ideas into polished responsive interfaces.',
      icon: Layers,
    },
    {
      number: '06',
      title: 'Website Bug Fixing & Improvements',
      description: 'Fixing issues and improving existing website experiences.',
      icon: Wrench,
    },
    {
      number: '07',
      title: 'Website Maintenance',
      description: 'Ongoing updates, improvements and maintenance.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section
      id="services"
      ref={ref}
      className="scroll-mt-20 py-28 px-4 sm:px-6 lg:px-8 bg-[#EFF6FF]/60 border-t border-slate-200/80 relative overflow-hidden"
      aria-label="Services offered by Sameer"
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
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-blue-200/70">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-blue-600 font-semibold tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" aria-hidden="true" />
                <span>02 / SERVICES OFFERED</span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-[-0.03em]">
                Crafted <span className="text-blue-600">Services</span>
              </h2>
            </div>
            <p className="text-sm font-mono text-slate-500 max-w-sm">
              End-to-end frontend development, interface architecture, and high-performance engineering tailored to your requirements.
            </p>
          </div>

          {/* Numbered Editorial Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service, idx) => {
              const Icon = service.icon;
              // If it's the 7th item (idx === 6), make it span 2 columns on lg or highlight
              const isFeatured = idx === 6;

              return (
                <div
                  key={service.title}
                  style={{
                    transitionDelay: prefersReducedMotion ? '0ms' : `${idx * 60}ms`,
                  }}
                  className={`group relative p-7 rounded-3xl bg-white border border-slate-200/90 hover:border-blue-400 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between ${
                    isFeatured ? 'md:col-span-2 lg:col-span-3 lg:flex-row lg:items-center' : ''
                  }`}
                >
                  <div className={`space-y-4 ${isFeatured ? 'lg:flex lg:items-center lg:gap-6 lg:space-y-0' : ''}`}>
                    {/* Header: Number & Icon */}
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-mono font-bold text-blue-600/90 tracking-tight">
                        {service.number}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-slate-950 tracking-tight group-hover:text-blue-600 transition-colors flex items-center gap-2">
                        <span>{service.title}</span>
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed font-normal max-w-xl">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  <div className={`mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-400 group-hover:text-blue-600 transition-colors ${
                    isFeatured ? 'lg:mt-0 lg:pt-0 lg:border-t-0' : ''
                  }`}>
                    <span>Available For Hire</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
