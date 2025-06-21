import React from 'react';
import { motion } from 'framer-motion';
import { Database, Cloud, Cpu, Zap, Shield, Code } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useThemeStyles } from '../hooks/useThemeStyles';

const techCategories = [
  {
    title: 'AI & Machine Learning',
    icon: Cpu,
    technologies: [
      { name: 'OpenAI GPT-4', description: 'Advanced language understanding' },
      { name: 'Anthropic Claude', description: 'Context-aware reasoning' },
      { name: 'Vector Embeddings', description: 'Semantic similarity matching' },
      { name: 'Custom LLM Fine-tuning', description: 'Domain-specific optimization' }
    ]
  },
  {
    title: 'Data Infrastructure',
    icon: Database,
    technologies: [
      { name: 'PostgreSQL', description: 'Primary data storage' },
      { name: 'Redis', description: 'High-performance caching' },
      { name: 'Pinecone', description: 'Vector database for embeddings' },
      { name: 'Apache Kafka', description: 'Real-time data streaming' }
    ]
  },
  {
    title: 'Backend Services',
    icon: Cloud,
    technologies: [
      { name: 'Python FastAPI', description: 'High-performance API framework' },
      { name: 'Celery', description: 'Distributed task processing' },
      { name: 'Docker', description: 'Containerized deployments' },
      { name: 'Kubernetes', description: 'Orchestration and scaling' }
    ]
  },
  {
    title: 'Security & Privacy',
    icon: Shield,
    technologies: [
      { name: 'OAuth 2.0', description: 'Industry-standard authentication' },
      { name: 'End-to-end Encryption', description: 'Data protection in transit' },
      { name: 'Zero-trust Architecture', description: 'Comprehensive security model' },
      { name: 'GDPR Compliance', description: 'Privacy by design' }
    ]
  }
];

const TechStack = () => {
  const { theme } = useTheme();
  const styles = useThemeStyles();

  return (
    <section style={styles.bg.secondary} className="py-32">
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
            Built on{' '}
            <motion.span 
              key={`tech-gradient-${theme.mode}`}
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
              modern infrastructure
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
            Our platform leverages cutting-edge technologies to deliver reliable, 
            scalable, and secure AI context services at enterprise scale.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {techCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
              style={{
                ...styles.glass.light,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '1.5rem',
                padding: theme.semanticSpacing.xl,
              }}
            >
              <div className="flex items-center space-x-4 mb-6">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  style={{
                    width: '3.5rem',
                    height: '3.5rem',
                    backgroundColor: theme.utils.alpha(theme.colors.primary, 0.1),
                    border: `1px solid ${theme.utils.alpha(theme.colors.primary, 0.3)}`,
                    borderRadius: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <category.icon style={{ color: theme.colors.primary }} size={24} />
                </motion.div>
                <h3 
                  style={{
                    ...styles.typography.h4,
                    color: theme.colors.text,
                  }}
                >
                  {category.title}
                </h3>
              </div>

              <div className="space-y-4">
                {category.technologies.map((tech, techIndex) => (
                  <motion.div
                    key={techIndex}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: techIndex * 0.1 }}
                    className="flex items-start space-x-3"
                  >
                    <div 
                      style={{
                        width: '0.5rem',
                        height: '0.5rem',
                        backgroundColor: theme.colors.primary,
                        borderRadius: '50%',
                        marginTop: '0.5rem',
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <div 
                        style={{
                          ...styles.typography.body,
                          color: theme.colors.text,
                          fontWeight: theme.typography.fontWeight.medium,
                          marginBottom: theme.semanticSpacing.xs,
                        }}
                      >
                        {tech.name}
                      </div>
                      <div 
                        style={{
                          ...styles.typography.caption,
                          color: theme.colors.textSecondary,
                        }}
                      >
                        {tech.description}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div 
            style={{
              ...styles.glass.light,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '1.5rem',
              padding: theme.semanticSpacing.xl,
              maxWidth: '48rem',
              margin: '0 auto',
            }}
          >
            <div className="flex items-center justify-center space-x-4 mb-6">
              <Zap style={{ color: theme.colors.primary }} size={32} />
              <h3 
                style={{
                  ...styles.typography.h3,
                  color: theme.colors.text,
                }}
              >
                Performance Metrics
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { metric: '99.9%', label: 'Uptime SLA' },
                { metric: '<100ms', label: 'API Response' },
                { metric: '10M+', label: 'Requests/Day' },
                { metric: '24/7', label: 'Monitoring' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div 
                    style={{
                      ...styles.typography.h3,
                      color: theme.colors.primary,
                      marginBottom: theme.semanticSpacing.xs,
                    }}
                  >
                    {stat.metric}
                  </div>
                  <div 
                    style={{
                      ...styles.typography.caption,
                      color: theme.colors.textSecondary,
                    }}
                  >
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TechStack;