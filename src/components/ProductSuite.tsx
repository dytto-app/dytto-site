import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Newspaper, Brain } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useThemeStyles } from '../hooks/useThemeStyles';

const features = [
  {
    icon: BookOpen,
    name: 'Memories',
    description: 'AI-powered story generation from your daily experiences',
    features: ['Automatic context collection', 'Smart narrative generation', 'Personal insights', 'Timeline view'],
    image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    icon: Newspaper,
    name: 'News Feed',
    description: 'Personalized news consumption tailored to your interests',
    features: ['Personalized feed', 'Smart briefs', 'Context-aware ranking', 'Interest tracking'],
    image: 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    icon: Brain,
    name: 'AI Insights',
    description: 'Intelligent analysis of your context and preferences',
    features: ['Behavioral patterns', 'Preference learning', 'Smart recommendations', 'Context understanding'],
    image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

const ProductSuite = () => {
  const { theme } = useTheme();
  const styles = useThemeStyles();

  return (
    <section id="products" style={styles.bg.primary} className="py-32">
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
            The{' '}
            <motion.span 
              key={`products-gradient-${theme.mode}`}
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
              Dytto app
            </motion.span>
          </h2>
          <p 
            style={{
              ...styles.typography.bodyLarge,
              color: theme.colors.textSecondary,
              maxWidth: '48rem',
              margin: '0 auto',
            }}
          >
            Experience the power of context-aware AI through our flagship mobile application. 
            Three core features that showcase intelligent user understanding.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              style={{
                ...styles.glass.light,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '1.5rem',
                overflow: 'hidden',
                transition: theme.animations.transition.normal,
              }}
              className="hover:shadow-lg"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={feature.image} 
                  alt={feature.name}
                  className="w-full h-full object-cover"
                />
                <div 
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to top, ${theme.utils.alpha(theme.colors.surface, 0.8)}, transparent)`,
                  }}
                />
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    width: '3rem',
                    height: '3rem',
                    background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <feature.icon style={{ color: theme.colors.background }} size={24} />
                </motion.div>
              </div>

              <div style={{ padding: theme.semanticSpacing.xl }}>
                <h3 
                  style={{
                    ...styles.typography.h4,
                    color: theme.colors.text,
                    marginBottom: theme.semanticSpacing.sm,
                  }}
                >
                  {feature.name}
                </h3>
                <p 
                  style={{
                    ...styles.typography.body,
                    color: theme.colors.textSecondary,
                    lineHeight: '1.6',
                    marginBottom: theme.semanticSpacing.lg,
                  }}
                >
                  {feature.description}
                </p>

                <div className="space-y-3">
                  {feature.features.map((featureItem, featureIndex) => (
                    <motion.div
                      key={featureIndex}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: featureIndex * 0.1 }}
                      className="flex items-center space-x-3"
                    >
                      <div 
                        style={{
                          width: '0.5rem',
                          height: '0.5rem',
                          backgroundColor: theme.colors.primary,
                          borderRadius: '50%',
                        }}
                      />
                      <span 
                        style={{
                          ...styles.typography.caption,
                          color: theme.colors.textSecondary,
                        }}
                      >
                        {featureItem}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <div 
            style={{
              ...styles.glass.light,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '1.5rem',
              padding: theme.semanticSpacing.xl,
              maxWidth: '32rem',
              margin: '0 auto',
            }}
          >
            <h3 
              style={{
                ...styles.typography.h4,
                color: theme.colors.text,
                marginBottom: theme.semanticSpacing.md,
              }}
            >
              Build your own applications
            </h3>
            <p 
              style={{
                ...styles.typography.body,
                color: theme.colors.textSecondary,
                marginBottom: theme.semanticSpacing.lg,
              }}
            >
              Use Dytto's context platform to create your own intelligent applications. 
              From research tools to personalized experiences.
            </p>
            <button 
              style={{
                ...styles.button.primary,
                boxShadow: theme.shadows.brand,
              }}
            >
              Start Building
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductSuite;