import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Star, MapPin, Apple, Play } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useThemeStyles } from '../hooks/useThemeStyles';

const features = [
  {
    icon: Calendar,
    title: 'Daily Context Collection',
    description: 'Automatically captures your photos, places, and activities'
  },
  {
    icon: Star,
    title: 'AI-Powered Stories',
    description: 'Transforms your day into meaningful narratives'
  },
  {
    icon: MapPin,
    title: 'Smart Recommendations',
    description: 'Personalized suggestions based on your context'
  }
];

const AppShowcase = () => {
  const { theme } = useTheme();
  const styles = useThemeStyles();

  return (
    <section style={styles.bg.secondary} className="py-32">
      <div className="max-w-7xl mx-auto px-6">
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
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            }}
          >
            Experience{' '}
            <motion.span 
              key={`app-gradient-${theme.mode}`}
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
              Dytto
            </motion.span>{' '}
            on mobile
          </h2>
          <p 
            style={{
              ...styles.typography.bodyLarge,
              color: theme.colors.textSecondary,
              maxWidth: '48rem',
              margin: '0 auto',
            }}
          >
            Our flagship app demonstrates the power of context-aware AI. 
            Transform your daily experiences into meaningful stories and insights.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* App Screenshots */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="flex justify-center space-x-4">
              {/* Phone mockups with screenshots */}
              <div className="relative">
                <div 
                  className="w-64 h-[520px] rounded-[3rem] p-2 shadow-2xl"
                  style={{ backgroundColor: theme.colors.text }}
                >
                  <div 
                    className="w-full h-full rounded-[2.5rem] overflow-hidden"
                    style={{ backgroundColor: theme.colors.background }}
                  >
                    <img 
                      src="/home.jpg"
                      alt="Dytto Home Screen"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                {/* Floating elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{
                    position: 'absolute',
                    top: '-1rem',
                    right: '-1rem',
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.background,
                    padding: `${theme.semanticSpacing.xs} ${theme.semanticSpacing.sm}`,
                    borderRadius: '9999px',
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: theme.typography.fontWeight.semibold,
                  }}
                >
                  Today: 9 Photos
                </motion.div>
              </div>
              
              <div className="relative mt-8">
                <div 
                  className="w-64 h-[520px] rounded-[3rem] p-2 shadow-2xl"
                  style={{ backgroundColor: theme.colors.text }}
                >
                  <div 
                    className="w-full h-full rounded-[2.5rem] overflow-hidden"
                    style={{ backgroundColor: theme.colors.background }}
                  >
                    <img 
                      src="/story.jpg"
                      alt="Dytto Story Screen"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  style={{
                    position: 'absolute',
                    top: '-1rem',
                    left: '-1rem',
                    backgroundColor: theme.colors.surface,
                    color: theme.colors.primary,
                    padding: `${theme.semanticSpacing.xs} ${theme.semanticSpacing.sm}`,
                    borderRadius: '9999px',
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: theme.typography.fontWeight.semibold,
                    border: `1px solid ${theme.colors.primary}`,
                  }}
                >
                  AI Generated
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Features and Download */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h3 
                style={{
                  ...styles.typography.h3,
                  color: theme.colors.text,
                  marginBottom: theme.semanticSpacing.lg,
                }}
              >
                Your life, intelligently understood
              </h3>
              <p 
                style={{
                  ...styles.typography.bodyLarge,
                  color: theme.colors.textSecondary,
                  lineHeight: '1.6',
                  marginBottom: theme.semanticSpacing.xl,
                }}
              >
                Dytto automatically collects context from your daily life and uses advanced AI 
                to generate meaningful stories, provide personalized recommendations, and help 
                you reflect on your experiences.
              </p>
            </div>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-start space-x-4"
                >
                  <div 
                    style={{
                      width: '3rem',
                      height: '3rem',
                      backgroundColor: theme.utils.alpha(theme.colors.primary, 0.1),
                      border: `1px solid ${theme.utils.alpha(theme.colors.primary, 0.3)}`,
                      borderRadius: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <feature.icon style={{ color: theme.colors.primary }} size={24} />
                  </div>
                  <div>
                    <h4 
                      style={{
                        ...styles.typography.h6,
                        color: theme.colors.text,
                        marginBottom: theme.semanticSpacing.sm,
                      }}
                    >
                      {feature.title}
                    </h4>
                    <p style={{ ...styles.typography.body, color: theme.colors.textSecondary }}>
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div style={{ paddingTop: theme.semanticSpacing.xl }}>
              <div className="flex flex-col sm:flex-row gap-4">
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
                  }}
                >
                  <Play size={20} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: theme.typography.fontSize.xs, opacity: 0.7 }}>Get it on</div>
                    <div style={{ fontSize: theme.typography.fontSize.sm, fontWeight: theme.typography.fontWeight.semibold }}>Google Play</div>
                  </div>
                </motion.button>
              </div>
              
              <div 
                className="flex items-center space-x-2 mt-4"
                style={{
                  color: theme.colors.textSecondary,
                  fontSize: theme.typography.fontSize.sm,
                }}
              >
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} style={{ color: theme.colors.primary }} className="fill-current" />
                  ))}
                </div>
                <span>4.8 • 10K+ downloads</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AppShowcase;
