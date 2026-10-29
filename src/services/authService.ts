/**
 * Admin Authentication Service
 * 
 * Provides:
 * - Environment-driven credentials via import.meta.env (VITE_ADMIN_USERNAME, VITE_ADMIN_PASSWORD)
 * - Brute-force protection: 5 attempts threshold triggers a 30-second lockout timer
 * - Session expiry: 2-hour timeout after which auto-logout occurs
 */

const AUTH_STORAGE_KEY = 'sameerdev_admin_auth';
const ATTEMPTS_STORAGE_KEY = 'sameerdev_admin_attempts';

export interface AdminSession {
  username: string;
  loggedInAt: string;
  expiresAt: string;
}

interface AttemptTracker {
  count: number;
  lockedUntil: number; // timestamp in ms
}

// 2 hours in milliseconds
const SESSION_DURATION_MS = 2 * 60 * 60 * 1000;
// 30 seconds lockout
const LOCKOUT_DURATION_MS = 30 * 1000;
const MAX_ATTEMPTS = 5;

// Fallback defaults if .env variables are not yet populated
const ENV_ADMIN_USERNAME = (import.meta.env.VITE_ADMIN_USERNAME || 'admin').trim().toLowerCase();
const ENV_ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'sameerdev_secure_pass_2026';

function getAttemptTracker(): AttemptTracker {
  if (typeof window === 'undefined') return { count: 0, lockedUntil: 0 };
  try {
    const raw = sessionStorage.getItem(ATTEMPTS_STORAGE_KEY);
    if (!raw) return { count: 0, lockedUntil: 0 };
    return JSON.parse(raw);
  } catch {
    return { count: 0, lockedUntil: 0 };
  }
}

function saveAttemptTracker(tracker: AttemptTracker): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(ATTEMPTS_STORAGE_KEY, JSON.stringify(tracker));
  } catch {
    // ignore
  }
}

export const authService = {
  /**
   * Returns remaining lockout seconds if currently locked out, or 0 if active.
   */
  getLockoutRemainingSeconds(): number {
    const tracker = getAttemptTracker();
    const now = Date.now();
    if (tracker.lockedUntil > now) {
      return Math.ceil((tracker.lockedUntil - now) / 1000);
    }
    return 0;
  },

  /**
   * Checks whether an admin session exists, is valid, and has not expired (2 hours max).
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!raw) return false;
      const parsed = JSON.parse(raw) as AdminSession;
      if (!parsed || !parsed.username || !parsed.expiresAt) return false;

      // Check 2-hour session expiration
      const expirationTime = new Date(parsed.expiresAt).getTime();
      if (Date.now() > expirationTime) {
        this.logout();
        return false;
      }

      return true;
    } catch {
      return false;
    }
  },

  /**
   * Retrieves the current admin session information if not expired.
   */
  getSession(): AdminSession | null {
    if (!this.isAuthenticated()) return null;
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as AdminSession;
    } catch {
      return null;
    }
  },

  /**
   * Authenticates admin with rate limiting & session expiration.
   */
  login(usernameInput: string, passwordInput: string): { 
    success: boolean; 
    error?: string; 
    lockoutSeconds?: number;
  } {
    const remainingLockout = this.getLockoutRemainingSeconds();
    if (remainingLockout > 0) {
      return {
        success: false,
        error: `Too many failed attempts. Security lockout active. Please wait ${remainingLockout} seconds.`,
        lockoutSeconds: remainingLockout,
      };
    }

    const username = usernameInput.trim().toLowerCase();
    const password = passwordInput.trim();

    if (!username || !password) {
      return { success: false, error: 'Please enter both username and password.' };
    }

    const isValid = username === ENV_ADMIN_USERNAME && password === ENV_ADMIN_PASSWORD;

    const tracker = getAttemptTracker();

    if (!isValid) {
      const newCount = tracker.count + 1;
      let lockedUntil = 0;
      let errorMsg = `Invalid credentials. Attempt ${newCount} of ${MAX_ATTEMPTS}.`;

      if (newCount >= MAX_ATTEMPTS) {
        lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
        errorMsg = `Maximum failed attempts reached. Account locked for 30 seconds.`;
      }

      saveAttemptTracker({
        count: newCount >= MAX_ATTEMPTS ? 0 : newCount,
        lockedUntil,
      });

      return {
        success: false,
        error: errorMsg,
        lockoutSeconds: lockedUntil > 0 ? 30 : 0,
      };
    }

    // Reset attempt tracker on successful login
    saveAttemptTracker({ count: 0, lockedUntil: 0 });

    const now = Date.now();
    const session: AdminSession = {
      username,
      loggedInAt: new Date(now).toISOString(),
      expiresAt: new Date(now + SESSION_DURATION_MS).toISOString(),
    };

    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      return { success: true };
    } catch (e) {
      console.warn('Unable to persist admin session:', e);
      return { success: false, error: 'Storage error. Please enable cookies/localStorage.' };
    }
  },

  /**
   * Terminates the current admin session and clears stored state.
   */
  logout(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {
      console.warn('Unable to clear admin session:', e);
    }
  },
};
