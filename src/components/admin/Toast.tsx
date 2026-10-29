import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div 
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div
      className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all duration-300 animate-toast-in ${
        isSuccess
          ? 'bg-emerald-50 text-emerald-900 border-emerald-200 shadow-emerald-500/10'
          : isError
          ? 'bg-rose-50 text-rose-900 border-rose-200 shadow-rose-500/10'
          : 'bg-blue-50 text-blue-900 border-blue-200 shadow-blue-500/10'
      }`}
      role="alert"
    >
      <div className="flex items-center gap-2.5">
        {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
        {isError && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
        {!isSuccess && !isError && <Info className="w-4 h-4 text-blue-600 shrink-0" />}
        <span>{toast.message}</span>
      </div>

      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
