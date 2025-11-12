import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Apple, Play, Star } from 'lucide-react';
import { useTheme } from '../ThemeProvider';
import { useThemeStyles } from '../../hooks/useThemeStyles';

const AppCTA = () => {
  const { theme } = useTheme();
  const styles = useThemeStyles();

  return (
    <section style={styles.bg.primary} className="py-32 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            background: [
              `radial-gradient(circle at 20% 20%, ${theme.utils.alpha(theme.colors.primary, 0.05)} 0%, transparent 50%)`,
              `radial-gradient(circle at 80% 80%, ${theme.utils.alpha(theme.colors.primary, 0.08)} 0%, transparent 50%)`,
              `radial-gradient(circle at 20% 80%, ${theme.utils.alpha(theme.colors.primary, 0.05)} 0%, transparent 50%)`,
              `radial-gradient(circle at 20% 20%, ${theme.utils.alpha(theme.colors.primary, 0.05)} 0%, transparent 50%)`
            ]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 
            style={{
              ...styles.typography.h1,
              color: theme.colors.text,
              marginBottom: theme.semanticSpacing.lg,
              fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
              lineHeight: '1.1',
            }}
          >
            Start your{' '}
            <motion.span 
              key={`cta-gradient-${theme.mode}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: theme.typography.fontWeight.semibold,
                display: 'inline-block',
              }}
            >
              intelligent journey
            </motion.span>{' '}
            today
          </h2>
          <p 
            style={{
              ...styles.typography.bodyLarge,
              color: theme.colors.textSecondary,
              maxWidth: '48rem',
              margin: '0 auto',
              lineHeight: '1.6',
              marginBottom: theme.semanticSpacing.xl,
            }}
          >
            Transform your daily experiences into meaningful stories and insights. 
            Download Dytto and discover what your life has been trying to tell you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <motion.a
            href="https://apps.apple.com/us/app/dytto-journal/id6745741994"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            style={{
              backgroundColor: theme.colors.text,
              border: `1px solid ${theme.colors.border}`,
              color: theme.colors.background,
              padding: `${theme.semanticSpacing.md} ${theme.semanticSpacing.lg}`,
              borderRadius: '0.75rem',
              fontWeight: theme.typography.fontWeight.medium,
              transition: theme.animations.transition.normal,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: theme.semanticSpacing.sm,
              width: '100%',
              maxWidth: '240px',
              boxShadow: theme.shadows.lg,
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            <Apple size={24} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: theme.typography.fontSize.xs, opacity: 0.7 }}>Download on the</div>
              <div style={{ fontSize: theme.typography.fontSize.base, fontWeight: theme.typography.fontWeight.semibold }}>App Store</div>
            </div>
          </motion.a>
          
          <motion.button
            disabled
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            style={{
              backgroundColor: theme.utils.alpha(theme.colors.text, 0.5),
              border: `1px solid ${theme.colors.border}`,
              color: theme.colors.background,
              padding: `${theme.semanticSpacing.md} ${theme.semanticSpacing.lg}`,
              borderRadius: '0.75rem',
              fontWeight: theme.typography.fontWeight.medium,
              transition: theme.animations.transition.normal,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: theme.semanticSpacing.sm,
              width: '100%',
              maxWidth: '240px',
              boxShadow: theme.shadows.lg,
              opacity: 0.6,
              cursor: 'not-allowed',
            }}
          >
            <Play size={24} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: theme.typography.fontSize.xs, opacity: 0.7 }}>Coming soon on</div>
              <div style={{ fontSize: theme.typography.fontSize.base, fontWeight: theme.typography.fontWeight.semibold }}>Google Play</div>
            </div>
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <div 
            style={{
              ...styles.glass.light,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '1.5rem',
              padding: theme.semanticSpacing.xl,
              maxWidth: '64rem',
              margin: '0 auto',
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {[
                { icon: Star, title: '4.8 Rating', subtitle: '10K+ Reviews' },
                { icon: ArrowRight, title: 'Free to Start', subtitle: 'No Credit Card Required' },
                { icon: Star, title: 'Privacy First', subtitle: 'Your Data Stays Yours' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '3rem',
                      height: '3rem',
                      backgroundColor: theme.utils.alpha(theme.colors.primary, 0.1),
                      border: `1px solid ${theme.utils.alpha(theme.colors.primary, 0.3)}`,
                      borderRadius: '1rem',
                      marginBottom: theme.semanticSpacing.md,
                    }}
                  >
                    <item.icon style={{ color: theme.colors.primary }} size={20} />
                  </motion.div>
                  <h3 
                    style={{
                      ...styles.typography.h6,
                      color: theme.colors.text,
                      marginBottom: theme.semanticSpacing.xs,
                    }}
                  >
                    {item.title}
                  </h3>
                  <p 
                    style={{
                      ...styles.typography.caption,
                      color: theme.colors.textSecondary,
                    }}
                  >
                    {item.subtitle}
                  </p>
                </motion.div>
              ))}
            </div>

            <div 
              style={{
                color: theme.colors.textSecondary,
                fontSize: theme.typography.fontSize.sm,
              }}
            >
              Join thousands of users discovering meaningful insights about their lives
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AppCTA;