import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../components/ThemeProvider';
import { useThemeStyles } from '../hooks/useThemeStyles';
import EmailCapture from '../components/waitlist/EmailCapture';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Camera, BookOpen, MessageSquare, Brain, Sparkles } from 'lucide-react';

const WaitlistLandingPage = () => {
  const { theme } = useTheme();
  const styles = useThemeStyles();

  const features = [
    {
      icon: Camera,
      title: "Beautiful Home Dashboard",
      description: "Your personal timeline at a glance. See your recent stories, upcoming events, and daily insights all in one elegant interface.",
      image: "/IMG_4026.PNG"
    },
    {
      icon: MessageSquare,
      title: "Add Context with Simple Comments",
      description: "Enhance your stories by adding simple comments and context to your daily entries. Help Dytto understand what matters most to you.",
      image: "/IMG_4024.PNG"
    },
    {
      icon: BookOpen,
      title: "Beautifully Crafted Stories",
      description: "Every evening, discover a thoughtfully written story about your day. Each narrative captures the essence of your experiences with literary quality.",
      image: "/IMG_4021.PNG"
    },
    {
      icon: Sparkles,
      title: "Personalized Recommendations",
      description: "Get intelligent suggestions for places to visit, activities to try, and experiences to explore based on your patterns and preferences.",
      image: "/IMG_4025.PNG"
    },
    {
      icon: Brain,
      title: "Context-Aware AI Chat",
      description: "Chat with an AI that truly knows you. Ask questions about your past, get insights about your patterns, and receive personalized advice.",
      image: "/IMG_3843.PNG"
    }
  ];

  return (
    <div style={styles.bg.primary} className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 px-4 sm:px-6">
        {/* Background */}
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

        {/* Main Content */}
        <div className="relative z-10 w-full max-w-4xl mx-auto">
          <EmailCapture 
            source="waitlist-landing"
            onSuccess={(email, position) => {
              console.log(`User ${email} joined at position ${position}`);
            }}
            onError={(error) => {
              console.error('Waitlist signup error:', error);
            }}
          />
        </div>
      </section>

      {/* Features Section - RESPONSIVE DESIGN */}
      <section style={styles.bg.secondary} className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
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
              See what you'll get with{' '}
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
                Dytto
              </motion.span>
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
              Everything you need to capture, understand, and relive your life's moments
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
                {/* Mobile Layout: Icon + Text, then Image */}
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

                  {/* Image Section - Properly Sized for Mobile */}
                  <div className="flex justify-center">
                    <div 
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
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* DESKTOP LAYOUT (>= 1024px) - Original Design */}
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

          {/* Final CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center mt-16"
          >
            <div 
              style={{
                ...styles.glass.light,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '1.5rem',
                padding: '2rem 1.5rem',
                maxWidth: '32rem',
                margin: '0 auto',
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
                Ready to transform your daily life?
              </h3>
              <p 
                style={{
                  color: theme.colors.textSecondary,
                  fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                  marginBottom: '1.5rem',
                  lineHeight: '1.5',
                }}
              >
                Join the waitlist and be among the first to experience AI that truly understands you
              </p>
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
                  maxWidth: '240px',
                }}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Join Waitlist
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WaitlistLandingPage;