import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, ArrowRight, Star, Apple, Play } from 'lucide-react';
import { useTheme } from '../ThemeProvider';
import { useThemeStyles } from '../../hooks/useThemeStyles';

const AppHero = () => {
  const { theme } = useTheme();
  const styles = useThemeStyles();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 px-4 sm:px-6">
      {/* Background */}
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.background} 0%, ${theme.colors.backgroundSecondary} 50%, ${theme.colors.backgroundTertiary} 100%)`
        }}
      >
        <motion.div
          animate={{
            background: [
              `radial-gradient(circle at 20% 50%, ${theme.utils.alpha(theme.colors.primary, 0.03)} 0%, transparent 50%)`,
              `radial-gradient(circle at 80% 20%, ${theme.utils.alpha(theme.colors.primary, 0.05)} 0%, transparent 50%)`,
              `radial-gradient(circle at 40% 80%, ${theme.utils.alpha(theme.colors.primary, 0.03)} 0%, transparent 50%)`,
              `radial-gradient(circle at 20% 50%, ${theme.utils.alpha(theme.colors.primary, 0.03)} 0%, transparent 50%)`
            ]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <div 
            className="inline-flex items-center space-x-2 rounded-full px-4 py-2 mb-6"
            style={{
              backgroundColor: theme.utils.alpha(theme.colors.primary, 0.1),
              border: `1px solid ${theme.utils.alpha(theme.colors.primary, 0.2)}`,
            }}
          >
            <Smartphone style={{ color: theme.colors.primary }} size={16} />
            <span 
              style={{ 
                color: theme.colors.primary, 
                fontSize: theme.typography.fontSize.sm, 
                fontWeight: theme.typography.fontWeight.medium 
              }}
            >
              AI-Powered Journal
            </span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          style={{
            color: theme.colors.text,
            fontSize: 'clamp(2rem, 8vw, 4.5rem)',
            fontWeight: theme.typography.fontWeight.bold,
            lineHeight: '1.1',
            marginBottom: theme.semanticSpacing.lg,
          }}
        >
          Your story,{' '}
          <motion.span 
            key={`gradient-${theme.mode}`}
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
            beautifully
          </motion.span>{' '}
          told
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            color: theme.colors.textSecondary,
            fontSize: 'clamp(1rem, 4vw, 1.25rem)',
            lineHeight: '1.6',
            maxWidth: '48rem',
            margin: '0 auto',
            marginBottom: theme.semanticSpacing.xl,
          }}
        >
          dytto captures your daily moments and transforms them into 
          beautiful, personalized stories — while building a personal context layer 
          that makes every AI you use smarter.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
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
              padding: '1rem 1.5rem',
              borderRadius: '0.75rem',
              fontWeight: theme.typography.fontWeight.medium,
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              width: '100%',
              maxWidth: '200px',
              boxShadow: theme.shadows.md,
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            <Apple size={20} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Download on the</div>
              <div style={{ fontSize: '0.875rem', fontWeight: theme.typography.fontWeight.semibold }}>App Store</div>
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
              padding: '1rem 1.5rem',
              borderRadius: '0.75rem',
              fontWeight: theme.typography.fontWeight.medium,
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              width: '100%',
              maxWidth: '200px',
              boxShadow: theme.shadows.md,
              opacity: 0.6,
              cursor: 'not-allowed',
            }}
          >
            <Play size={20} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Coming soon on</div>
              <div style={{ fontSize: '0.875rem', fontWeight: theme.typography.fontWeight.semibold }}>Google Play</div>
            </div>
          </motion.button>
        </motion.div>

{/*         <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center space-x-2"
          style={{
            color: theme.colors.textTertiary,
            fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
          }}
        >
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} style={{ color: theme.colors.primary }} className="fill-current" />
            ))}
          </div>
          <span>4.8 • 10K+ downloads • Free to use</span>
        </motion.div> */}
      </div>
    </section>
  );
};

export default AppHero;
