import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Code, Sparkles, ArrowRight } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useThemeStyles } from '../hooks/useThemeStyles';
import analytics from '../utils/analytics';

const Hero = () => {
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

      {/* Floating Elements - Hidden on mobile for cleaner look */}
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
          <Code style={{ color: theme.colors.primary }} size={16} />
          <span 
            style={{ 
              color: theme.colors.text, 
              fontSize: theme.typography.fontSize.sm, 
              fontWeight: theme.typography.fontWeight.semibold 
            }}
          >
            API First
          </span>
        </div>
        <div 
          style={{ 
            color: theme.colors.textSecondary, 
            fontSize: theme.typography.fontSize.xs 
          }}
        >
          OAuth 2.0 Ready
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
          <Sparkles style={{ color: theme.colors.primary }} size={16} />
          <span 
            style={{ 
              color: theme.colors.text, 
              fontSize: theme.typography.fontSize.sm, 
              fontWeight: theme.typography.fontWeight.semibold 
            }}
          >
            AI Powered
          </span>
        </div>
        <div 
          style={{ 
            color: theme.colors.textSecondary, 
            fontSize: theme.typography.fontSize.xs 
          }}
        >
          Context Aware
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
            <Brain style={{ color: theme.colors.primary }} size={16} />
            <span 
              style={{ 
                color: theme.colors.primary, 
                fontSize: theme.typography.fontSize.sm, 
                fontWeight: theme.typography.fontWeight.medium 
              }}
            >
              AI Context Platform
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
          Build AI that{' '}
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
            understands
          </motion.span>{' '}
          your users
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
          Dytto provides the context infrastructure for intelligent applications. 
          Access rich user personas, generate simulation agents, and build AI that 
          truly understands human context.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 px-4"
        >
          <motion.button
            onClick={() => {
              analytics.trackButtonClick('Start Building', 'hero', 'primary_cta');
              analytics.trackCTA('Start Building', 'hero_primary', 'click');
              // Navigate to waitlist or build page
              window.location.href = '/waitlist';
            }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            style={{
              ...styles.button.primary,
              boxShadow: theme.shadows.brand,
              display: 'inline-flex',
              alignItems: 'center',
              gap: theme.semanticSpacing.sm,
              width: '100%',
              maxWidth: '200px',
              justifyContent: 'center',
              padding: `${theme.semanticSpacing.md} ${theme.semanticSpacing.lg}`,
            }}
          >
            <span>Start Building</span>
            <ArrowRight size={20} />
          </motion.button>
          
          <motion.button
            onClick={() => {
              analytics.trackButtonClick('View Documentation', 'hero', 'secondary_cta');
              analytics.trackCTA('View Documentation', 'hero_secondary', 'click');
              // Navigate to documentation
              window.location.href = '/api';
            }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            style={{
              ...styles.button.secondary,
              width: '100%',
              maxWidth: '200px',
              justifyContent: 'center',
              padding: `${theme.semanticSpacing.md} ${theme.semanticSpacing.lg}`,
            }}
          >
            View Documentation
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{
            color: theme.colors.textTertiary,
            fontSize: theme.typography.fontSize.sm,
            paddingLeft: '1rem',
            paddingRight: '1rem',
          }}
        >
          Trusted by AI researchers and developers worldwide
        </motion.div>
      </div>

      {/* Scroll Indicator - Hidden on mobile */}
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

export default Hero;