import React from 'react';
import { Lock, ArrowLeft } from 'lucide-react';

interface AdminPlaceholderPageProps {
  onNavigate: (href: string) => void;
}

export const AdminPlaceholderPage: React.FC<AdminPlaceholderPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-6 selection:bg-blue-500/20 selection:text-blue-900">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-6 shadow-xl shadow-slate-200/50">
        <div className="w-14 h-14 mx-auto rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
          <Lock className="w-7 h-7" aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <div className="text-xs font-mono text-blue-600 font-semibold">System Area</div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Admin Portal Reserved
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            This section is reserved for future portfolio project management and authentication.
          </p>
        </div>

        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600 text-left">
          <div className="text-slate-400">// Foundation Notice</div>
          <div className="text-blue-600">Status: Route registered (reserved)</div>
          <div className="text-slate-600">Auth &amp; Dashboard: Active on /admin</div>
        </div>

        <div>
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] rounded-xl transition-all shadow-md shadow-blue-600/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Portfolio</span>
          </button>
        </div>
      </div>
    </div>
  );
};
