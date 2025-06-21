import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Book, MessageCircle } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useThemeStyles } from '../hooks/useThemeStyles';

const CallToAction = () => {
  const { theme } = useTheme();
  const styles = useThemeStyles();

  return (
    <section style={styles.bg.primary} className="py-32 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            background: [
              `radial-gradient(circle at 20% 20%, ${theme.utils.alpha(theme.colors.primary, 0.05)} 0%, transparent 50%)`,
              `radial-gradient(circle at 80% 80%, ${theme.utils.alpha(theme.colors.primary, 0.08)} 0%, transparent 50%)`,
              `radial-gradient(circle at 20% 80%, ${theme.utils.alpha(theme.colors.primary, 0.05)} 0%, transparent 50%)`,
              `radial-gradient(circle at 20% 20%, ${theme.utils.alpha(theme.colors.primary, 0.05)} 0%, transparent 50%)`
            ]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
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
              fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
              lineHeight: '1.1',
            }}
          >
            Ready to build{' '}
            <motion.span 
              key={`cta-gradient-${theme.mode}`}
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
              context-aware AI?
            </motion.span>
          </h2>
          <p 
            style={{
              ...styles.typography.bodyLarge,
              color: theme.colors.textSecondary,
              maxWidth: '48rem',
              margin: '0 auto',
              lineHeight: '1.6',
            }}
          >
            Join thousands of developers and researchers using Dytto to create 
            intelligent applications that truly understand their users.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Code,
              title: 'Start Building',
              description: 'Get your API key and start integrating context-aware AI into your applications.',
              action: 'Get API Key',
              primary: true
            },
            {
              icon: Book,
              title: 'Read the Docs',
              description: 'Comprehensive guides, API reference, and code examples to get you started.',
              action: 'View Documentation',
              primary: false
            },
            {
              icon: MessageCircle,
              title: 'Join Community',
              description: 'Connect with other developers, share ideas, and get support from our team.',
              action: 'Join Discord',
              primary: false
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              style={{
                ...styles.glass.light,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '1.5rem',
                padding: theme.semanticSpacing.xl,
                textAlign: 'center',
              }}
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '4rem',
                  height: '4rem',
                  backgroundColor: item.primary ? theme.colors.primary : theme.colors.surface,
                  borderRadius: '1rem',
                  marginBottom: theme.semanticSpacing.lg,
                }}
              >
                <item.icon 
                  style={{ color: item.primary ? theme.colors.background : theme.colors.text }} 
                  size={28} 
                />
              </motion.div>
              
              <h3 
                style={{
                  ...styles.typography.h4,
                  color: theme.colors.text,
                  marginBottom: theme.semanticSpacing.md,
                }}
              >
                {item.title}
              </h3>
              <p 
                style={{
                  ...styles.typography.body,
                  color: theme.colors.textSecondary,
                  lineHeight: '1.6',
                  marginBottom: theme.semanticSpacing.lg,
                }}
              >
                {item.description}
              </p>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: '100%',
                  padding: `${theme.semanticSpacing.sm} ${theme.semanticSpacing.md}`,
                  borderRadius: '0.75rem',
                  fontWeight: theme.typography.fontWeight.medium,
                  transition: theme.animations.transition.normal,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: theme.semanticSpacing.sm,
                  border: 'none',
                  cursor: 'pointer',
                  ...(item.primary
                    ? {
                        backgroundColor: theme.colors.primary,
                        color: theme.colors.background,
                      }
                    : {
                        backgroundColor: theme.colors.surface,
                        color: theme.colors.text,
                      }
                  ),
                }}
              >
                <span>{item.action}</span>
                <ArrowRight size={16} />
              </motion.button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <div 
            style={{
              ...styles.glass.light,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '1.5rem',
              padding: theme.semanticSpacing.xl,
              maxWidth: '64rem',
              margin: '0 auto',
            }}
          >
            <h3 
              style={{
                ...styles.typography.h3,
                color: theme.colors.text,
                marginBottom: theme.semanticSpacing.md,
              }}
            >
              Enterprise Solutions
            </h3>
            <p 
              style={{
                ...styles.typography.body,
                color: theme.colors.textSecondary,
                marginBottom: theme.semanticSpacing.lg,
              }}
            >
              Need custom integrations, dedicated support, or on-premise deployment? 
              Our enterprise team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  ...styles.button.primary,
                  boxShadow: theme.shadows.brand,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: theme.semanticSpacing.sm,
                }}
              >
                <span>Contact Sales</span>
                <ArrowRight size={20} />
              </motion.button>
              <div 
                style={{
                  color: theme.colors.textSecondary,
                  fontSize: theme.typography.fontSize.sm,
                }}
              >
                Custom pricing • Dedicated support • SLA guarantees
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;