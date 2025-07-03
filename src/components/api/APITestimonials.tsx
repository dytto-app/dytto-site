import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useTheme } from '../ThemeProvider';
import { useThemeStyles } from '../../hooks/useThemeStyles';

const testimonials = [
  {
    name: 'Dr. Sarah Chen',
    role: 'Research Director',
    company: 'Stanford AI Lab',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    content: 'Dytto has revolutionized how we conduct behavioral research. The ability to generate diverse, anonymized personas while maintaining statistical validity is unprecedented.',
    rating: 5,
    category: 'Research'
  },
  {
    name: 'Marcus Rodriguez',
    role: 'VP of Engineering',
    company: 'TechFlow Solutions',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    content: 'The API integration was seamless, and the context-aware responses have improved our user engagement by 40%. The developer experience is exceptional.',
    rating: 5,
    category: 'Enterprise'
  },
  {
    name: 'Dr. Emily Watson',
    role: 'Chief Data Scientist',
    company: 'HealthTech Innovations',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    content: 'Privacy-first approach combined with powerful AI capabilities makes Dytto perfect for healthcare applications. Patient outcomes have improved significantly.',
    rating: 5,
    category: 'Healthcare'
  },
  {
    name: 'Alex Thompson',
    role: 'Product Manager',
    company: 'EduLearn Platform',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    content: 'Our adaptive learning platform has seen incredible results. Students are 60% more engaged, and learning outcomes have improved across all demographics.',
    rating: 5,
    category: 'Education'
  },
  {
    name: 'Lisa Park',
    role: 'Head of Personalization',
    company: 'RetailMax',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    content: 'The personalization capabilities are mind-blowing. Our conversion rates increased by 35% within the first month of implementation.',
    rating: 5,
    category: 'E-commerce'
  },
  {
    name: 'James Wilson',
    role: 'CTO',
    company: 'GameStudio Pro',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    content: 'Dynamic difficulty adjustment and personalized content generation have transformed our player experience. Retention is up 55%.',
    rating: 5,
    category: 'Gaming'
  }
];

const APITestimonials = () => {
  const { theme } = useTheme();
  const styles = useThemeStyles();

  return (
    <section style={styles.bg.primary} className="py-16 sm:py-32">
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
            Trusted by{' '}
            <motion.span 
              key={`testimonials-gradient-${theme.mode}`}
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
              innovators
            </motion.span>
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
            Leading organizations across industries trust Dytto to power their 
            context-aware AI applications and drive meaningful results.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
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
                position: 'relative',
              }}
              className="hover:shadow-lg"
            >
              <div 
                style={{
                  position: 'absolute',
                  top: theme.semanticSpacing.lg,
                  right: theme.semanticSpacing.lg,
                  width: '2.5rem',
                  height: '2.5rem',
                  backgroundColor: theme.utils.alpha(theme.colors.primary, 0.1),
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Quote style={{ color: theme.colors.primary }} size={16} />
              </div>

              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star 
                    key={i} 
                    style={{ color: theme.colors.primary }} 
                    size={16} 
                    className="fill-current" 
                  />
                ))}
              </div>

              <p 
                style={{
                  ...styles.typography.body,
                  color: theme.colors.textSecondary,
                  lineHeight: '1.6',
                  marginBottom: theme.semanticSpacing.lg,
                }}
              >
                "{testimonial.content}"
              </p>

              <div className="flex items-center space-x-4">
                <img 
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  style={{
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
                <div>
                  <div 
                    style={{
                      ...styles.typography.body,
                      color: theme.colors.text,
                      fontWeight: theme.typography.fontWeight.semibold,
                      marginBottom: theme.semanticSpacing.xs,
                    }}
                  >
                    {testimonial.name}
                  </div>
                  <div 
                    style={{
                      ...styles.typography.caption,
                      color: theme.colors.textSecondary,
                      marginBottom: theme.semanticSpacing.xs,
                    }}
                  >
                    {testimonial.role}
                  </div>
                  <div 
                    style={{
                      ...styles.typography.caption,
                      color: theme.colors.primary,
                      fontWeight: theme.typography.fontWeight.medium,
                    }}
                  >
                    {testimonial.company}
                  </div>
                </div>
              </div>

              <div 
                style={{
                  position: 'absolute',
                  bottom: theme.semanticSpacing.lg,
                  right: theme.semanticSpacing.lg,
                  backgroundColor: theme.utils.alpha(theme.colors.primary, 0.1),
                  color: theme.colors.primary,
                  padding: `${theme.semanticSpacing.xs} ${theme.semanticSpacing.sm}`,
                  borderRadius: '9999px',
                  fontSize: theme.typography.fontSize.xs,
                  fontWeight: theme.typography.fontWeight.medium,
                }}
              >
                {testimonial.category}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12 sm:mt-16"
        >
          <div 
            style={{
              ...styles.glass.light,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '1.5rem',
              padding: theme.semanticSpacing.lg,
              maxWidth: '48rem',
              margin: '0 auto',
            }}
          >
            <h3 
              style={{
                ...styles.typography.h3,
                color: theme.colors.text,
                marginBottom: theme.semanticSpacing.md,
                fontSize: 'clamp(1.25rem, 4vw, 1.875rem)',
              }}
            >
              Join the Developer Community
            </h3>
            <p 
              style={{
                ...styles.typography.body,
                color: theme.colors.textSecondary,
                marginBottom: theme.semanticSpacing.lg,
              }}
            >
              Connect with other developers and researchers building the future of context-aware AI
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button style={styles.button.primary}>
                Join Discord Community
              </button>
              <button style={styles.button.secondary}>
                Share Your Story
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default APITestimonials;