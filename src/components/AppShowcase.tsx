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
    <section style={styles.bg.secondary} className="py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 
            style={{
              color: theme.colors.text,
              fontSize: 'clamp(1.75rem, 6vw, 3.5rem)',
              fontWeight: theme.typography.fontWeight.bold,
              lineHeight: '1.2',
              marginBottom: theme.semanticSpacing.md,
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
              color: theme.colors.textSecondary,
              fontSize: 'clamp(1rem, 3vw, 1.125rem)',
              lineHeight: '1.6',
              maxWidth: '42rem',
              margin: '0 auto',
            }}
          >
            Our flagship app demonstrates the power of context-aware AI. 
            Transform your daily experiences into meaningful stories and insights.
          </p>
        </motion.div>

        {/* Mobile-First Content Layout */}
        <div className="space-y-12 sm:space-y-16">
          
          {/* App Preview - Mobile Optimized */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div 
              style={{
                ...styles.glass.light,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '1.5rem',
                padding: '2rem 1.5rem',
                maxWidth: '28rem',
                margin: '0 auto',
              }}
            >
              {/* Single Phone Mockup - Properly Sized */}
              <div className="relative mx-auto" style={{ width: '200px', height: '400px' }}>
                <div 
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: theme.colors.text,
                    borderRadius: '2rem',
                    padding: '0.5rem',
                    boxShadow: theme.shadows.lg,
                  }}
                >
                  <div 
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: theme.colors.background,
                      borderRadius: '1.5rem',
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    <img 
                      src="/home.jpg"
                      alt="Dytto App Interface"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                </div>
                
                {/* Floating Badge */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{
                    position: 'absolute',
                    top: '-0.5rem',
                    right: '-0.5rem',
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.background,
                    padding: '0.5rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: theme.typography.fontWeight.semibold,
                    boxShadow: theme.shadows.md,
                  }}
                >
                  Live Demo
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Features List - Mobile Optimized */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 
              style={{
                color: theme.colors.text,
                fontSize: 'clamp(1.5rem, 5vw, 2rem)',
                fontWeight: theme.typography.fontWeight.semibold,
                textAlign: 'center',
                marginBottom: '2rem',
              }}
            >
              Your life, intelligently understood
            </h3>
            
            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  style={{
                    ...styles.glass.light,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '1rem',
                    padding: '1.5rem',
                  }}
                >
                  <div className="flex items-start gap-4">
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
                      <feature.icon style={{ color: theme.colors.primary }} size={20} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 
                        style={{
                          color: theme.colors.text,
                          fontSize: 'clamp(1.125rem, 4vw, 1.25rem)',
                          fontWeight: theme.typography.fontWeight.semibold,
                          marginBottom: '0.5rem',
                          lineHeight: '1.3',
                        }}
                      >
                        {feature.title}
                      </h4>
                      <p 
                        style={{
                          color: theme.colors.textSecondary,
                          fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                          lineHeight: '1.5',
                        }}
                      >
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Download Section - Mobile Optimized */}
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
                padding: '2rem 1.5rem',
              }}
            >
              <h3 
                style={{
                  color: theme.colors.text,
                  fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
                  fontWeight: theme.typography.fontWeight.semibold,
                  marginBottom: '1rem',
                }}
              >
                Ready to get started?
              </h3>
              <p 
                style={{
                  color: theme.colors.textSecondary,
                  fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                  marginBottom: '2rem',
                  lineHeight: '1.5',
                }}
              >
                Download Dytto and start discovering meaningful insights about your life
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.button
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
                  }}
                >
                  <Apple size={20} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Download on the</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: theme.typography.fontWeight.semibold }}>App Store</div>
                  </div>
                </motion.button>
                
                <motion.button
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
                  }}
                >
                  <Play size={20} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Get it on</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: theme.typography.fontWeight.semibold }}>Google Play</div>
                  </div>
                </motion.button>
              </div>
              
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginTop: '1.5rem',
                  color: theme.colors.textSecondary,
                  fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
                }}
              >
                <div className="flex items-center gap-1">
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