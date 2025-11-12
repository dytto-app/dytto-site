import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useTheme } from '../ThemeProvider';
import { useThemeStyles } from '../../hooks/useThemeStyles';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Creative Professional',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    content: 'Dytto has completely changed how I reflect on my daily experiences. The AI-generated stories are incredibly insightful and help me see patterns I never noticed before.',
    rating: 5,
    category: 'Personal Use'
  },
  {
    name: 'Michael Chen',
    role: 'Digital Nomad',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    content: 'As someone who travels constantly, Dytto helps me capture and remember all the amazing places and experiences. The location-based insights are spot on.',
    rating: 5,
    category: 'Travel'
  },
  {
    name: 'Emma Rodriguez',
    role: 'Student',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    content: 'The personalized news feed is amazing! It actually learns what I care about and shows me content that matters. Much better than other news apps.',
    rating: 5,
    category: 'Education'
  },
  {
    name: 'David Park',
    role: 'Photographer',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    content: 'The way Dytto organizes my photos and creates stories around them is incredible. It\'s like having a personal curator for my life.',
    rating: 5,
    category: 'Creative'
  },
  {
    name: 'Lisa Thompson',
    role: 'Working Parent',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    content: 'With my busy schedule, Dytto helps me remember the little moments that matter. The daily summaries are perfect for staying connected to my life.',
    rating: 5,
    category: 'Lifestyle'
  },
  {
    name: 'James Wilson',
    role: 'Fitness Enthusiast',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    content: 'The insights about my daily routines and habits have been eye-opening. Dytto helps me understand my patterns and make better choices.',
    rating: 5,
    category: 'Health'
  }
];

const AppTestimonials = () => {
  const { theme } = useTheme();
  const styles = useThemeStyles();

  return (
    <section id="testimonials" style={styles.bg.primary} className="py-16 sm:py-32">
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
            Loved by{' '}
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
              users worldwide
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
            Join thousands of users who have transformed their daily experiences 
            with Dytto's intelligent context understanding.
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
                    }}
                  >
                    {testimonial.role}
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
              Ready to transform your daily experiences?
            </h3>
            <p 
              style={{
                ...styles.typography.body,
                color: theme.colors.textSecondary,
                marginBottom: theme.semanticSpacing.lg,
              }}
            >
              Join the community of users discovering meaningful insights about their lives
            </p>
            <a
              href="https://apps.apple.com/us/app/dytto-journal/id6745741994"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...styles.button.primary,
                boxShadow: theme.shadows.brand,
                width: '100%',
                maxWidth: '200px',
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Download Now
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AppTestimonials;