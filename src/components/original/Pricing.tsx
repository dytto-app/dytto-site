'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Crown, Building, ArrowRight } from 'lucide-react';
import { useTheme } from '@/components/shared/ThemeProvider';
import { useThemeStyles } from '@/hooks/useThemeStyles';

const pricingPlans = [
  {
    name: 'Developer',
    icon: Zap,
    price: { monthly: 0, yearly: 0 },
    description: 'Perfect for getting started and prototyping',
    features: [
      '1,000 API calls/month',
      '5 simulation agents',
      'Basic persona interactions',
      'Community support',
      'Standard documentation',
      'OAuth 2.0 authentication'
    ],
    limitations: [
      'Rate limited to 10 req/min',
      'No custom integrations',
      'Basic analytics only'
    ],
    cta: 'Start Free',
    popular: false,
    color: 'blue'
  },
  {
    name: 'Professional',
    icon: Crown,
    price: { monthly: 99, yearly: 990 },
    description: 'For growing applications and teams',
    features: [
      '50,000 API calls/month',
      '100 simulation agents',
      'Advanced persona interactions',
      'Priority support',
      'Advanced analytics',
      'Custom webhooks',
      'Team collaboration',
      'SLA guarantees'
    ],
    limitations: [],
    cta: 'Start Trial',
    popular: true,
    color: 'primary'
  },
  {
    name: 'Enterprise',
    icon: Building,
    price: { monthly: 'Custom', yearly: 'Custom' },
    description: 'For large-scale applications and organizations',
    features: [
      'Unlimited API calls',
      'Unlimited simulation agents',
      'Custom persona models',
      'Dedicated support',
      'Custom integrations',
      'On-premise deployment',
      'Advanced security',
      'Custom SLAs',
      'Training & onboarding'
    ],
    limitations: [],
    cta: 'Contact Sales',
    popular: false,
    color: 'dark'
  }
];

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);
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
            Simple,{' '}
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
              transparent pricing
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
            Start free, scale as you grow. No hidden fees, no surprises. 
            All plans include our core AI context capabilities.
          </p>

          {/* Billing Toggle */}
          <div 
            className="inline-flex items-center rounded-full p-1"
            style={{
              backgroundColor: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
            }}
          >
            <button
              onClick={() => setIsYearly(false)}
              style={{
                padding: `${theme.semanticSpacing.sm} ${theme.semanticSpacing.md}`,
                borderRadius: '9999px',
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium,
                transition: theme.animations.transition.normal,
                border: 'none',
                cursor: 'pointer',
                ...(isYearly
                  ? {
                      backgroundColor: 'transparent',
                      color: theme.colors.textSecondary,
                    }
                  : {
                      backgroundColor: theme.colors.primary,
                      color: theme.colors.background,
                    }
                ),
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              style={{
                padding: `${theme.semanticSpacing.sm} ${theme.semanticSpacing.md}`,
                borderRadius: '9999px',
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium,
                transition: theme.animations.transition.normal,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: theme.semanticSpacing.sm,
                ...(isYearly
                  ? {
                      backgroundColor: theme.colors.primary,
                      color: theme.colors.background,
                    }
                  : {
                      backgroundColor: 'transparent',
                      color: theme.colors.textSecondary,
                    }
                ),
              }}
            >
              Yearly
              <span 
                style={{
                  backgroundColor: theme.colors.success,
                  color: theme.colors.background,
                  padding: `${theme.semanticSpacing.xs} ${theme.semanticSpacing.sm}`,
                  borderRadius: '9999px',
                  fontSize: theme.typography.fontSize.xs,
                  fontWeight: theme.typography.fontWeight.semibold,
                }}
              >
                Save 20%
              </span>
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
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
                  {typeof plan.price.monthly === 'number' ? (
                    <div>
                      <span 
                        style={{
                          ...styles.typography.h1,
                          color: theme.colors.text,
                          fontSize: 'clamp(2rem, 6vw, 3rem)',
                        }}
                      >
                        ${isYearly ? plan.price.yearly : plan.price.monthly}
                      </span>
                      <span 
                        style={{
                          ...styles.typography.body,
                          color: theme.colors.textSecondary,
                        }}
                      >
                        {isYearly ? '/year' : '/month'}
                      </span>
                    </div>
                  ) : (
                    <span 
                      style={{
                        ...styles.typography.h2,
                        color: theme.colors.text,
                        fontSize: 'clamp(1.5rem, 5vw, 2.25rem)',
                      }}
                    >
                      {plan.price.monthly}
                    </span>
                  )}
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

              <motion.button
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
              </motion.button>
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
              Need something custom?
            </h3>
            <p 
              style={{
                ...styles.typography.body,
                color: theme.colors.textSecondary,
                marginBottom: theme.semanticSpacing.lg,
              }}
            >
              We offer custom solutions for unique requirements, including on-premise 
              deployments, custom models, and specialized integrations.
            </p>
            <button 
              style={{
                ...styles.button.primary,
                boxShadow: theme.shadows.brand,
                width: '100%',
                maxWidth: '200px',
              }}
            >
              Contact Our Team
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;