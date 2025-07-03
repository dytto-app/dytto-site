import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  ArrowRight, 
  Play, 
  CheckCircle, 
  Camera, 
  BookOpen, 
  Shield, 
  Star,
  ChevronDown,
  X,
  Twitter,
  Mail,
  Clock,
  Users,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../components/ThemeProvider';
import { useThemeStyles } from '../hooks/useThemeStyles';

const WaitlistLandingPage = () => {
  const { theme } = useTheme();
  const styles = useThemeStyles();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [queuePosition, setQueuePosition] = useState(0);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [storiesCount, setStoriesCount] = useState(12742);
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  // Exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0 && !isSubmitted && !showExitIntent) {
        setShowExitIntent(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [isSubmitted, showExitIntent]);

  // Animated counter for stories
  useEffect(() => {
    const interval = setInterval(() => {
      setStoriesCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setQueuePosition(Math.floor(Math.random() * 2000) + 1000);
      setIsSubmitted(true);
      setShowExitIntent(false);
    }
  };

  const benefits = [
    {
      icon: Zap,
      title: 'Zero effort',
      subtitle: 'No typing, no streaks.',
      description: 'Just live your day while Dytto automatically captures context from your photos, locations, and activities.'
    },
    {
      icon: BookOpen,
      title: 'Story worth rereading',
      subtitle: '2-min narrative, every night.',
      description: 'AI transforms your daily experiences into meaningful, personalized stories you\'ll actually want to read.'
    },
    {
      icon: Shield,
      title: 'Your data, your device',
      subtitle: 'Encrypted, revocable.',
      description: 'Complete privacy control with end-to-end encryption and the ability to revoke access anytime.'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Install & grant sensors',
      description: 'Quick setup with camera and location permissions'
    },
    {
      number: '02',
      title: 'Live your day',
      description: 'Go about your normal routine - no extra effort required'
    },
    {
      number: '03',
      title: 'Read tonight\'s chapter',
      description: 'Receive your personalized story every evening'
    }
  ];

  const testimonials = [
    {
      initials: 'SJ',
      quote: 'Finally, an app that understands my life without me having to document everything manually.',
      name: 'Sarah J.'
    },
    {
      initials: 'MR',
      quote: 'The stories it creates are surprisingly insightful. I see patterns I never noticed.',
      name: 'Marcus R.'
    },
    {
      initials: 'EW',
      quote: 'Privacy-first approach gives me confidence to share my real experiences.',
      name: 'Emily W.'
    }
  ];

  const faqs = [
    {
      question: 'Will this drain my battery?',
      answer: 'Dytto is optimized for minimal battery usage, consuming less than 2% of your daily battery life through efficient background processing.'
    },
    {
      question: 'How is my privacy protected?',
      answer: 'All data is encrypted end-to-end, processed locally when possible, and you maintain complete control over what\'s shared and stored.'
    },
    {
      question: 'How much does it cost?',
      answer: 'Dytto starts free with basic features. Premium plans begin at $9.99/month for unlimited stories and advanced insights.'
    },
    {
      question: 'Can I export my stories?',
      answer: 'Yes! You can export all your stories in multiple formats (PDF, text, or structured data) at any time.'
    },
    {
      question: 'Which platforms are supported?',
      answer: 'Currently iOS and Android, with web companion app coming soon. All platforms sync seamlessly.'
    },
    {
      question: 'When will it be available?',
      answer: 'Beta launches in Q2 2024 for waitlist members. Public release follows in Q3 2024.'
    }
  ];

  return (
    <div style={styles.bg.primary} className="min-h-screen">
      {/* Sticky Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-3 left-3 right-3 z-50 rounded-2xl px-6 py-3"
        style={{
          ...styles.glass.medium,
          border: `1px solid ${theme.colors.border}`,
        }}
      >
        <div className="flex items-center justify-between">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center space-x-3"
          >
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: theme.colors.primary }}
            >
              <Brain style={{ color: theme.colors.background }} size={20} />
            </div>
            <span style={{ 
              color: theme.colors.text, 
              fontWeight: theme.typography.fontWeight.semibold,
              fontSize: theme.typography.fontSize.xl
            }}>
              Dytto
            </span>
          </button>
          
          <div className="hidden lg:flex items-center space-x-8">
            <a 
              href="#how-it-works"
              style={{ 
                color: theme.colors.textSecondary,
                fontSize: theme.typography.fontSize.sm,
                transition: theme.animations.transition.normal,
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => e.target.style.color = theme.colors.primary}
              onMouseLeave={(e) => e.target.style.color = theme.colors.textSecondary}
            >
              How it works
            </a>
            <Link
              to="/api"
              style={{ 
                color: theme.colors.textSecondary,
                fontSize: theme.typography.fontSize.sm,
                transition: theme.animations.transition.normal,
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => e.target.style.color = theme.colors.primary}
              onMouseLeave={(e) => e.target.style.color = theme.colors.textSecondary}
            >
              API
            </Link>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => document.getElementById('email-capture').scrollIntoView({ behavior: 'smooth' })}
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.background,
              padding: `${theme.semanticSpacing.sm} ${theme.semanticSpacing.md}`,
              borderRadius: '9999px',
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.semibold,
              border: 'none',
              cursor: 'pointer',
              transition: theme.animations.transition.normal,
            }}
          >
            Get Early Access
          </motion.button>
        </div>
      </motion.nav>

      {/* Hero Section - 100vh */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 px-6">
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${theme.colors.background} 0%, ${theme.colors.backgroundSecondary} 100%)`
          }}
        >
          <motion.div
            animate={{
              background: [
                `radial-gradient(circle at 20% 50%, ${theme.utils.alpha(theme.colors.primary, 0.03)} 0%, transparent 50%)`,
                `radial-gradient(circle at 80% 20%, ${theme.utils.alpha(theme.colors.primary, 0.05)} 0%, transparent 50%)`,
                `radial-gradient(circle at 40% 80%, ${theme.utils.alpha(theme.colors.primary, 0.03)} 0%, transparent 50%)`,
              ]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          />
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              ...styles.typography.h1,
              color: theme.colors.text,
              marginBottom: theme.semanticSpacing.lg,
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              lineHeight: '1.1',
            }}
          >
            Your life.{' '}
            <motion.span 
              style={{
                background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: theme.typography.fontWeight.semibold,
              }}
            >
              Authored.
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              ...styles.typography.bodyLarge,
              color: theme.colors.textSecondary,
              maxWidth: '48rem',
              margin: '0 auto',
              marginBottom: theme.semanticSpacing['3xl'],
              fontSize: 'clamp(1.125rem, 4vw, 1.5rem)',
              lineHeight: '1.6',
            }}
          >
            Automatic nightly stories from your day.
          </motion.p>

          {/* Phone Mockup with Video */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mb-12"
          >
            <div className="relative mx-auto w-64 h-[520px]">
              <div 
                className="w-full h-full rounded-[3rem] p-2 shadow-2xl"
                style={{ backgroundColor: theme.colors.text }}
              >
                <div 
                  className="w-full h-full rounded-[2.5rem] overflow-hidden relative"
                  style={{ backgroundColor: theme.colors.background }}
                >
                  {/* Simulated phone content */}
                  <div className="p-6 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <div style={{ color: theme.colors.text, fontWeight: 600 }}>Today</div>
                      <div style={{ color: theme.colors.textSecondary, fontSize: '14px' }}>9:47 PM</div>
                    </div>
                    
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="flex-1 flex flex-col justify-center"
                    >
                      <div 
                        className="w-full h-32 rounded-xl mb-4"
                        style={{ backgroundColor: theme.colors.surface }}
                      />
                      <div 
                        className="w-3/4 h-4 rounded mb-2"
                        style={{ backgroundColor: theme.colors.surface }}
                      />
                      <div 
                        className="w-1/2 h-4 rounded"
                        style={{ backgroundColor: theme.colors.surface }}
                      />
                    </motion.div>
                    
                    <div 
                      className="w-full py-3 rounded-xl text-center text-white text-sm font-medium"
                      style={{ backgroundColor: theme.colors.primary }}
                    >
                      Read Your Story
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
          >
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => document.getElementById('email-capture').scrollIntoView({ behavior: 'smooth' })}
              style={{
                ...styles.button.primary,
                boxShadow: theme.shadows.brand,
                display: 'inline-flex',
                alignItems: 'center',
                gap: theme.semanticSpacing.sm,
                padding: `${theme.semanticSpacing.md} ${theme.semanticSpacing.xl}`,
                fontSize: theme.typography.fontSize.lg,
              }}
            >
              <span>Join the Wait-list</span>
              <ArrowRight size={20} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowDemo(true)}
              style={{
                ...styles.button.secondary,
                display: 'inline-flex',
                alignItems: 'center',
                gap: theme.semanticSpacing.sm,
                padding: `${theme.semanticSpacing.md} ${theme.semanticSpacing.xl}`,
                fontSize: theme.typography.fontSize.lg,
              }}
            >
              <Play size={20} />
              <span>Watch 30-sec Demo</span>
            </motion.button>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown style={{ color: theme.colors.primary }} size={32} />
        </motion.div>
      </section>

      {/* 3 Quick Benefits */}
      <section className="py-20 px-6" style={styles.bg.secondary}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
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
                    backgroundColor: theme.colors.primary,
                    borderRadius: '1rem',
                    marginBottom: theme.semanticSpacing.lg,
                  }}
                >
                  <benefit.icon style={{ color: theme.colors.background }} size={24} />
                </motion.div>
                
                <h3 
                  style={{
                    ...styles.typography.h4,
                    color: theme.colors.text,
                    marginBottom: theme.semanticSpacing.sm,
                  }}
                >
                  {benefit.title}
                </h3>
                
                <p 
                  style={{
                    color: theme.colors.primary,
                    fontWeight: theme.typography.fontWeight.medium,
                    marginBottom: theme.semanticSpacing.md,
                  }}
                >
                  {benefit.subtitle}
                </p>
                
                <p 
                  style={{
                    ...styles.typography.body,
                    color: theme.colors.textSecondary,
                    lineHeight: '1.6',
                  }}
                >
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mt-12"
          >
            <div 
              style={{
                backgroundColor: theme.utils.alpha(theme.colors.primary, 0.1),
                border: `1px solid ${theme.utils.alpha(theme.colors.primary, 0.3)}`,
                borderRadius: '1rem',
                padding: theme.semanticSpacing.lg,
                display: 'inline-block',
              }}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => document.getElementById('email-capture').scrollIntoView({ behavior: 'smooth' })}
                style={{
                  ...styles.button.primary,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: theme.semanticSpacing.sm,
                }}
              >
                <span>Get Early Access</span>
                <ArrowRight size={18} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6" style={styles.bg.primary}>
        <div className="max-w-6xl mx-auto">
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
              How it{' '}
              <span 
                style={{
                  background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: theme.typography.fontWeight.semibold,
                }}
              >
                works
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <div 
                  style={{
                    width: '4rem',
                    height: '4rem',
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.background,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: theme.typography.fontSize.xl,
                    fontWeight: theme.typography.fontWeight.bold,
                    margin: '0 auto',
                    marginBottom: theme.semanticSpacing.lg,
                  }}
                >
                  {step.number}
                </div>
                
                <h3 
                  style={{
                    ...styles.typography.h4,
                    color: theme.colors.text,
                    marginBottom: theme.semanticSpacing.md,
                  }}
                >
                  {step.title}
                </h3>
                
                <p 
                  style={{
                    ...styles.typography.body,
                    color: theme.colors.textSecondary,
                    lineHeight: '1.6',
                  }}
                >
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => document.getElementById('email-capture').scrollIntoView({ behavior: 'smooth' })}
              style={{
                backgroundColor: theme.utils.alpha(theme.colors.primary, 0.1),
                color: theme.colors.primary,
                border: `1px solid ${theme.colors.primary}`,
                padding: `${theme.semanticSpacing.sm} ${theme.semanticSpacing.lg}`,
                borderRadius: '0.75rem',
                fontSize: theme.typography.fontSize.base,
                fontWeight: theme.typography.fontWeight.medium,
                cursor: 'pointer',
                transition: theme.animations.transition.normal,
                display: 'inline-flex',
                alignItems: 'center',
                gap: theme.semanticSpacing.sm,
              }}
            >
              <span>Reserve your spot</span>
              <ArrowRight size={18} />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Live Sample Story */}
      <section className="py-20 px-6" style={styles.bg.secondary}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 
              style={{
                ...styles.typography.h1,
                color: theme.colors.text,
                marginBottom: theme.semanticSpacing.lg,
                fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              }}
            >
              See it in{' '}
              <span 
                style={{
                  background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: theme.typography.fontWeight.semibold,
                }}
              >
                action
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            whileHover={{ y: -5 }}
            onClick={() => setShowDemo(true)}
            style={{
              ...styles.glass.light,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '1.5rem',
              padding: theme.semanticSpacing.xl,
              cursor: 'pointer',
              transition: theme.animations.transition.normal,
            }}
            className="hover:shadow-lg"
          >
            <div className="flex items-start space-x-4 mb-6">
              <div 
                style={{
                  width: '3rem',
                  height: '3rem',
                  backgroundColor: theme.colors.primary,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <BookOpen style={{ color: theme.colors.background }} size={20} />
              </div>
              <div>
                <h3 
                  style={{
                    ...styles.typography.h4,
                    color: theme.colors.text,
                    marginBottom: theme.semanticSpacing.sm,
                  }}
                >
                  Tuesday, March 12th - "The Coffee Shop Discovery"
                </h3>
                <p 
                  style={{
                    ...styles.typography.body,
                    color: theme.colors.textSecondary,
                    lineHeight: '1.6',
                  }}
                >
                  "Your morning started with the usual routine, but something was different today. The detour you took to avoid construction led you to a small coffee shop you'd never noticed before. The barista's recommendation of their signature lavender latte turned out to be exactly what you needed..."
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div style={{ color: theme.colors.textSecondary, fontSize: theme.typography.fontSize.sm }}>
                  2 min read • 3 photos • 2 locations
                </div>
              </div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                style={{
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.background,
                  padding: `${theme.semanticSpacing.sm} ${theme.semanticSpacing.md}`,
                  borderRadius: '0.75rem',
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.medium,
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.semanticSpacing.sm,
                }}
              >
                <Play size={16} />
                <span>Read Full Story</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof / FOMO */}
      <section className="py-20 px-6" style={styles.bg.primary}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div 
              style={{
                backgroundColor: theme.utils.alpha(theme.colors.primary, 0.1),
                border: `1px solid ${theme.utils.alpha(theme.colors.primary, 0.3)}`,
                borderRadius: '1rem',
                padding: theme.semanticSpacing.lg,
                display: 'inline-block',
                marginBottom: theme.semanticSpacing.xl,
              }}
            >
              <div className="flex items-center space-x-2">
                <Users style={{ color: theme.colors.primary }} size={24} />
                <span 
                  style={{
                    ...styles.typography.h3,
                    color: theme.colors.primary,
                    fontWeight: theme.typography.fontWeight.bold,
                  }}
                >
                  {storiesCount.toLocaleString()}
                </span>
                <span style={{ color: theme.colors.textSecondary }}>stories written so far</span>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                style={{
                  ...styles.glass.light,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '1.5rem',
                  padding: theme.semanticSpacing.lg,
                }}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div 
                    style={{
                      width: '3rem',
                      height: '3rem',
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
                    {testimonial.initials}
                  </div>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} style={{ color: theme.colors.primary }} className="fill-current" />
                    ))}
                  </div>
                </div>
                
                <p 
                  style={{
                    ...styles.typography.body,
                    color: theme.colors.textSecondary,
                    lineHeight: '1.6',
                    marginBottom: theme.semanticSpacing.md,
                  }}
                >
                  "{testimonial.quote}"
                </p>
                
                <div style={{ color: theme.colors.text, fontWeight: theme.typography.fontWeight.medium }}>
                  {testimonial.name}
                </div>
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
                backgroundColor: theme.utils.alpha(theme.colors.primary, 0.1),
                border: `1px solid ${theme.utils.alpha(theme.colors.primary, 0.3)}`,
                borderRadius: '1rem',
                padding: theme.semanticSpacing.lg,
                display: 'inline-block',
              }}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => document.getElementById('email-capture').scrollIntoView({ behavior: 'smooth' })}
                style={{
                  ...styles.button.primary,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: theme.semanticSpacing.sm,
                }}
              >
                <span>Join the Private Beta</span>
                <ArrowRight size={18} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6" style={styles.bg.secondary}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 
              style={{
                ...styles.typography.h1,
                color: theme.colors.text,
                marginBottom: theme.semanticSpacing.lg,
                fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              }}
            >
              Questions?{' '}
              <span 
                style={{
                  background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: theme.typography.fontWeight.semibold,
                }}
              >
                Answered.
              </span>
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                style={{
                  ...styles.glass.light,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '1rem',
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  style={{
                    width: '100%',
                    padding: theme.semanticSpacing.lg,
                    textAlign: 'left',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span 
                    style={{
                      ...styles.typography.h6,
                      color: theme.colors.text,
                    }}
                  >
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: expandedFAQ === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown style={{ color: theme.colors.primary }} size={20} />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {expandedFAQ === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        borderTop: `1px solid ${theme.colors.border}`,
                        padding: theme.semanticSpacing.lg,
                      }}
                    >
                      <p 
                        style={{
                          ...styles.typography.body,
                          color: theme.colors.textSecondary,
                          lineHeight: '1.6',
                        }}
                      >
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => document.getElementById('email-capture').scrollIntoView({ behavior: 'smooth' })}
              style={{
                backgroundColor: theme.utils.alpha(theme.colors.primary, 0.1),
                color: theme.colors.primary,
                border: `1px solid ${theme.colors.primary}`,
                padding: `${theme.semanticSpacing.sm} ${theme.semanticSpacing.lg}`,
                borderRadius: '0.75rem',
                fontSize: theme.typography.fontSize.base,
                fontWeight: theme.typography.fontWeight.medium,
                cursor: 'pointer',
                transition: theme.animations.transition.normal,
                display: 'inline-flex',
                alignItems: 'center',
                gap: theme.semanticSpacing.sm,
              }}
            >
              <span>Still have questions? Join the waitlist</span>
              <ArrowRight size={18} />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Email Capture Section */}
      <section id="email-capture" className="py-32 px-6" style={styles.bg.primary}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 
              style={{
                ...styles.typography.h1,
                color: theme.colors.text,
                marginBottom: theme.semanticSpacing.lg,
                fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                lineHeight: '1.1',
              }}
            >
              Be first to get your life,{' '}
              <span 
                style={{
                  background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: theme.typography.fontWeight.semibold,
                }}
              >
                authored.
              </span>
            </h2>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    style={{
                      flex: 1,
                      padding: `${theme.semanticSpacing.md} ${theme.semanticSpacing.lg}`,
                      borderRadius: '0.75rem',
                      border: `1px solid ${theme.colors.border}`,
                      backgroundColor: theme.colors.surface,
                      color: theme.colors.text,
                      fontSize: theme.typography.fontSize.base,
                    }}
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      ...styles.button.primary,
                      padding: `${theme.semanticSpacing.md} ${theme.semanticSpacing.xl}`,
                      fontSize: theme.typography.fontSize.base,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Join Waitlist
                  </motion.button>
                </div>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                style={{
                  ...styles.glass.light,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '1.5rem',
                  padding: theme.semanticSpacing.xl,
                  maxWidth: '32rem',
                  margin: '0 auto',
                }}
              >
                <CheckCircle style={{ color: theme.colors.success, margin: '0 auto', marginBottom: theme.semanticSpacing.lg }} size={48} />
                <h3 
                  style={{
                    ...styles.typography.h3,
                    color: theme.colors.text,
                    marginBottom: theme.semanticSpacing.md,
                  }}
                >
                  You're in!
                </h3>
                <p 
                  style={{
                    ...styles.typography.body,
                    color: theme.colors.textSecondary,
                    marginBottom: theme.semanticSpacing.lg,
                  }}
                >
                  You're #{queuePosition.toLocaleString()} in line — move up by sharing
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      backgroundColor: '#1DA1F2',
                      color: 'white',
                      border: 'none',
                      padding: `${theme.semanticSpacing.sm} ${theme.semanticSpacing.md}`,
                      borderRadius: '0.75rem',
                      fontSize: theme.typography.fontSize.sm,
                      fontWeight: theme.typography.fontWeight.medium,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: theme.semanticSpacing.sm,
                      justifyContent: 'center',
                    }}
                  >
                    <Twitter size={16} />
                    <span>Share on Twitter</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      ...styles.button.secondary,
                      display: 'flex',
                      alignItems: 'center',
                      gap: theme.semanticSpacing.sm,
                      justifyContent: 'center',
                    }}
                  >
                    <Mail size={16} />
                    <span>Share via Email</span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer 
        style={{
          backgroundColor: theme.colors.background,
          borderTop: `1px solid ${theme.colors.border}`,
          padding: `${theme.semanticSpacing.xl} ${theme.semanticSpacing.md}`,
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: theme.colors.primary }}
              >
                <Brain style={{ color: theme.colors.background }} size={16} />
              </div>
              <span 
                style={{
                  color: theme.colors.text,
                  fontWeight: theme.typography.fontWeight.semibold,
                }}
              >
                Dytto
              </span>
            </div>

            <div className="flex items-center space-x-6">
              {['Privacy', 'Terms'].map((item) => (
                <a 
                  key={item}
                  href="#" 
                  style={{
                    color: theme.colors.textSecondary,
                    fontSize: theme.typography.fontSize.sm,
                    textDecoration: 'none',
                    transition: theme.animations.transition.normal,
                  }}
                  onMouseEnter={(e) => e.target.style.color = theme.colors.primary}
                  onMouseLeave={(e) => e.target.style.color = theme.colors.textSecondary}
                >
                  {item}
                </a>
              ))}
              <Link
                to="/api"
                style={{
                  color: theme.colors.primary,
                  fontSize: theme.typography.fontSize.sm,
                  textDecoration: 'none',
                  fontWeight: theme.typography.fontWeight.medium,
                }}
              >
                API →
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Exit Intent Modal */}
      <AnimatePresence>
        {showExitIntent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ backgroundColor: theme.utils.alpha(theme.colors.background, 0.9) }}
            onClick={() => setShowExitIntent(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                ...styles.glass.medium,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '1.5rem',
                padding: theme.semanticSpacing.xl,
                maxWidth: '28rem',
                width: '100%',
                position: 'relative',
              }}
            >
              <button
                onClick={() => setShowExitIntent(false)}
                style={{
                  position: 'absolute',
                  top: theme.semanticSpacing.md,
                  right: theme.semanticSpacing.md,
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: theme.colors.textSecondary,
                }}
              >
                <X size={20} />
              </button>

              <div className="text-center">
                <h3 
                  style={{
                    ...styles.typography.h3,
                    color: theme.colors.text,
                    marginBottom: theme.semanticSpacing.md,
                  }}
                >
                  Before you go...
                </h3>
                <p 
                  style={{
                    ...styles.typography.body,
                    color: theme.colors.textSecondary,
                    marginBottom: theme.semanticSpacing.lg,
                  }}
                >
                  Let Dytto write you a free sample story tomorrow.
                </p>
                
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      style={{
                        padding: `${theme.semanticSpacing.md} ${theme.semanticSpacing.lg}`,
                        borderRadius: '0.75rem',
                        border: `1px solid ${theme.colors.border}`,
                        backgroundColor: theme.colors.surface,
                        color: theme.colors.text,
                        fontSize: theme.typography.fontSize.base,
                      }}
                    />
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        ...styles.button.primary,
                        width: '100%',
                      }}
                    >
                      Get My Free Story
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Demo Modal */}
      <AnimatePresence>
        {showDemo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ backgroundColor: theme.utils.alpha(theme.colors.background, 0.95) }}
            onClick={() => setShowDemo(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                ...styles.glass.medium,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '1.5rem',
                padding: theme.semanticSpacing.xl,
                maxWidth: '48rem',
                width: '100%',
                position: 'relative',
              }}
            >
              <button
                onClick={() => setShowDemo(false)}
                style={{
                  position: 'absolute',
                  top: theme.semanticSpacing.md,
                  right: theme.semanticSpacing.md,
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: theme.colors.textSecondary,
                }}
              >
                <X size={20} />
              </button>

              <div className="text-center mb-6">
                <h3 
                  style={{
                    ...styles.typography.h3,
                    color: theme.colors.text,
                    marginBottom: theme.semanticSpacing.md,
                  }}
                >
                  Tuesday, March 12th - "The Coffee Shop Discovery"
                </h3>
              </div>

              <div 
                style={{
                  backgroundColor: theme.colors.surface,
                  borderRadius: '1rem',
                  padding: theme.semanticSpacing.lg,
                  marginBottom: theme.semanticSpacing.lg,
                  lineHeight: '1.8',
                  color: theme.colors.textSecondary,
                }}
              >
                <p style={{ marginBottom: theme.semanticSpacing.md }}>
                  Your morning started with the usual routine, but something was different today. The detour you took to avoid construction led you to a small coffee shop you'd never noticed before.
                </p>
                <p style={{ marginBottom: theme.semanticSpacing.md }}>
                  The barista's recommendation of their signature lavender latte turned out to be exactly what you needed. As you sat by the window, watching the city wake up, you realized this unexpected discovery had already made your day better.
                </p>
                <p>
                  Sometimes the best moments come from the paths we didn't plan to take. Today's detour reminded you that there's always something new to discover, even in familiar places.
                </p>
              </div>

              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowDemo(false);
                    document.getElementById('email-capture').scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={{
                    ...styles.button.primary,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: theme.semanticSpacing.sm,
                  }}
                >
                  <span>Write Mine Next</span>
                  <ArrowRight size={18} />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WaitlistLandingPage;