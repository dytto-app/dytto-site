import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, CheckCircle2, Key, Database } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useThemeStyles } from '../hooks/useThemeStyles';

const securityFeatures = [
  {
    icon: Shield,
    title: 'OAuth 2.0 Authentication',
    description: 'Industry-standard authentication with comprehensive scope management and token lifecycle control.'
  },
  {
    icon: Lock,
    title: 'Fine-grained Consent',
    description: 'Granular user consent management ensuring data access only with explicit permission.'
  },
  {
    icon: Eye,
    title: 'Comprehensive Auditing',
    description: 'Complete audit trails for all API interactions, data access, and system operations.'
  },
  {
    icon: Key,
    title: 'Data Anonymization',
    description: 'Advanced anonymization techniques for simulation agents protecting user privacy.'
  },
  {
    icon: Database,
    title: 'Secure Infrastructure',
    description: 'Enterprise-grade security with encrypted data storage and secure communication protocols.'
  }
];

const SecuritySection = () => {
  const { theme } = useTheme();
  const styles = useThemeStyles();

  return (
    <section style={styles.bg.primary} className="py-32">
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
            Security &{' '}
            <motion.span 
              key={`security-gradient-${theme.mode}`}
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
              privacy first
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
            Built with enterprise-grade security and privacy controls. 
            Your users' context is protected with the highest standards.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {securityFeatures.slice(0, 3).map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '5rem',
                  height: '5rem',
                  backgroundColor: theme.utils.alpha(theme.colors.primary, 0.1),
                  border: `1px solid ${theme.utils.alpha(theme.colors.primary, 0.3)}`,
                  borderRadius: '1rem',
                  marginBottom: theme.semanticSpacing.lg,
                }}
              >
                <feature.icon style={{ color: theme.colors.primary }} size={32} />
              </motion.div>
              <h3 
                style={{
                  ...styles.typography.h4,
                  color: theme.colors.text,
                  marginBottom: theme.semanticSpacing.md,
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {securityFeatures.slice(3).map((feature, index) => (
            <motion.div
              key={index + 3}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              style={{
                ...styles.glass.light,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '1.5rem',
                padding: theme.semanticSpacing.xl,
              }}
            >
              <feature.icon 
                style={{ color: theme.colors.primary, marginBottom: theme.semanticSpacing.md }} 
                size={32} 
              />
              <h3 
                style={{
                  ...styles.typography.h4,
                  color: theme.colors.text,
                  marginBottom: theme.semanticSpacing.md,
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
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{
            ...styles.glass.light,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '1.5rem',
            padding: theme.semanticSpacing.xl,
          }}
        >
          <div className="text-center mb-8">
            <h3 
              style={{
                ...styles.typography.h3,
                color: theme.colors.text,
                marginBottom: theme.semanticSpacing.md,
              }}
            >
              Compliance & Certifications
            </h3>
            <p style={{ color: theme.colors.textSecondary }}>
              Meeting the highest standards for data protection and privacy
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'SOC 2 Type II', status: 'Compliant' },
              { label: 'GDPR', status: 'Compliant' },
              { label: 'CCPA', status: 'Compliant' },
              { label: 'ISO 27001', status: 'In Progress' }
            ].map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div 
                  style={{
                    width: '4rem',
                    height: '4rem',
                    backgroundColor: theme.utils.alpha(theme.colors.primary, 0.1),
                    border: `1px solid ${theme.utils.alpha(theme.colors.primary, 0.3)}`,
                    borderRadius: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    marginBottom: theme.semanticSpacing.sm,
                  }}
                >
                  <CheckCircle2 style={{ color: theme.colors.primary }} size={24} />
                </div>
                <div 
                  style={{
                    color: theme.colors.text,
                    fontWeight: theme.typography.fontWeight.semibold,
                    fontSize: theme.typography.fontSize.sm,
                    marginBottom: theme.semanticSpacing.xs,
                  }}
                >
                  {cert.label}
                </div>
                <div 
                  style={{
                    color: theme.colors.textSecondary,
                    fontSize: theme.typography.fontSize.xs,
                  }}
                >
                  {cert.status}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex items-center justify-center mt-12 space-x-4"
        >
          <CheckCircle2 style={{ color: theme.colors.primary }} size={24} />
          <span 
            style={{
              color: theme.colors.textSecondary,
              fontSize: theme.typography.fontSize.lg,
            }}
          >
            Enterprise-ready security with 99.9% uptime SLA
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default SecuritySection;