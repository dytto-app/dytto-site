import React from 'react';
import { motion } from 'framer-motion';
import { Camera, BookOpen, Newspaper, Brain, MapPin, Clock } from 'lucide-react';
import { useTheme } from '../ThemeProvider';
import { useThemeStyles } from '../../hooks/useThemeStyles';

const features = [
  {
    icon: Camera,
    title: 'Automatic Context Collection',
    description: 'Seamlessly captures your photos, locations, and activities throughout the day.',
    color: '#3B82F6',
    bgColor: 'rgba(59, 130, 246, 0.1)'
  },
  {
    icon: BookOpen,
    title: 'AI-Powered Stories',
    description: 'Transforms your daily experiences into meaningful, personalized narratives.',
    color: '#8B5CF6',
    bgColor: 'rgba(139, 92, 246, 0.1)'
  },
  {
    icon: Newspaper,
    title: 'Personalized News Feed',
    description: 'Curated content that adapts to your interests and reading preferences.',
    color: '#EF4444',
    bgColor: 'rgba(239, 68, 68, 0.1)'
  },
  {
    icon: Brain,
    title: 'Smart Insights',
    description: 'Discover patterns and insights about your lifestyle and preferences.',
    color: '#F59E0B',
    bgColor: 'rgba(245, 158, 11, 0.1)'
  },
  {
    icon: MapPin,
    title: 'Location Intelligence',
    description: 'Context-aware recommendations based on where you are and where you go.',
    color: '#10B981',
    bgColor: 'rgba(16, 185, 129, 0.1)'
  },
  {
    icon: Clock,
    title: 'Timeline View',
    description: 'Beautiful chronological view of your memories and experiences.',
    color: '#6366F1',
    bgColor: 'rgba(99, 102, 241, 0.1)'
  }
];

const AppFeatures = () => {
  const { theme } = useTheme();
  const styles = useThemeStyles();

  return (
    <section id="features" style={styles.bg.secondary} className="py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header - Simplified for Mobile */}
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
            Intelligent{' '}
            <motion.span 
              key={`features-gradient-${theme.mode}`}
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
              features
            </motion.span>{' '}
            that understand you
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
            Experience the power of context-aware AI through features designed 
            to enhance your daily life and help you discover meaningful insights.
          </p>
        </motion.div>

        {/* Features - Mobile-First Single Column */}
        <div className="space-y-6 sm:space-y-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -2 }}
              style={{
                ...styles.glass.light,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '1.25rem',
                padding: '1.5rem',
                transition: 'all 0.3s ease',
                backgroundColor: theme.colors.surface,
              }}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  style={{
                    width: '3.5rem',
                    height: '3.5rem',
                    backgroundColor: feature.bgColor,
                    borderRadius: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <feature.icon style={{ color: feature.color }} size={24} />
                </motion.div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 
                    style={{
                      color: theme.colors.text,
                      fontSize: 'clamp(1.125rem, 4vw, 1.25rem)',
                      fontWeight: theme.typography.fontWeight.semibold,
                      lineHeight: '1.3',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {feature.title}
                  </h3>
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

        {/* Call to Action - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-12 sm:mt-16"
        >
          <motion.button 
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.background,
              padding: '1rem 2rem',
              borderRadius: '0.75rem',
              fontSize: 'clamp(1rem, 3vw, 1.125rem)',
              fontWeight: theme.typography.fontWeight.semibold,
              border: 'none',
              cursor: 'pointer',
              boxShadow: theme.shadows.brand,
              transition: 'all 0.3s ease',
              width: '100%',
              maxWidth: '280px',
            }}
          >
            Download the dytto App
          </motion.button>
          
          {/* Trust Indicator */}
          <p 
            style={{ 
              color: theme.colors.textTertiary,
              fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
              marginTop: '1rem',
            }}
          >
            Free to download • Available on iOS & Android
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AppFeatures;
