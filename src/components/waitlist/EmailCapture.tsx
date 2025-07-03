import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useTheme } from '../ThemeProvider';
import { useThemeStyles } from '../../hooks/useThemeStyles';
import { submitToConvertKit } from '../../utils/emailService'; // Choose your service

interface EmailCaptureProps {
  onSuccess?: (email: string, queuePosition: number) => void;
  onError?: (error: string) => void;
}

const EmailCapture: React.FC<EmailCaptureProps> = ({ onSuccess, onError }) => {
  const { theme } = useTheme();
  const styles = useThemeStyles();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [queuePosition, setQueuePosition] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    setError('');

    try {
      // Submit to your chosen email service
      await submitToConvertKit(email);
      
      // Generate queue position (you might get this from your service)
      const position = Math.floor(Math.random() * 2000) + 1000;
      setQueuePosition(position);
      setIsSubmitted(true);
      
      // Call success callback
      onSuccess?.(email, position);
      
      // Track analytics (optional)
      if (typeof gtag !== 'undefined') {
        gtag('event', 'waitlist_signup', {
          event_category: 'engagement',
          event_label: 'email_capture'
        });
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
    >
      <h2 
        style={{
          ...styles.typography.h1,
          color: theme.colors.text,
          marginBottom: theme.semanticSpacing.lg,
          fontSize: 'clamp(2.5rem, 6vw, 4rem)',
          textAlign: 'center',
        }}
      >
        Be first to get your life,{' '}
        <span 
          style={{
            background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          authored.
        </span>
      </h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          disabled={isSubmitting}
          style={{
            flex: 1,
            padding: theme.semanticSpacing.md,
            borderRadius: '0.75rem',
            border: `1px solid ${error ? theme.colors.error : theme.colors.border}`,
            backgroundColor: theme.colors.surface,
            color: theme.colors.text,
            fontSize: theme.typography.fontSize.base,
            opacity: isSubmitting ? 0.7 : 1,
          }}
        />
        <motion.button
          type="submit"
          disabled={isSubmitting || !email}
          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
          style={{
            ...styles.button.primary,
            whiteSpace: 'nowrap',
            padding: `${theme.semanticSpacing.md} ${theme.semanticSpacing.xl}`,
            opacity: isSubmitting || !email ? 0.7 : 1,
            cursor: isSubmitting || !email ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: theme.semanticSpacing.sm,
          }}
        >
          {isSubmitting ? (
            <>
              <Loader size={18} className="animate-spin" />
              <span>Joining...</span>
            </>
          ) : (
            <>
              <span>Join</span>
              <ArrowRight size={18} />
            </>
          )}
        </motion.button>
      </form>
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 mt-4"
          style={{
            color: theme.colors.error,
            fontSize: theme.typography.fontSize.sm,
          }}
        >
          <AlertCircle size={16} />
          <span>{error}</span>
        </motion.div>
      )}
      
      <p 
        style={{
          ...styles.typography.caption,
          color: theme.colors.textTertiary,
          textAlign: 'center',
          marginTop: theme.semanticSpacing.md,
        }}
      >
        No spam, unsubscribe anytime. We respect your privacy.
      </p>
    </motion.div>
  );
};

export default EmailCapture;