import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, ArrowRight, Star, Apple, Play } from 'lucide-react';
import { useTheme } from '../ThemeProvider';
import { useThemeStyles } from '../../hooks/useThemeStyles';

const AppHero = () => {
  const { theme } = useTheme();
  const styles = useThemeStyles();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-24 px-4 sm:px-6">
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

      {/* Floating Elements - Only show on larger screens */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute top-32 right-8 rounded-2xl p-4 hidden lg:block"
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
        className="absolute top-48 left-8 rounded-2xl p-4 hidden lg:block"
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
      <div className="relative z-10 text-center max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 sm:mb-8"
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
              Mobile App Experience
            </span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight"
          style={{ color: theme.colors.text }}
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
          className="text-lg sm:text-xl lg:text-2xl mb-8 sm:mb-12 leading-relaxed max-w-3xl mx-auto"
          style={{ color: theme.colors.textSecondary }}
        >
          Dytto transforms your daily experiences into meaningful stories and insights. 
          Automatically capture context, generate AI-powered narratives, and discover 
          personalized recommendations that truly understand you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 sm:mb-12"
        >
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-medium transition-all duration-300"
            style={{
              backgroundColor: theme.colors.text,
              border: `1px solid ${theme.colors.border}`,
              color: theme.colors.background,
              minHeight: '56px',
            }}
          >
            <Apple size={24} />
            <div className="text-left">
              <div className="text-xs opacity-70">Download on the</div>
              <div className="text-sm font-semibold">App Store</div>
            </div>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-medium transition-all duration-300"
            style={{
              backgroundColor: theme.colors.text,
              border: `1px solid ${theme.colors.border}`,
              color: theme.colors.background,
              minHeight: '56px',
            }}
          >
            <Play size={24} />
            <div className="text-left">
              <div className="text-xs opacity-70">Get it on</div>
              <div className="text-sm font-semibold">Google Play</div>
            </div>
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center space-x-2 text-sm"
          style={{ color: theme.colors.textTertiary }}
        >
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} style={{ color: theme.colors.primary }} className="fill-current" />
            ))}
          </div>
          <span>4.8 • 10K+ downloads • Free to use</span>
        </motion.div>
      </div>

      {/* Scroll Indicator - Only show on desktop */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden lg:block"
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