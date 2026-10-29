import { useState, useEffect, useCallback } from 'react';

export function useRouter() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window === 'undefined') return '/';
    return window.location.pathname || '/';
  });

  const [currentHash, setCurrentHash] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    return window.location.hash || '';
  });

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname || '/');
      setCurrentHash(window.location.hash || '');
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigate = useCallback((to: string) => {
    // Handle home hash navigation from any route (e.g. /#projects)
    if (to.startsWith('/#')) {
      const hash = to.replace('/', '');
      window.history.pushState(null, '', `/${hash}`);
      setCurrentPath('/');
      setCurrentHash(hash);
      setTimeout(() => {
        const el = document.getElementById(hash.substring(1));
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
      return;
    }

    if (to.startsWith('#')) {
      // Anchor scroll on current page
      if (window.location.pathname !== '/') {
        window.history.pushState(null, '', `/${to}`);
        setCurrentPath('/');
        setCurrentHash(to);
        setTimeout(() => {
          const el = document.getElementById(to.substring(1));
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      } else {
        window.history.pushState(null, '', to);
        setCurrentHash(to);
        const el = document.getElementById(to.substring(1));
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (to === currentPath) return;

    window.history.pushState(null, '', to);
    setCurrentPath(to);
    setCurrentHash('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPath]);

  // Project detail path extraction
  const isProjectDetail = currentPath.startsWith('/projects/');
  const projectId = isProjectDetail ? currentPath.replace('/projects/', '').split('/')[0] : null;

  return {
    currentPath,
    currentHash,
    navigate,
    isHome: currentPath === '/' || currentPath === '',
    isAdmin: currentPath === '/admin' || currentPath === '/admin/',
    isProjectDetail,
    projectId,
  };
}
