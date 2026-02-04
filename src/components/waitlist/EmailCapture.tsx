import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useTheme } from '../ThemeProvider';
import { useThemeStyles } from '../../hooks/useThemeStyles';
import { joinWaitlist, type WaitlistSignupData } from '../../utils/supabaseWaitlist';
import analytics, { trackWaitlistSignup } from '../../utils/analytics';

interface EmailCaptureProps {
  onSuccess?: (email: string, queuePosition: number) => void;
  onError?: (error: string) => void;
  source?: string;
  referralCode?: string;
}

const EmailCapture: React.FC<EmailCaptureProps> = ({ 
  onSuccess, 
  onError, 
  source = 'website',
  referralCode 
}) => {
  const { theme } = useTheme();
  const styles = useThemeStyles();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [queuePosition, setQueuePosition] = useState(0);
  const [formStartTime, setFormStartTime] = useState<number | null>(null);

  useEffect(() => {
    // Track form view when component mounts
    analytics.trackEvent({
      action: 'waitlist_form_view',
      category: 'conversion',
      label: source,
    });
  }, [source]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    setError('');

    try {
      const signupData: WaitlistSignupData = {
        email,
        source,
        referral_code: referralCode,
        metadata: {
          user_agent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          url: window.location.href,
        }
      };

      const result = await joinWaitlist(signupData);
      
      if (result.success && result.data) {
        setQueuePosition(result.position || 0);
        setIsSubmitted(true);
        onSuccess?.(email, result.position || 0);
        
        // Track enhanced analytics
        trackWaitlistSignup(email, result.position || 0, source);
        
        // Track form completion time if we have start time
        if (formStartTime) {
          analytics.trackEvent({
            action: 'form_completion_time',
            category: 'conversion',
            label: 'waitlist_signup',
            value: Math.round((Date.now() - formStartTime) / 1000),
          });
        }
      } else {
        const errorMessage = result.error || 'Something went wrong. Please try again.';
        setError(errorMessage);
        onError?.(errorMessage);
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          ...styles.glass.light,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: '1.5rem',
          padding: theme.semanticSpacing.xl,
          textAlign: 'center',
        }}
      >
        <CheckCircle style={{ color: theme.colors.success, margin: '0 auto', marginBottom: theme.semanticSpacing.lg }} size={48} />
        <h3 
          style={{
            ...styles.typography.h3,
            color: theme.colors.text,
            marginBottom: theme.semanticSpacing.md,
          }}
        >
          You're in!
        </h3>
        <p 
          style={{
            ...styles.typography.bodyLarge,
            color: theme.colors.textSecondary,
            marginBottom: theme.semanticSpacing.lg,
          }}
        >
          You're #{queuePosition.toLocaleString()} in line
        </p>
        <p 
          style={{
            ...styles.typography.body,
            color: theme.colors.textTertiary,
            fontSize: theme.typography.fontSize.sm,
          }}
        >
          Check your email for confirmation and next steps!
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-2xl mx-auto"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-center mb-8"
      >
        <h2 
          style={{
            ...styles.typography.h1,
            color: theme.colors.text,
            marginBottom: theme.semanticSpacing.md,
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            lineHeight: '1.1',
          }}
        >
          Your context. Your stories. Your{' '}
          <span 
            style={{
              background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            AI, personalized
          </span>
        </h2>
        <p 
          style={{
            ...styles.typography.bodyLarge,
            color: theme.colors.textSecondary,
            marginBottom: theme.semanticSpacing.lg,
          }}
        >
          Join thousands of early users getting exclusive access to dytto
        </p>
      </motion.div>

      {/* Main Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{
          ...styles.glass.medium,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: '1.5rem',
          padding: theme.semanticSpacing.xl,
          background: `linear-gradient(135deg, ${theme.utils.alpha(theme.colors.primary, 0.02)}, ${theme.utils.alpha(theme.colors.accent, 0.02)})`,
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input with Enhanced Design */}
          <div className="relative">
            <motion.input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                // Track form start on first input
                if (!formStartTime && e.target.value.length === 1) {
                  setFormStartTime(Date.now());
                  analytics.trackFormInteraction('start', 'waitlist_signup', 'email');
                }
              }}
              onBlur={() => {
                // Track form field completion
                if (email) {
                  analytics.trackFormInteraction('complete', 'waitlist_signup', 'email');
                }
              }}
              placeholder="Enter your email address"
              required
              disabled={isSubmitting}
              whileFocus={{ scale: 1.02 }}
              style={{
                width: '100%',
                padding: `${theme.semanticSpacing.lg} ${theme.semanticSpacing.md}`,
                borderRadius: '1rem',
                border: `2px solid ${error ? theme.colors.error : email ? theme.colors.primary : theme.colors.border}`,
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                fontSize: theme.typography.fontSize.lg,
                fontWeight: theme.typography.fontWeight.medium,
                opacity: isSubmitting ? 0.7 : 1,
                transition: 'all 0.3s ease',
                outline: 'none',
                boxShadow: email ? `0 0 0 4px ${theme.utils.alpha(theme.colors.primary, 0.1)}` : 'none',
              }}
            />
            {email && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
              >
                <CheckCircle style={{ color: theme.colors.success }} size={20} />
              </motion.div>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting || !email}
            onClick={() => {
              if (!isSubmitting && email) {
                analytics.trackButtonClick('Join the Waitlist', 'waitlist_form', 'email_capture');
              }
            }}
            whileHover={{ scale: isSubmitting || !email ? 1 : 1.02, y: isSubmitting || !email ? 0 : -2 }}
            whileTap={{ scale: isSubmitting || !email ? 1 : 0.98 }}
            style={{
              width: '100%',
              padding: `${theme.semanticSpacing.lg} ${theme.semanticSpacing.xl}`,
              borderRadius: '1rem',
              border: 'none',
              background: isSubmitting || !email 
                ? theme.colors.border 
                : `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
              color: theme.colors.background,
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.semibold,
              cursor: isSubmitting || !email ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: theme.semanticSpacing.sm,
              boxShadow: isSubmitting || !email ? 'none' : theme.shadows.brand,
              transition: 'all 0.3s ease',
            }}
          >
            {isSubmitting ? (
              <>
                <Loader size={20} className="animate-spin" />
                <span>Joining waitlist...</span>
              </>
            ) : (
              <>
                <span>Join the Waitlist</span>
                <ArrowRight size={20} />
              </>
            )}
          </motion.button>
        </form>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 mt-4 p-3 rounded-lg"
            style={{
              backgroundColor: theme.utils.alpha(theme.colors.error, 0.1),
              border: `1px solid ${theme.utils.alpha(theme.colors.error, 0.3)}`,
              color: theme.colors.error,
            }}
          >
            <AlertCircle size={16} />
            <span style={{ fontSize: theme.typography.fontSize.sm }}>{error}</span>
          </motion.div>
        )}

        {/* Benefits List */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 space-y-3"
        >
          {[
            "Full access to dytto’s context API",
            "Claude desktop agent integration",
            "Get premium access for free while we’re in beta.",
            "Direct line to our team for feedback",
          ].map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              className="flex items-center gap-3"
            >
              <span style={{ fontSize: theme.typography.fontSize.base, color: theme.colors.textSecondary }}>
                {benefit}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Trust Indicators */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="text-center mt-6 space-y-2"
      >
        <p 
          style={{
            ...styles.typography.caption,
            color: theme.colors.textTertiary,
          }}
        >
          No spam, unsubscribe anytime. We respect your privacy.
        </p>
        {/* <p 
          style={{
            ...styles.typography.caption,
            color: theme.colors.textSecondary,
            fontWeight: theme.typography.fontWeight.medium,
          }}
        >
          Join 12,000+ people already on the waitlist
        </p> */}
      </motion.div>
    </motion.div>
  );
};

export default EmailCapture;
