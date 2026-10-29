import React, { useState, useEffect } from 'react';
import { authService } from '../../services/authService';
import { Lock, ArrowLeft, ShieldAlert, KeyRound, User, Clock, AlertTriangle } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onNavigateHome: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onNavigateHome }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState<number>(0);

  // Poll lockout timer every second if active
  useEffect(() => {
    const checkLockout = () => {
      const remaining = authService.getLockoutRemainingSeconds();
      setLockoutTimer(remaining);
      if (remaining > 0) {
        setError(`Security lockout active. Please wait ${remaining}s before retrying.`);
      }
    };

    checkLockout();
    const interval = setInterval(checkLockout, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (lockoutTimer > 0) {
      setError(`Login disabled. Please wait ${lockoutTimer}s.`);
      return;
    }

    if (!username.trim() || !password.trim()) {
      setError('Please provide both username and password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = authService.login(username, password);
      setIsLoading(false);

      if (res.success) {
        onLoginSuccess();
      } else {
        setError(res.error || 'Authentication failed. Please check credentials.');
        if (res.lockoutSeconds) {
          setLockoutTimer(res.lockoutSeconds);
        }
      }
    }, 350);
  };

  const isLockedOut = lockoutTimer > 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden selection:bg-blue-500/20 selection:text-blue-900">
      {/* Background ambient lighting */}
      <div 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-blue-500/[0.05] via-sky-400/[0.04] to-transparent rounded-full blur-[140px] pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="w-full max-w-md space-y-8 relative z-10">
        
        {/* Back Link */}
        <div>
          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 text-xs font-mono text-slate-600 hover:text-slate-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md py-1 px-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Portfolio</span>
          </button>
        </div>

        {/* Login Card */}
        <div className="p-8 sm:p-10 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 space-y-6 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="text-center space-y-3">
            <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center shadow-sm transition-colors ${
              isLockedOut 
                ? 'bg-rose-50 border border-rose-200 text-rose-600' 
                : 'bg-blue-50 border border-blue-200 text-blue-600'
            }`}>
              {isLockedOut ? <AlertTriangle className="w-7 h-7" /> : <Lock className="w-7 h-7" />}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold tracking-tight text-slate-900">
                <span>Sameer</span>
                <span className="text-blue-600">Dev</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span className="text-slate-400 font-mono font-normal ml-1">Portal</span>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                Admin Authentication
              </h1>
              <p className="text-xs text-slate-500">
                Protected by rate limiting &amp; automated 2-hour session timeout
              </p>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div 
              className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 animate-in fade-in ${
                isLockedOut 
                  ? 'bg-rose-100 border-rose-300 text-rose-800' 
                  : 'bg-rose-50 border-rose-200 text-rose-700'
              }`}
              role="alert"
            >
              {isLockedOut ? (
                <Clock className="w-4 h-4 shrink-0 text-rose-600 mt-0.5 animate-pulse" />
              ) : (
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              )}
              <div className="space-y-1">
                <span>{error}</span>
                {isLockedOut && (
                  <p className="font-mono text-[11px] font-semibold text-rose-700">
                    Lockout timer: {lockoutTimer}s remaining
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label 
                htmlFor="admin-username" 
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
              >
                Admin Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="admin-username"
                  type="text"
                  autoComplete="username"
                  disabled={isLockedOut}
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (error && !isLockedOut) setError(null);
                  }}
                  placeholder="admin"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500/40 transition-all disabled:opacity-50 disabled:bg-slate-100"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label 
                htmlFor="admin-password" 
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
              >
                Admin Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  disabled={isLockedOut}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error && !isLockedOut) setError(null);
                  }}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500/40 transition-all disabled:opacity-50 disabled:bg-slate-100"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || isLockedOut}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl btn-micro-fx shadow-lg shadow-blue-600/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed pt-3"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Session...</span>
                </>
              ) : isLockedOut ? (
                <>
                  <Clock className="w-4 h-4" />
                  <span>Locked for {lockoutTimer}s</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Sign In to Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Security Features Notice */}
          <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-500 text-center leading-relaxed font-mono">
            Environment variable credentials &bull; 5-attempt brute-force protection &bull; 2-hour session expiry
          </div>
        </div>

      </div>
    </div>
  );
};
