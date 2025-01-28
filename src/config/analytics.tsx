// analytics/gtag.ts
type GTagEvent = {
    action: string;
    category: string;
    label: string;
    value?: number;
  };
  
  // Declare gtag as a global function
  declare global {
    interface Window {
      gtag: (
        command: 'config' | 'event',
        targetId: string,
        config?: Record<string, any>
      ) => void;
    }
  }
  
  // Initialize GA with your tracking ID
  export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
  
  // Log page views
  export const pageview = (url: string) => {
    window.gtag('config', GA_TRACKING_ID!, {
      page_path: url,
    });
  };
  
  // Log specific events
  export const event = ({ action, category, label, value }: GTagEvent) => {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  };
  
  // Track user engagement
  export const trackUserEngagement = (eventName: string, properties?: Record<string, any>) => {
    window.gtag('event', eventName, {
      ...properties,
      timestamp: new Date().toISOString(),
    });
  };
  
  // Track user drop-off
  export const trackUserDropOff = (lastPage: string) => {
    window.gtag('event', 'user_drop_off', {
      last_page: lastPage,
      session_duration: calculateSessionDuration(),
    });
  };
  
  // Helper function to calculate session duration
  const calculateSessionDuration = () => {
    const sessionStart = sessionStorage.getItem('session_start');
    if (!sessionStart) return 0;
    
    const duration = Date.now() - parseInt(sessionStart);
    return Math.floor(duration / 1000); // Convert to seconds
  };