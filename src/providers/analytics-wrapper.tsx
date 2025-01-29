// components/AnalyticsProvider.tsx
'use client';

import { pageview, trackUserDropOff, trackUserEngagement } from '@/config/analytics';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function AnalyticsProvider({ children }: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Set session start time if not already set
    if (!sessionStorage.getItem('session_start')) {
      sessionStorage.setItem('session_start', Date.now().toString());
    }

    // Track page view
    const url = pathname + searchParams.toString();
    pageview(url);

    // Track engagement when user enters the page
    trackUserEngagement('page_enter', { page: pathname });

    // Setup visibility change tracking
    const handleVisibilityChange = () => {
      if (document.hidden) {
        trackUserDropOff(pathname);
      }
    };

    // Setup before unload tracking
    const handleBeforeUnload = () => {
      trackUserDropOff(pathname);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pathname, searchParams]);

  return <>{children}</>;
}