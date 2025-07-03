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
    gradient: 'from-blue-500 to-purple-600'
  },
  {
    icon: BookOpen,
    title: 'AI-Powered Stories',
    description: 'Transforms your daily experiences into meaningful, personalized narratives.',
    gradient: 'from-purple-500 to-pink-600'
  },
  {
    icon: Newspaper,
    title: 'Personalized News Feed',
    description: 'Curated content that adapts to your interests and reading preferences.',
    gradient: 'from-pink-500 to-red-600'
  },
  {
    icon: Brain,
    title: 'Smart Insights',
    description: 'Discover patterns and insights about your lifestyle and preferences.',
    gradient: 'from-red-500 to-orange-600'
  },
  {
    icon: MapPin,
    title: 'Location Intelligence',
    description: 'Context-aware recommendations based on where you are and where you go.',
    gradient: 'from-orange-500 to-yellow-600'
  },
  {
    icon: Clock,
    title: 'Timeline View',
    description: 'Beautiful chronological view of your memories and experiences.',
    gradient: 'from-yellow-500 to-green-600'
  }
];

const AppFeatures = () => {
  const { theme } = useTheme();
  const styles = useThemeStyles();

  return (
    <section id="features" style={styles.bg.secondary} className="py-16 sm:py-32 mobile-safe">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 
            style={{
              ...styles.typography.h1,
              color: theme.colors.text,
              marginBottom: theme.semanticSpacing.lg,
              fontSize: 'clamp(2rem, 6vw, 4rem)',
              paddingLeft: '1rem',
              paddingRight: '1rem',
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
              ...styles.typography.bodyLarge,
              color: theme.colors.textSecondary,
              maxWidth: '48rem',
              margin: '0 auto',
              paddingLeft: '1rem',
              paddingRight: '1rem',
            }}
          >
            Experience the power of context-aware AI through features designed 
            to enhance your daily life and help you discover meaningful insights.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              style={{
                ...styles.glass.light,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '1.5rem',
                padding: theme.semanticSpacing.lg,
                transition: theme.animations.transition.normal,
              }}
              className="hover:shadow-lg mobile-grid-item feature-card motion-safe"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '4rem',
                  height: '4rem',
                  background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
                  borderRadius: '1rem',
                  marginBottom: theme.semanticSpacing.lg,
                }}
              >
                <feature.icon style={{ color: theme.colors.background }} size={28} />
              </motion.div>
              
              <h3 
                style={{
                  ...styles.typography.h4,
                  color: theme.colors.text,
                  marginBottom: theme.semanticSpacing.md,
                }}
                className="mobile-text"
              >
                {feature.title}
              </h3>
              <p 
                style={{
                  ...styles.typography.body,
                  color: theme.colors.textSecondary,
                  lineHeight: '1.6',
                }}
                className="responsive-body mobile-text"
              >
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-12 sm:mt-16"
        >
          <button 
            style={{
              ...styles.button.primary,
              boxShadow: theme.shadows.brand,
            }}
          >
            Download Dytto App
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default AppFeatures;
