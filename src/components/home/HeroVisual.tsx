import React from 'react';
import { Terminal, Sparkles, Layers, ShieldCheck, Cpu } from 'lucide-react';

export const HeroVisual: React.FC = () => {
  return (
    <div className="relative w-full max-w-lg lg:max-w-none mx-auto">
      {/* Background ambient glow behind visual */}
      <div 
        className="absolute -inset-4 bg-gradient-to-tr from-blue-500/10 via-sky-400/10 to-amber-500/10 rounded-3xl blur-2xl opacity-70 animate-pulse-glow"
        aria-hidden="true" 
      />

      {/* Main Code Frame (Clean White Surface) */}
      <div className="relative rounded-2xl bg-white/95 backdrop-blur-md shadow-xl shadow-slate-200/70 overflow-hidden border border-slate-200 transition-all duration-300 hover:border-blue-300 hover:shadow-blue-500/10">
        
        {/* Editor Title Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50/95 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
            <span className="w-3 h-3 rounded-full bg-sky-400 inline-block" />
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-700 font-medium">
            <Terminal className="w-3.5 h-3.5 text-blue-600" />
            <span>ModernApp.tsx</span>
          </div>
          <div className="w-12 text-right">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          </div>
        </div>

        {/* Code Body */}
        <div className="p-5 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto text-slate-800 bg-white">
          <div className="flex gap-4">
            {/* Line numbers */}
            <div className="select-none text-slate-400 text-right pr-2 border-r border-slate-200 space-y-1">
              <div>01</div>
              <div>02</div>
              <div>03</div>
              <div>04</div>
              <div>05</div>
              <div>06</div>
              <div>07</div>
              <div>08</div>
              <div>09</div>
              <div>10</div>
            </div>

            {/* Code lines */}
            <div className="space-y-1 flex-1">
              <div>
                <span className="text-blue-600 font-semibold">interface</span>{' '}
                <span className="text-slate-900 font-semibold">ProductionBuild</span>{' '}
                <span className="text-slate-500">{'{'}</span>
              </div>
              <div className="pl-4">
                <span className="text-slate-700">stack</span>
                <span className="text-slate-400">:</span>{' '}
                <span className="text-blue-700">['React', 'TypeScript', 'Tailwind']</span>
                <span className="text-slate-400">;</span>
              </div>
              <div className="pl-4">
                <span className="text-slate-700">performance</span>
                <span className="text-slate-400">:</span>{' '}
                <span className="text-emerald-700">'Sub-second Core Web Vitals'</span>
                <span className="text-slate-400">;</span>
              </div>
              <div className="pl-4">
                <span className="text-slate-700">responsive</span>
                <span className="text-slate-400">:</span>{' '}
                <span className="text-amber-600 font-semibold">true</span>
                <span className="text-slate-400">;</span>
              </div>
              <div>
                <span className="text-slate-500">{'}'}</span>
              </div>
              <div>&nbsp;</div>
              <div>
                <span className="text-blue-600 font-semibold">export const</span>{' '}
                <span className="text-slate-900 font-semibold">engineerProject</span>{' '}
                <span className="text-slate-500">=</span>{' '}
                <span className="text-blue-600 font-semibold">async</span>{' '}
                <span className="text-slate-500">() =&gt; {'{'}</span>
              </div>
              <div className="pl-4">
                <span className="text-blue-600 font-semibold">return</span>{' '}
                <span className="text-blue-700">deploy</span>
                <span className="text-slate-500">({'{'}</span>{' '}
                <span className="text-slate-700">quality</span>
                <span className="text-slate-400">:</span>{' '}
                <span className="text-emerald-700">'Flawless'</span>{' '}
                <span className="text-slate-500">{'}'})</span>
                <span className="text-slate-400">;</span>
              </div>
              <div>
                <span className="text-slate-500">{'}'};</span>
              </div>
              <div className="flex items-center text-slate-500">
                <span className="text-blue-600 pr-1">// Ready for production</span>
                <span className="inline-block w-2 h-4 bg-blue-600 ml-1 animate-cursor" />
              </div>
            </div>
          </div>
        </div>

        {/* Status / Output Footer */}
        <div className="px-5 py-3 bg-slate-50/95 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span className="text-slate-800 font-medium">Type Checked</span>
            <span className="text-slate-300">·</span>
            <span className="text-amber-600 font-medium">Zero Errors</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <Cpu className="w-3.5 h-3.5 text-blue-600" />
            <span>Vite Ready</span>
          </div>
        </div>
      </div>

      {/* Floating Auxiliary Accent Card */}
      <div 
        className="absolute -bottom-6 -left-6 sm:-bottom-8 sm:-left-8 hidden sm:flex items-center gap-3 p-3.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl shadow-slate-200/70 animate-float"
      >
        <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs font-semibold text-slate-900">Full-Stack Architecture</div>
          <div className="text-[11px] text-slate-500">Clean &amp; Scalable Codebase</div>
        </div>
      </div>

      {/* Floating Performance Indicator */}
      <div 
        className="absolute -top-4 -right-4 hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/95 backdrop-blur-md border border-amber-200 shadow-lg shadow-amber-500/10"
      >
        <Sparkles className="w-4 h-4 text-amber-500" />
        <span className="text-xs font-semibold text-amber-900">100% Responsive</span>
      </div>
    </div>
  );
};
