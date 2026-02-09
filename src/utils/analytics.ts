/**
 * Enhanced Analytics Utility for Landing Page Event Tracking
 * Provides comprehensive tracking for user interactions, scroll depth, exit intent, and more
 * Integrates with both Google Analytics and Mixpanel (via shared analytics)
 */

import { track as mixpanelTrack, trackError as mixpanelTrackError } from '@ayaan/analytics';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export interface UTMParams {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}

export interface EventData {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

class Analytics {
  private scrollDepthTracked: Set<number> = new Set();
  private exitIntentTracked = false;
  private sessionStart = Date.now();
  private utmParams: UTMParams = {};

  constructor() {
    this.init();
  }

  private init() {
    // Extract UTM parameters on page load
    this.extractUTMParams();
    
    // Initialize scroll depth tracking
    this.initScrollDepthTracking();
    
    // Initialize exit intent tracking
    this.initExitIntentTracking();
    
    // Track page load time
    this.trackPageLoadTime();
  }

  /**
   * Extract and store UTM parameters from URL
   */
  private extractUTMParams() {
    if (typeof window === 'undefined') return;
    
    const urlParams = new URLSearchParams(window.location.search);
    this.utmParams = {
      source: urlParams.get('utm_source') || undefined,
      medium: urlParams.get('utm_medium') || undefined,
      campaign: urlParams.get('utm_campaign') || undefined,
      term: urlParams.get('utm_term') || undefined,
      content: urlParams.get('utm_content') || undefined,
    };

    // Store UTM params in sessionStorage for attribution
    if (Object.values(this.utmParams).some(param => param)) {
      sessionStorage.setItem('utm_params', JSON.stringify(this.utmParams));
    }
  }

  /**
   * Get stored UTM parameters
   */
  getUTMParams(): UTMParams {
    try {
      const stored = sessionStorage.getItem('utm_params');
      return stored ? JSON.parse(stored) : this.utmParams;
    } catch {
      return this.utmParams;
    }
  }

  /**
   * Track custom events with enhanced parameters
   */
  trackEvent(eventData: EventData) {
    const enhancedParams = {
      event_category: eventData.category,
      event_label: eventData.label,
      value: eventData.value,
      page_title: typeof document !== 'undefined' ? document.title : undefined,
      page_location: typeof window !== 'undefined' ? window.location.href : undefined,
      ...this.getUTMParams(),
      session_duration: Math.round((Date.now() - this.sessionStart) / 1000),
      ...eventData.custom_parameters,
    };

    // Send to Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventData.action, enhancedParams);
    }

    // Send to Mixpanel
    mixpanelTrack(eventData.action, enhancedParams);
  }

  /**
   * Initialize scroll depth tracking
   */
  private initScrollDepthTracking() {
    if (typeof window === 'undefined') return;

    let ticking = false;
    const trackScrollDepth = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      // Track at 25%, 50%, 75%, 90% intervals
      const milestones = [25, 50, 75, 90];
      
      milestones.forEach(milestone => {
        if (scrollPercent >= milestone && !this.scrollDepthTracked.has(milestone)) {
          this.scrollDepthTracked.add(milestone);
          this.trackEvent({
            action: 'scroll_depth',
            category: 'engagement',
            label: `${milestone}%`,
            value: milestone,
          });
        }
      });

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(trackScrollDepth);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  /**
   * Initialize exit intent tracking
   */
  private initExitIntentTracking() {
    if (typeof window === 'undefined') return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !this.exitIntentTracked) {
        this.exitIntentTracked = true;
        this.trackEvent({
          action: 'exit_intent',
          category: 'engagement',
          label: 'mouse_leave_top',
          custom_parameters: {
            time_on_page: Math.round((Date.now() - this.sessionStart) / 1000),
          },
        });
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
  }

  /**
   * Track page load performance
   */
  private trackPageLoadTime() {
    if (typeof window === 'undefined' || !window.performance) return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const loadTime = Math.round(navigation.loadEventEnd - navigation.fetchStart);
        
        this.trackEvent({
          action: 'page_load_time',
          category: 'performance',
          label: 'load_complete',
          value: loadTime,
          custom_parameters: {
            dom_content_loaded: Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart),
            first_contentful_paint: this.getFirstContentfulPaint(),
          },
        });
      }, 0);
    });
  }

  /**
   * Get First Contentful Paint metric
   */
  private getFirstContentfulPaint(): number | undefined {
    try {
      const paintEntries = performance.getEntriesByType('paint');
      const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      return fcp ? Math.round(fcp.startTime) : undefined;
    } catch {
      return undefined;
    }
  }

  /**
   * Track button clicks with context
   */
  trackButtonClick(buttonText: string, location: string, section?: string) {
    this.trackEvent({
      action: 'button_click',
      category: 'interaction',
      label: `${location}: ${buttonText}`,
      custom_parameters: {
        button_text: buttonText,
        button_location: location,
        section: section,
        scroll_position: Math.round((window.pageYOffset / document.documentElement.scrollHeight) * 100),
      },
    });
  }

  /**
   * Track form interactions
   */
  trackFormInteraction(action: 'start' | 'complete' | 'abandon', formName: string, fieldName?: string) {
    this.trackEvent({
      action: `form_${action}`,
      category: 'conversion',
      label: formName,
      custom_parameters: {
        form_name: formName,
        field_name: fieldName,
        time_to_action: Math.round((Date.now() - this.sessionStart) / 1000),
      },
    });
  }

  /**
   * Track feature showcases and interactions
   */
  trackFeatureInteraction(featureName: string, action: 'view' | 'interact' | 'expand') {
    this.trackEvent({
      action: `feature_${action}`,
      category: 'engagement',
      label: featureName,
      custom_parameters: {
        feature_name: featureName,
        viewport_width: window.innerWidth,
        viewport_height: window.innerHeight,
      },
    });
  }

  /**
   * Track CTA effectiveness
   */
  trackCTA(ctaText: string, position: string, outcome: 'click' | 'view') {
    this.trackEvent({
      action: `cta_${outcome}`,
      category: 'conversion',
      label: `${position}: ${ctaText}`,
      custom_parameters: {
        cta_text: ctaText,
        cta_position: position,
        page_section: this.getCurrentSection(),
      },
    });
  }

  /**
   * Determine current page section based on scroll position
   */
  private getCurrentSection(): string {
    const sections = ['hero', 'features', 'pricing', 'testimonials', 'cta', 'footer'];
    const scrollPercent = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    
    if (scrollPercent < 15) return 'hero';
    if (scrollPercent < 35) return 'features';
    if (scrollPercent < 55) return 'pricing';
    if (scrollPercent < 75) return 'testimonials';
    if (scrollPercent < 90) return 'cta';
    return 'footer';
  }

  /**
   * Track video or media interactions
   */
  trackMediaInteraction(mediaType: 'video' | 'image' | 'demo', action: 'play' | 'pause' | 'complete' | 'view', mediaName: string) {
    this.trackEvent({
      action: `${mediaType}_${action}`,
      category: 'media',
      label: mediaName,
      custom_parameters: {
        media_type: mediaType,
        media_name: mediaName,
      },
    });
  }

  /**
   * Track errors and issues
   */
  trackError(errorType: string, errorMessage: string, context?: string) {
    // Send to Google Analytics via trackEvent
    this.trackEvent({
      action: 'error',
      category: 'technical',
      label: errorType,
      custom_parameters: {
        error_message: errorMessage,
        error_context: context,
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        timestamp: new Date().toISOString(),
      },
    });

    // Also send to Mixpanel's dedicated error tracking
    mixpanelTrackError(errorMessage, {
      error_type: errorType,
      error_context: context,
    });
  }

  /**
   * Track time on page when user leaves
   */
  trackTimeOnPage() {
    if (typeof window === 'undefined') return;

    const trackPageExit = () => {
      const timeOnPage = Math.round((Date.now() - this.sessionStart) / 1000);
      this.trackEvent({
        action: 'time_on_page',
        category: 'engagement',
        label: 'page_exit',
        value: timeOnPage,
        custom_parameters: {
          max_scroll_depth: Math.max(...Array.from(this.scrollDepthTracked), 0),
        },
      });
    };

    // Track on page visibility change (tab switch, close)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        trackPageExit();
      }
    });

    // Track on beforeunload as backup
    window.addEventListener('beforeunload', trackPageExit);
  }
}

// Create singleton instance
const analytics = new Analytics();

export default analytics;

// Helper functions for common tracking scenarios
export const trackWaitlistSignup = (email: string, position: number, source: string) => {
  analytics.trackEvent({
    action: 'waitlist_signup',
    category: 'conversion',
    label: source,
    value: position,
    custom_parameters: {
      email_domain: email.split('@')[1],
      queue_position: position,
      signup_source: source,
    },
  });
};

export const trackNewsletterSignup = (email: string, source: string) => {
  analytics.trackEvent({
    action: 'newsletter_signup',
    category: 'conversion',
    label: source,
    custom_parameters: {
      email_domain: email.split('@')[1],
      signup_source: source,
    },
  });
};

export const trackDownloadAttempt = (downloadType: string, source: string) => {
  analytics.trackEvent({
    action: 'download_attempt',
    category: 'conversion',
    label: downloadType,
    custom_parameters: {
      download_type: downloadType,
      download_source: source,
    },
  });
};