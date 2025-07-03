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
    <section id="features" style={styles.bg.secondary} className="py-12 sm:py-16 lg:py-24 mobile-safe">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <h2 
            className="responsive-heading font-bold mb-4 sm:mb-6 mobile-text"
            style={{ color: theme.colors.text }}
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
            className="responsive-body max-w-3xl mx-auto leading-relaxed mobile-text"
            style={{ color: theme.colors.textSecondary }}
          >
            Experience the power of context-aware AI through features designed 
            to enhance your daily life and help you discover meaningful insights.
          </p>
        </motion.div>

        {/* Features Grid - Mobile First Design */}
        <div className="space-y-4 sm:space-y-6 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0 xl:grid-cols-3 xl:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -2 }}
              className="group mobile-grid-item feature-card"
              style={{
                ...styles.glass.light,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '1rem',
                padding: '1.5rem',
                transition: 'all 0.3s ease',
                backgroundColor: theme.colors.surface,
              }}
            >
              {/* Mobile-First Layout: Icon and Title in Row */}
              <div className="flex items-start space-x-4 mb-3">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  className="flex-shrink-0"
                  style={{
                    width: '3rem',
                    height: '3rem',
                    backgroundColor: feature.bgColor,
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <feature.icon style={{ color: feature.color }} size={24} />
                </motion.div>
                
                <div className="flex-1 min-w-0">
                  <h3 
                    className="text-lg sm:text-xl font-semibold mb-2 leading-tight mobile-text"
                    style={{ color: theme.colors.text }}
                  >
                    {feature.title}
                  </h3>
                </div>
              </div>

              {/* Description - Full Width on Mobile */}
              <p 
                className="text-sm sm:text-base leading-relaxed mobile-text force-break-text"
                style={{ 
                  color: theme.colors.textSecondary,
                  lineHeight: '1.6'
                }}
              >
                {feature.description}
              </p>

              {/* Hover Effect Indicator */}
              <motion.div
                initial={{ width: 0 }}
                whileHover={{ width: '2rem' }}
                transition={{ duration: 0.3 }}
                style={{
                  height: '2px',
                  backgroundColor: feature.color,
                  borderRadius: '1px',
                  marginTop: '1rem',
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Call to Action - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-8 sm:mt-12 lg:mt-16"
        >
          <motion.button 
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto px-6 sm:px-8 py-4 rounded-xl text-base sm:text-lg font-semibold transition-all duration-300 mobile-buttons"
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.background,
              boxShadow: theme.shadows.brand,
              border: 'none',
              cursor: 'pointer',
              maxWidth: '280px',
            }}
          >
            Download Dytto App
          </motion.button>
          
          {/* Trust Indicator - Mobile Friendly */}
          <p 
            className="mt-4 text-sm mobile-text"
            style={{ color: theme.colors.textTertiary }}
          >
            Free to download • Available on iOS & Android
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AppFeatures;