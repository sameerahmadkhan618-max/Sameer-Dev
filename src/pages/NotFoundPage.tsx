import React from 'react';
import { Compass, ArrowLeft, Home, Sparkles } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (href: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-blue-500/20 selection:text-blue-900">
      {/* Background ambient lighting */}
      <div 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-blue-500/[0.06] via-sky-400/[0.04] to-transparent rounded-full blur-[140px] pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="w-full max-w-lg p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/90 text-center space-y-8 shadow-2xl shadow-slate-200/70 relative z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 shadow-inner">
          <Compass className="w-10 h-10 text-blue-600 animate-pulse" aria-hidden="true" />
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-mono font-semibold uppercase tracking-wider border border-blue-200/60">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>404 &bull; Page Not Found</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
            Lost in Cyberspace?
          </h1>
          
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-sm mx-auto">
            The page you requested doesn't exist or has moved. Let's get you back to the main portfolio.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl btn-micro-fx shadow-lg shadow-blue-600/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to Portfolio</span>
          </button>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors border border-slate-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};
