import React from 'react';
import { motion } from 'framer-motion';
import { Camera, BookOpen, MessageSquare, Brain, Sparkles } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useThemeStyles } from '../hooks/useThemeStyles';

const features = [
  {
    icon: Camera,
    title: "Beautiful Home Dashboard",
    description: "Your personal timeline at a glance with recent stories and daily insights.",
    image: "/IMG_4026.PNG"
  },
  {
    icon: MessageSquare,
    title: "Add Context with Comments",
    description: "Enhance your stories by adding context to help Dytto understand what matters.",
    image: "/IMG_4024.PNG"
  },
  {
    icon: BookOpen,
    title: "Beautifully Crafted Stories",
    description: "Discover thoughtfully written stories about your day with literary quality.",
    image: "/IMG_4021.PNG"
  },
  {
    icon: Sparkles,
    title: "Personalized Recommendations",
    description: "Get intelligent suggestions based on your patterns and preferences.",
    image: "/IMG_4025.PNG"
  },
  {
    icon: Brain,
    title: "Context-Aware AI Chat",
    description: "Chat with an AI that truly knows you and your life patterns.",
    image: "/IMG_3843.PNG"
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
            See{' '}
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
            in action
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
            Experience how Dytto transforms your daily life into beautiful stories and meaningful insights
          </p>
        </motion.div>

        {/* MOBILE LAYOUT (< 1024px) */}
        <div className="lg:hidden space-y-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              style={{
                ...styles.glass.light,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '1.5rem',
                padding: '1.5rem',
                overflow: 'hidden',
              }}
            >
              <div className="space-y-6">
                {/* Content Section */}
                <div className="flex items-start gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
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
                  </motion.div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 
                      style={{
                        color: theme.colors.text,
                        fontSize: 'clamp(1.125rem, 4vw, 1.375rem)',
                        fontWeight: theme.typography.fontWeight.semibold,
                        lineHeight: '1.3',
                        marginBottom: '0.75rem',
                      }}
                    >
                      {feature.title}
                    </h3>
                    <p 
                      style={{
                        color: theme.colors.textSecondary,
                        fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                        lineHeight: '1.6',
                      }}
                    >
                      {feature.description}
                    </p>
                  </div>
                </div>

                {/* Image Section - Mobile Optimized */}
                <div className="flex justify-center">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      width: '100%',
                      maxWidth: '280px',
                      height: '560px',
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
                      }}
                    >
                      <img 
                        src={feature.image}
                        alt={feature.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* DESKTOP LAYOUT (>= 1024px) */}
        <div className="hidden lg:block space-y-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex items-center gap-12"
              style={{
                flexDirection: index % 2 === 1 ? 'row-reverse' : 'row',
              }}
            >
              {/* Content Side */}
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    style={{
                      width: '4rem',
                      height: '4rem',
                      backgroundColor: theme.utils.alpha(theme.colors.primary, 0.1),
                      border: `1px solid ${theme.utils.alpha(theme.colors.primary, 0.3)}`,
                      borderRadius: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <feature.icon style={{ color: theme.colors.primary }} size={28} />
                  </motion.div>
                  
                  <h3 
                    style={{
                      color: theme.colors.text,
                      fontSize: '2rem',
                      fontWeight: theme.typography.fontWeight.bold,
                      lineHeight: '1.2',
                    }}
                  >
                    {feature.title}
                  </h3>
                </div>
                
                <p 
                  style={{
                    color: theme.colors.textSecondary,
                    fontSize: '1.125rem',
                    lineHeight: '1.7',
                    maxWidth: '32rem',
                  }}
                >
                  {feature.description}
                </p>
              </div>

              {/* Image Side */}
              <div className="flex-1 flex justify-center">
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    width: '320px',
                    height: '640px',
                    backgroundColor: theme.colors.text,
                    borderRadius: '3rem',
                    padding: '0.75rem',
                    boxShadow: theme.shadows.xl,
                  }}
                >
                  <div 
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: theme.colors.background,
                      borderRadius: '2.25rem',
                      overflow: 'hidden',
                    }}
                  >
                    <img 
                      src={feature.image}
                      alt={feature.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AppShowcase;