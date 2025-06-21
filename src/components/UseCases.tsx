import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  ShoppingCart, 
  BookOpen, 
  Heart, 
  Briefcase, 
  GamepadIcon,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useThemeStyles } from '../hooks/useThemeStyles';

const useCases = [
  {
    id: 'research',
    icon: Users,
    title: 'Academic Research',
    subtitle: 'Social & Behavioral Studies',
    description: 'Generate diverse, anonymized user personas for research studies without compromising privacy.',
    features: [
      'Demographically diverse simulation agents',
      'Configurable personality traits and behaviors',
      'Ethical data collection and anonymization',
      'Statistical validity and reproducibility'
    ],
    metrics: {
      'Research Studies': '500+',
      'Generated Personas': '50K+',
      'Universities': '25+'
    },
    gradient: 'from-blue-500 to-purple-600'
  },
  {
    id: 'ecommerce',
    icon: ShoppingCart,
    title: 'E-commerce',
    subtitle: 'Personalized Shopping',
    description: 'Create hyper-personalized shopping experiences that understand customer context and preferences.',
    features: [
      'Context-aware product recommendations',
      'Dynamic pricing based on user behavior',
      'Personalized marketing campaigns',
      'Customer journey optimization'
    ],
    metrics: {
      'Conversion Lift': '+35%',
      'Revenue Growth': '+28%',
      'Customer Satisfaction': '4.8/5'
    },
    gradient: 'from-green-500 to-emerald-600'
  },
  {
    id: 'education',
    icon: BookOpen,
    title: 'Education',
    subtitle: 'Adaptive Learning',
    description: 'Build intelligent tutoring systems that adapt to individual learning styles and progress.',
    features: [
      'Personalized learning paths',
      'Real-time difficulty adjustment',
      'Learning style recognition',
      'Progress tracking and analytics'
    ],
    metrics: {
      'Learning Improvement': '+42%',
      'Engagement Rate': '+65%',
      'Completion Rate': '+38%'
    },
    gradient: 'from-orange-500 to-red-600'
  },
  {
    id: 'healthcare',
    icon: Heart,
    title: 'Healthcare',
    subtitle: 'Patient Care',
    description: 'Enhance patient care with context-aware health monitoring and personalized treatment plans.',
    features: [
      'Personalized health insights',
      'Behavioral pattern recognition',
      'Treatment adherence monitoring',
      'Risk factor identification'
    ],
    metrics: {
      'Patient Outcomes': '+25%',
      'Adherence Rate': '+40%',
      'Early Detection': '+60%'
    },
    gradient: 'from-pink-500 to-rose-600'
  },
  {
    id: 'enterprise',
    icon: Briefcase,
    title: 'Enterprise',
    subtitle: 'Employee Experience',
    description: 'Transform workplace productivity with AI that understands employee context and needs.',
    features: [
      'Personalized workflow optimization',
      'Intelligent task prioritization',
      'Team collaboration insights',
      'Performance analytics'
    ],
    metrics: {
      'Productivity Gain': '+30%',
      'Employee Satisfaction': '+45%',
      'Time Saved': '2.5hrs/day'
    },
    gradient: 'from-indigo-500 to-blue-600'
  },
  {
    id: 'gaming',
    icon: GamepadIcon,
    title: 'Gaming',
    subtitle: 'Dynamic Experiences',
    description: 'Create adaptive gaming experiences that respond to player behavior and preferences.',
    features: [
      'Dynamic difficulty adjustment',
      'Personalized content generation',
      'Player behavior analysis',
      'Engagement optimization'
    ],
    metrics: {
      'Player Retention': '+55%',
      'Session Length': '+40%',
      'In-game Purchases': '+32%'
    },
    gradient: 'from-purple-500 to-indigo-600'
  }
];

const UseCases = () => {
  const [activeUseCase, setActiveUseCase] = useState('research');
  const { theme } = useTheme();
  const styles = useThemeStyles();

  const activeCase = useCases.find(uc => uc.id === activeUseCase) || useCases[0];

  return (
    <section style={styles.bg.tertiary} className="py-16 sm:py-32">
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
            Powering{' '}
            <motion.span 
              key={`usecases-gradient-${theme.mode}`}
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
              intelligent applications
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
            From academic research to enterprise solutions, Dytto enables context-aware AI 
            across industries and use cases.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Use Case Navigation */}
          <div className="space-y-3 sm:space-y-4 lg:col-span-1">
            {useCases.map((useCase, index) => (
              <motion.button
                key={useCase.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => setActiveUseCase(useCase.id)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: theme.semanticSpacing.md,
                  borderRadius: '1rem',
                  border: `1px solid ${theme.colors.border}`,
                  transition: theme.animations.transition.normal,
                  backgroundColor: activeUseCase === useCase.id 
                    ? theme.colors.surface 
                    : 'transparent',
                  cursor: 'pointer',
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div 
                    style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      backgroundColor: activeUseCase === useCase.id 
                        ? theme.colors.primary 
                        : theme.utils.alpha(theme.colors.primary, 0.1),
                      borderRadius: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <useCase.icon 
                      style={{ 
                        color: activeUseCase === useCase.id 
                          ? theme.colors.background 
                          : theme.colors.primary 
                      }} 
                      size={18} 
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div 
                      style={{
                        ...styles.typography.h6,
                        color: theme.colors.text,
                        marginBottom: theme.semanticSpacing.xs,
                        fontSize: theme.typography.fontSize.base,
                      }}
                    >
                      {useCase.title}
                    </div>
                    <div 
                      style={{
                        ...styles.typography.caption,
                        color: theme.colors.textSecondary,
                        fontSize: theme.typography.fontSize.sm,
                      }}
                    >
                      {useCase.subtitle}
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Active Use Case Details */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCase.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                style={{
                  ...styles.glass.light,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '1.5rem',
                  padding: theme.semanticSpacing.lg,
                  height: 'fit-content',
                }}
              >
                <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    style={{
                      width: '3rem',
                      height: '3rem',
                      background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
                      borderRadius: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <activeCase.icon style={{ color: theme.colors.background }} size={24} />
                  </motion.div>
                  <div className="min-w-0 flex-1">
                    <h3 
                      style={{
                        ...styles.typography.h3,
                        color: theme.colors.text,
                        marginBottom: theme.semanticSpacing.xs,
                        fontSize: 'clamp(1.25rem, 4vw, 1.875rem)',
                      }}
                    >
                      {activeCase.title}
                    </h3>
                    <div 
                      style={{
                        ...styles.typography.body,
                        color: theme.colors.primary,
                        fontWeight: theme.typography.fontWeight.medium,
                      }}
                    >
                      {activeCase.subtitle}
                    </div>
                  </div>
                </div>

                <p 
                  style={{
                    ...styles.typography.bodyLarge,
                    color: theme.colors.textSecondary,
                    lineHeight: '1.6',
                    marginBottom: theme.semanticSpacing.lg,
                  }}
                >
                  {activeCase.description}
                </p>

                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  {activeCase.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center space-x-3"
                    >
                      <CheckCircle style={{ color: theme.colors.primary, flexShrink: 0 }} size={18} />
                      <span 
                        style={{
                          ...styles.typography.body,
                          color: theme.colors.textSecondary,
                          fontSize: theme.typography.fontSize.sm,
                        }}
                      >
                        {feature}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <div 
                  style={{
                    backgroundColor: theme.utils.alpha(theme.colors.primary, 0.05),
                    border: `1px solid ${theme.utils.alpha(theme.colors.primary, 0.2)}`,
                    borderRadius: '1rem',
                    padding: theme.semanticSpacing.md,
                    marginBottom: theme.semanticSpacing.lg,
                  }}
                >
                  <h4 
                    style={{
                      ...styles.typography.h6,
                      color: theme.colors.text,
                      marginBottom: theme.semanticSpacing.md,
                    }}
                  >
                    Key Metrics
                  </h4>
                  <div className="grid grid-cols-3 gap-3 sm:gap-4">
                    {Object.entries(activeCase.metrics).map(([key, value], index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="text-center"
                      >
                        <div 
                          style={{
                            ...styles.typography.h4,
                            color: theme.colors.primary,
                            marginBottom: theme.semanticSpacing.xs,
                            fontSize: 'clamp(1rem, 3vw, 1.5rem)',
                          }}
                        >
                          {value}
                        </div>
                        <div 
                          style={{
                            ...styles.typography.caption,
                            color: theme.colors.textSecondary,
                            fontSize: theme.typography.fontSize.xs,
                          }}
                        >
                          {key}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    ...styles.button.primary,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: theme.semanticSpacing.sm,
                    width: '100%',
                    justifyContent: 'center',
                  }}
                >
                  <span>Explore This Use Case</span>
                  <ArrowRight size={20} />
                </motion.button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UseCases;