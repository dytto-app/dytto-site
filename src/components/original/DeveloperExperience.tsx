'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Code2, BookOpen, Zap, Users, Shield, Cpu } from 'lucide-react';
import { useTheme } from '@/components/shared/ThemeProvider';
import { useThemeStyles } from '@/hooks/useThemeStyles';

const features = [
  {
    icon: Code2,
    title: 'RESTful APIs',
    description: 'Clean, intuitive endpoints with comprehensive OpenAPI documentation'
  },
  {
    icon: Shield,
    title: 'OAuth 2.0 Security',
    description: 'Industry-standard authentication with fine-grained scope control'
  },
  {
    icon: Zap,
    title: 'Real-time Processing',
    description: 'Async operations with Celery for heavy computational tasks'
  },
  {
    icon: BookOpen,
    title: 'Rich Documentation',
    description: 'Interactive docs, code examples, and comprehensive guides'
  },
  {
    icon: Users,
    title: 'SDKs & Libraries',
    description: 'Official SDKs for Python, JavaScript, and more coming soon'
  },
  {
    icon: Cpu,
    title: 'Scalable Infrastructure',
    description: 'Built on modern stack with Redis caching and vector databases'
  }
];

const DeveloperExperience = () => {
  const { theme } = useTheme();
  const styles = useThemeStyles();

  return (
    <section id="developers" style={styles.bg.secondary} className="py-16 sm:py-32">
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
            Built for{' '}
            <motion.span 
              key={`developers-gradient-${theme.mode}`}
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
              developers
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
            Everything you need to integrate context-aware AI into your applications. 
            From simple API calls to complex persona interactions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12 sm:mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              style={{
                ...styles.glass.light,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '1rem',
                padding: theme.semanticSpacing.lg,
                transition: theme.animations.transition.normal,
              }}
              className="hover:shadow-md"
            >
              <feature.icon 
                style={{ color: theme.colors.primary, marginBottom: theme.semanticSpacing.md }} 
                size={28} 
              />
              <h3 
                style={{
                  ...styles.typography.h5,
                  color: theme.colors.text,
                  marginBottom: theme.semanticSpacing.sm,
                }}
              >
                {feature.title}
              </h3>
              <p 
                style={{
                  ...styles.typography.body,
                  color: theme.colors.textSecondary,
                  lineHeight: '1.6',
                }}
              >
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            ...styles.glass.medium,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '1.5rem',
            padding: theme.semanticSpacing.lg,
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
            <div className="order-2 lg:order-1">
              <h3 
                style={{
                  ...styles.typography.h3,
                  color: theme.colors.text,
                  marginBottom: theme.semanticSpacing.lg,
                  fontSize: 'clamp(1.5rem, 5vw, 1.875rem)',
                }}
              >
                Get started in minutes
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {[
                  'Sign up and get your API key',
                  'Install our SDK or use direct REST calls',
                  'Start with simulation agents or persona queries',
                  'Scale to production with enterprise features'
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <div 
                      style={{
                        width: '1.75rem',
                        height: '1.75rem',
                        backgroundColor: theme.colors.primary,
                        color: theme.colors.background,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: theme.typography.fontSize.sm,
                        fontWeight: theme.typography.fontWeight.semibold,
                        flexShrink: 0,
                      }}
                    >
                      {index + 1}
                    </div>
                    <span 
                      style={{ 
                        color: theme.colors.textSecondary,
                        fontSize: theme.typography.fontSize.sm,
                      }}
                    >
                      {step}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div 
              className="order-1 lg:order-2"
              style={{
                backgroundColor: theme.mode === 'light' ? '#1a1a1a' : '#0a0a0a',
                borderRadius: '1rem',
                padding: theme.semanticSpacing.md,
                border: `1px solid ${theme.mode === 'light' ? '#333' : '#444'}`,
                overflow: 'hidden',
              }}
            >
              <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                <div style={{ width: '0.75rem', height: '0.75rem', backgroundColor: '#ef4444', borderRadius: '50%' }} />
                <div style={{ width: '0.75rem', height: '0.75rem', backgroundColor: '#f59e0b', borderRadius: '50%' }} />
                <div style={{ width: '0.75rem', height: '0.75rem', backgroundColor: '#10b981', borderRadius: '50%' }} />
                <span 
                  style={{ 
                    color: '#9ca3af', 
                    fontSize: 'clamp(0.75rem, 3vw, 0.875rem)',
                    marginLeft: theme.semanticSpacing.sm 
                  }}
                >
                  Terminal
                </span>
              </div>
              <div className="overflow-x-auto">
                <pre 
                  style={{
                    color: '#10b981',
                    fontSize: 'clamp(0.75rem, 3vw, 0.875rem)',
                    fontFamily: theme.typography.fontFamily.mono,
                    margin: 0,
                    lineHeight: '1.4',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
{`$ npm install @dytto/sdk

$ dytto auth login
✓ Authenticated successfully

$ dytto generate agents --count 10
✓ Generated 10 simulation agents
✓ Saved to agents.json`}
                </pre>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12 sm:mt-16"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button 
              style={{
                ...styles.button.primary,
                boxShadow: theme.shadows.brand,
                width: '100%',
                maxWidth: '200px',
              }}
            >
              View Documentation
            </button>
            <button 
              style={{
                ...styles.button.secondary,
                width: '100%',
                maxWidth: '200px',
              }}
            >
              Join Discord
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DeveloperExperience;