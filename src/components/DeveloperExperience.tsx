import React from 'react';
import { motion } from 'framer-motion';
import { Code2, BookOpen, Zap, Users, Shield, Cpu } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useThemeStyles } from '../hooks/useThemeStyles';

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
    <section id="developers" style={styles.bg.secondary} className="py-32">
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
            }}
          >
            Everything you need to integrate context-aware AI into your applications. 
            From simple API calls to complex persona interactions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
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
                size={32} 
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
            padding: theme.semanticSpacing.xl,
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 
                style={{
                  ...styles.typography.h3,
                  color: theme.colors.text,
                  marginBottom: theme.semanticSpacing.lg,
                }}
              >
                Get started in minutes
              </h3>
              <div className="space-y-4">
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
                        width: '2rem',
                        height: '2rem',
                        backgroundColor: theme.colors.primary,
                        color: theme.colors.background,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: theme.typography.fontSize.sm,
                        fontWeight: theme.typography.fontWeight.semibold,
                      }}
                    >
                      {index + 1}
                    </div>
                    <span style={{ color: theme.colors.textSecondary }}>
                      {step}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div 
              style={{
                backgroundColor: theme.utils.alpha(theme.colors.text, 0.5),
                borderRadius: '1rem',
                padding: theme.semanticSpacing.lg,
              }}
            >
              <div className="flex items-center space-x-2 mb-4">
                <div style={{ width: '0.75rem', height: '0.75rem', backgroundColor: '#ef4444', borderRadius: '50%' }} />
                <div style={{ width: '0.75rem', height: '0.75rem', backgroundColor: '#f59e0b', borderRadius: '50%' }} />
                <div style={{ width: '0.75rem', height: '0.75rem', backgroundColor: '#10b981', borderRadius: '50%' }} />
                <span style={{ color: theme.colors.textSecondary, fontSize: theme.typography.fontSize.sm, marginLeft: theme.semanticSpacing.sm }}>
                  Terminal
                </span>
              </div>
              <pre 
                style={{
                  color: '#10b981',
                  fontSize: theme.typography.fontSize.sm,
                  fontFamily: theme.typography.fontFamily.mono,
                  margin: 0,
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center space-x-4">
            <button 
              style={{
                ...styles.button.primary,
                boxShadow: theme.shadows.brand,
              }}
            >
              View Documentation
            </button>
            <button style={styles.button.secondary}>
              Join Discord
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DeveloperExperience;