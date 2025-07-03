import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, ArrowRight, Star, Apple, Play } from 'lucide-react';
import { useTheme } from '../ThemeProvider';
import { useThemeStyles } from '../../hooks/useThemeStyles';

const AppHero = () => {
  const { theme } = useTheme();
  const styles = useThemeStyles();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 sm:pt-20 px-4 sm:px-6">
      {/* Subtle Background Gradient */}
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

      {/* Floating Elements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute top-32 right-4 sm:right-8 rounded-2xl p-3 sm:p-4 hidden sm:block"
        style={{
          ...styles.glass.light,
          border: `1px solid ${theme.colors.border}`,
        }}
      >
        <div className="flex items-center space-x-2 mb-2">
          <Star style={{ color: theme.colors.primary }} size={16} />
          <span 
            style={{ 
              color: theme.colors.text, 
              fontSize: theme.typography.fontSize.sm, 
              fontWeight: theme.typography.fontWeight.semibold 
            }}
          >
            4.8 Rating
          </span>
        </div>
        <div 
          style={{ 
            color: theme.colors.textSecondary, 
            fontSize: theme.typography.fontSize.xs 
          }}
        >
          10K+ Downloads
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="absolute top-48 left-4 sm:left-8 rounded-2xl p-3 sm:p-4 hidden sm:block"
        style={{
          ...styles.glass.light,
          border: `1px solid ${theme.colors.border}`,
        }}
      >
        <div className="flex items-center space-x-2 mb-2">
          <Smartphone style={{ color: theme.colors.primary }} size={16} />
          <span 
            style={{ 
              color: theme.colors.text, 
              fontSize: theme.typography.fontSize.sm, 
              fontWeight: theme.typography.fontWeight.semibold 
            }}
          >
            iOS & Android
          </span>
        </div>
        <div 
          style={{ 
            color: theme.colors.textSecondary, 
            fontSize: theme.typography.fontSize.xs 
          }}
        >
          Available Now
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 sm:mb-8"
        >
          <div 
            className="inline-flex items-center space-x-2 rounded-full px-3 sm:px-4 py-2 mb-4 sm:mb-6"
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
              Mobile App Experience
            </span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          style={{
            ...styles.typography.h1,
            color: theme.colors.text,
            marginBottom: theme.semanticSpacing.lg,
            fontSize: 'clamp(2rem, 8vw, 5rem)',
            lineHeight: '1.1',
            paddingLeft: '1rem',
            paddingRight: '1rem',
          }}
        >
          Your life,{' '}
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
            intelligently
          </motion.span>{' '}
          understood
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            ...styles.typography.bodyLarge,
            color: theme.colors.textSecondary,
            maxWidth: '64rem',
            margin: '0 auto',
            marginBottom: theme.semanticSpacing['3xl'],
            lineHeight: '1.6',
            paddingLeft: '1rem',
            paddingRight: '1rem',
            fontSize: 'clamp(1rem, 4vw, 1.125rem)',
          }}
        >
          Dytto transforms your daily experiences into meaningful stories and insights. 
          Automatically capture context, generate AI-powered narratives, and discover 
          personalized recommendations that truly understand you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 px-4"
        >
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            style={{
              backgroundColor: theme.colors.text,
              border: `1px solid ${theme.colors.border}`,
              color: theme.colors.background,
              padding: `${theme.semanticSpacing.sm} ${theme.semanticSpacing.md}`,
              borderRadius: '0.75rem',
              fontWeight: theme.typography.fontWeight.medium,
              transition: theme.animations.transition.normal,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: theme.semanticSpacing.sm,
              width: '100%',
              maxWidth: '200px',
            }}
          >
            <Apple size={20} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: theme.typography.fontSize.xs, opacity: 0.7 }}>Download on the</div>
              <div style={{ fontSize: theme.typography.fontSize.sm, fontWeight: theme.typography.fontWeight.semibold }}>App Store</div>
            </div>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            style={{
              backgroundColor: theme.colors.text,
              border: `1px solid ${theme.colors.border}`,
              color: theme.colors.background,
              padding: `${theme.semanticSpacing.sm} ${theme.semanticSpacing.md}`,
              borderRadius: '0.75rem',
              fontWeight: theme.typography.fontWeight.medium,
              transition: theme.animations.transition.normal,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: theme.semanticSpacing.sm,
              width: '100%',
              maxWidth: '200px',
            }}
          >
            <Play size={20} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: theme.typography.fontSize.xs, opacity: 0.7 }}>Get it on</div>
              <div style={{ fontSize: theme.typography.fontSize.sm, fontWeight: theme.typography.fontWeight.semibold }}>Google Play</div>
            </div>
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center space-x-2"
          style={{
            color: theme.colors.textTertiary,
            fontSize: theme.typography.fontSize.sm,
            paddingLeft: '1rem',
            paddingRight: '1rem',
          }}
        >
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} style={{ color: theme.colors.primary }} className="fill-current" />
            ))}
          </div>
          <span>4.8 • 10K+ downloads • Free to use</span>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden sm:block"
      >
        <div 
          className="w-6 h-10 rounded-full flex justify-center"
          style={{
            border: `2px solid ${theme.colors.border}`,
          }}
        >
          <div 
            className="w-1 h-3 rounded-full mt-2"
            style={{ backgroundColor: theme.colors.primary }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default AppHero;