'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Database, Users, Brain, Shield } from 'lucide-react';
import { useTheme } from '@/components/shared/ThemeProvider';
import { useThemeStyles } from '@/hooks/useThemeStyles';

const features = [
  {
    icon: Database,
    title: 'Context Bedrock',
    description: 'Rich, multi-faceted internal representation of user context as the primary source of truth.',
    gradient: 'from-sky-400 to-sky-500'
  },
  {
    icon: Users,
    title: 'Dynamic Personas',
    description: 'API-facing personas dynamically synthesized from context bedrock, tailored to client needs.',
    gradient: 'from-slate-600 to-slate-700'
  },
  {
    icon: Brain,
    title: 'AI-Powered Synthesis',
    description: 'Advanced LLM integration for context processing, persona generation, and intelligent interactions.',
    gradient: 'from-sky-500 to-slate-600'
  },
  {
    icon: Shield,
    title: 'Privacy & Security',
    description: 'OAuth 2.0 authentication, fine-grained consent management, and comprehensive audit logging.',
    gradient: 'from-slate-700 to-sky-500'
  }
];

const PlatformOverview = () => {
  const { theme } = useTheme();
  const styles = useThemeStyles();

  return (
    <section id="platform" style={styles.bg.primary} className="py-32">
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
              key={`platform-gradient-${theme.mode}`}
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
              context platform
            </motion.span>{' '}
            for AI
          </h2>
          <p 
            style={{
              ...styles.typography.bodyLarge,
              color: theme.colors.textSecondary,
              maxWidth: '48rem',
              margin: '0 auto',
            }}
          >
            Dytto provides the infrastructure for building context-aware AI applications. 
            From simulation agents to personalized interactions, we handle the complexity 
            of human context understanding.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              style={{
                ...styles.card.glass,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '1.5rem',
                padding: theme.semanticSpacing.lg,
                transition: theme.animations.transition.normal,
              }}
              className="hover:shadow-lg"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '4rem',
                  height: '4rem',
                  background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
                  borderRadius: '1rem',
                  marginBottom: theme.semanticSpacing.lg,
                }}
              >
                <feature.icon style={{ color: theme.colors.background }} size={28} />
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

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-16"
        >
          <button 
            style={{
              ...styles.button.primary,
              boxShadow: theme.shadows.brand,
            }}
          >
            Explore the Platform
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default PlatformOverview;