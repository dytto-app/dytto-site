'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Crown, ArrowRight } from 'lucide-react';
import { useTheme } from '@/components/shared/ThemeProvider';
import { useThemeStyles } from '@/hooks/useThemeStyles';

const pricingPlans = [
  {
    name: 'Free',
    icon: Star,
    price: 0,
    description: 'Perfect for getting started with Dytto',
    features: [
      'Basic story generation',
      'Photo organization',
      'Daily summaries',
      'Basic insights',
      'Timeline view',
      'Community support'
    ],
    limitations: [
      'Limited to 10 stories/month',
      'Basic AI features only',
      'Standard photo quality'
    ],
    cta: 'Download Free',
    popular: false,
    color: 'blue'
  },
  {
    name: 'Premium',
    icon: Crown,
    price: 9.99,
    description: 'Unlock the full power of AI-driven insights',
    features: [
      'Unlimited story generation',
      'Advanced AI insights',
      'Personalized news feed',
      'Location intelligence',
      'Priority support',
      'Export capabilities',
      'Advanced analytics',
      'Custom themes'
    ],
    limitations: [],
    cta: 'Start Free Trial',
    popular: true,
    color: 'primary'
  }
];

const AppPricing = () => {
  const { theme } = useTheme();
  const styles = useThemeStyles();

  return (
    <section id="pricing" style={styles.bg.secondary} className="py-16 sm:py-32">
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
            Simple{' '}
            <motion.span 
              key={`pricing-gradient-${theme.mode}`}
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
              pricing
            </motion.span>
          </h2>
          <p 
            style={{
              ...styles.typography.bodyLarge,
              color: theme.colors.textSecondary,
              maxWidth: '48rem',
              margin: '0 auto',
              marginBottom: theme.semanticSpacing.xl,
              paddingLeft: '1rem',
              paddingRight: '1rem',
            }}
          >
            Start free and upgrade when you're ready for more advanced features. 
            No hidden fees, cancel anytime.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -5 }}
              style={{
                ...styles.glass.light,
                border: plan.popular 
                  ? `2px solid ${theme.colors.primary}` 
                  : `1px solid ${theme.colors.border}`,
                borderRadius: '1.5rem',
                padding: theme.semanticSpacing.lg,
                transition: theme.animations.transition.normal,
                position: 'relative',
              }}
              className="hover:shadow-lg"
            >
              {plan.popular && (
                <div 
                  style={{
                    position: 'absolute',
                    top: '-0.75rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.background,
                    padding: `${theme.semanticSpacing.xs} ${theme.semanticSpacing.md}`,
                    borderRadius: '9999px',
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: theme.typography.fontWeight.semibold,
                    whiteSpace: 'nowrap',
                  }}
                >
                  Most Popular
                </div>
              )}

              <div className="text-center mb-6 sm:mb-8">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '3.5rem',
                    height: '3.5rem',
                    backgroundColor: plan.popular 
                      ? theme.colors.primary 
                      : theme.utils.alpha(theme.colors.primary, 0.1),
                    borderRadius: '1rem',
                    marginBottom: theme.semanticSpacing.lg,
                  }}
                >
                  <plan.icon 
                    style={{ 
                      color: plan.popular 
                        ? theme.colors.background 
                        : theme.colors.primary 
                    }} 
                    size={24} 
                  />
                </motion.div>

                <h3 
                  style={{
                    ...styles.typography.h3,
                    color: theme.colors.text,
                    marginBottom: theme.semanticSpacing.sm,
                    fontSize: 'clamp(1.25rem, 4vw, 1.875rem)',
                  }}
                >
                  {plan.name}
                </h3>

                <div className="mb-4">
                  <span 
                    style={{
                      ...styles.typography.h1,
                      color: theme.colors.text,
                      fontSize: 'clamp(2rem, 6vw, 3rem)',
                    }}
                  >
                    ${plan.price}
                  </span>
                  <span 
                    style={{
                      ...styles.typography.body,
                      color: theme.colors.textSecondary,
                    }}
                  >
                    /month
                  </span>
                </div>

                <p 
                  style={{
                    ...styles.typography.body,
                    color: theme.colors.textSecondary,
                    fontSize: theme.typography.fontSize.sm,
                  }}
                >
                  {plan.description}
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <motion.div
                    key={featureIndex}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: featureIndex * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <Check style={{ color: theme.colors.success, flexShrink: 0 }} size={18} />
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

              <motion.a
                href={plan.name === 'Free' ? 'https://apps.apple.com/us/app/dytto-journal/id6745741994' : '#'}
                target={plan.name === 'Free' ? '_blank' : undefined}
                rel={plan.name === 'Free' ? 'noopener noreferrer' : undefined}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: '100%',
                  padding: `${theme.semanticSpacing.md} ${theme.semanticSpacing.lg}`,
                  borderRadius: '0.75rem',
                  fontWeight: theme.typography.fontWeight.medium,
                  transition: theme.animations.transition.normal,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: theme.semanticSpacing.sm,
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  ...(plan.popular
                    ? {
                        backgroundColor: theme.colors.primary,
                        color: theme.colors.background,
                        boxShadow: theme.shadows.brand,
                      }
                    : {
                        backgroundColor: 'transparent',
                        color: theme.colors.text,
                        border: `1px solid ${theme.colors.border}`,
                      }
                  ),
                }}
              >
                <span>{plan.cta}</span>
                <ArrowRight size={18} />
              </motion.a>
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
              Questions about pricing?
            </h3>
            <p 
              style={{
                ...styles.typography.body,
                color: theme.colors.textSecondary,
                marginBottom: theme.semanticSpacing.lg,
              }}
            >
              We offer educational discounts and custom plans for organizations. 
              Contact us to learn more.
            </p>
            <button 
              style={{
                ...styles.button.secondary,
                width: '100%',
                maxWidth: '200px',
              }}
            >
              Contact Support
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AppPricing;