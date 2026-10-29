import React, { useState, useEffect } from 'react';
import { 
  X, Monitor, Tablet, Smartphone, Maximize2, Minimize2, Info, 
  ExternalLink, Sparkles, CheckCircle2, ChevronRight, Layers, Code2 
} from 'lucide-react';
import { DemoWebsite, DEMO_WEBSITES } from './demoData';
import { GameDemo } from './GameDemo';
import { EcommerceDemo } from './EcommerceDemo';
import { UtilityDemo } from './UtilityDemo';
import { SaasDemo } from './SaasDemo';
import { AiStudioDemo } from './AiStudioDemo';

interface DemoViewerModalProps {
  demoId: string | null;
  onClose: () => void;
  onSelectDemo: (id: string) => void;
}

export const DemoViewerModal: React.FC<DemoViewerModalProps> = ({
  demoId,
  onClose,
  onSelectDemo,
}) => {
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showInfoPanel, setShowInfoPanel] = useState<boolean>(false);

  const currentDemo = DEMO_WEBSITES.find((d) => d.id === demoId) || DEMO_WEBSITES[0];

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showInfoPanel) {
          setShowInfoPanel(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, showInfoPanel]);

  // Lock body scroll
  useEffect(() => {
    if (demoId) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [demoId]);

  if (!demoId) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col p-2 sm:p-4 lg:p-6 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-viewer-title"
    >
      {/* Modal Container */}
      <div className={`flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden w-full mx-auto transition-all duration-300 ${
        isFullscreen ? 'h-full max-w-none' : 'h-[94vh] max-w-7xl'
      }`}>
        {/* Top Control Bar */}
        <div className="bg-slate-950 border-b border-slate-800 px-4 py-3 flex items-center justify-between gap-4 shrink-0">
          {/* Left: Demo Title & Switcher Pills */}
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-none py-1">
            <div className="flex items-center gap-2 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h2 id="demo-viewer-title" className="text-white font-extrabold text-sm sm:text-base tracking-tight truncate">
                {currentDemo.title}
              </h2>
            </div>

            {/* Quick Demo Switcher Tabs */}
            <div className="hidden md:flex items-center gap-1.5 ml-2 pl-3 border-l border-slate-800">
              {DEMO_WEBSITES.map((d) => (
                <button
                  key={d.id}
                  onClick={() => onSelectDemo(d.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    d.id === currentDemo.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {d.category}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Device Viewport Switcher & Window Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Viewport Modes */}
            <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 p-0.5 rounded-lg">
              <button
                onClick={() => setViewportMode('desktop')}
                className={`p-1.5 rounded-md text-xs transition-colors ${
                  viewportMode === 'desktop' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Desktop View (100%)"
                aria-label="Desktop View"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewportMode('tablet')}
                className={`p-1.5 rounded-md text-xs transition-colors ${
                  viewportMode === 'tablet' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Tablet View (768px)"
                aria-label="Tablet View"
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewportMode('mobile')}
                className={`p-1.5 rounded-md text-xs transition-colors ${
                  viewportMode === 'mobile' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Mobile View (390px)"
                aria-label="Mobile View"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Info Drawer Toggle */}
            <button
              onClick={() => setShowInfoPanel(!showInfoPanel)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                showInfoPanel
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
              title="Client Architecture & Highlights"
            >
              <Info className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Architecture</span>
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors hidden sm:inline-flex"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-600 text-slate-200 hover:text-white transition-colors cursor-pointer"
              title="Close Sandbox (Esc)"
              aria-label="Close Sandbox"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Viewport & Body Workspace */}
        <div className="flex-1 relative flex overflow-hidden bg-slate-950">
          {/* Main Interactive Screen */}
          <div className="flex-1 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
            <div
              className={`h-full transition-all duration-300 flex flex-col ${
                viewportMode === 'desktop'
                  ? 'w-full'
                  : viewportMode === 'tablet'
                  ? 'w-[768px] max-w-full rounded-2xl border-4 border-slate-700/80 shadow-2xl overflow-hidden'
                  : 'w-[390px] max-w-full rounded-3xl border-8 border-slate-800 shadow-2xl overflow-hidden'
              }`}
            >
              {/* Dynamic Demo Component */}
              {currentDemo.id === 'game-reflex' && <GameDemo />}
              {currentDemo.id === 'ai-neurostudio' && <AiStudioDemo />}
              {currentDemo.id === 'ecommerce-luxe' && <EcommerceDemo />}
              {currentDemo.id === 'utility-omni' && <UtilityDemo />}
              {currentDemo.id === 'saas-pulseflow' && <SaasDemo />}
            </div>
          </div>

          {/* Collapsible Architecture & Client Highlights Drawer */}
          {showInfoPanel && (
            <div className="w-80 sm:w-96 bg-slate-900 border-l border-slate-800 p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200 z-30">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-blue-400" />
                    <span className="font-bold text-white text-sm">Tech Architecture</span>
                  </div>
                  <button onClick={() => setShowInfoPanel(false)} className="text-slate-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-semibold">
                    Category: {currentDemo.category}
                  </span>
                  <h3 className="text-base font-extrabold text-white mt-1">
                    {currentDemo.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {currentDemo.description}
                  </p>
                </div>

                {/* Screenshot Reference Thumbnail */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold flex items-center justify-between">
                    <span>Front Mockup Screenshot</span>
                    <span className="text-emerald-400 font-bold">100% Live in Frame</span>
                  </div>
                  <div className="relative rounded-xl overflow-hidden border border-slate-700/80 bg-slate-950 group">
                    <img
                      src={currentDemo.previewImage}
                      alt={`${currentDemo.title} Front UI Preview`}
                      referrerPolicy="no-referrer"
                      className="w-full h-28 object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-2">
                      <span className="text-[10px] font-mono text-slate-300">Front UI Reference Layout</span>
                    </div>
                  </div>
                </div>

                {/* Tech Stack Used */}
                <div>
                  <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-2">
                    Technologies
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {currentDemo.technologies.map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Highlights */}
                <div>
                  <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-2">
                    What This Demonstrates
                  </h4>
                  <ul className="space-y-2">
                    {currentDemo.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Client Takeaway Box */}
                <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-800/60 text-xs text-blue-200 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-blue-300">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    <span>Client Takeaway</span>
                  </div>
                  <p className="leading-relaxed text-[11px] text-blue-200/90">
                    {currentDemo.clientTakeaway}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800">
                <a
                  href="#contact"
                  onClick={() => {
                    onClose();
                    const el = document.getElementById('contact');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
                >
                  <span>Hire Sameer For Similar App</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
