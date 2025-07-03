import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  ArrowRight, 
  Play, 
  X, 
  Check, 
  ChevronDown, 
  ChevronUp,
  Star,
  Users,
  Shield,
  Zap,
  Twitter,
  Mail,
  Copy,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../components/ThemeProvider';
import { useThemeStyles } from '../hooks/useThemeStyles';
import EmailCapture from '../components/waitlist/EmailCapture';

const WaitlistLandingPage = () => {
  const { theme, mode, toggleMode } = useTheme();
  const styles = useThemeStyles();
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [queuePosition, setQueuePosition] = useState(0);
  const [showDemo, setShowDemo] = useState(false);
  const [storiesCount, setStoriesCount] = useState(12742);
  const [openFAQ, setOpenFAQ] = useState(null);

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

  // Animate stories counter
  useEffect(() => {
    const interval = setInterval(() => {
      setStoriesCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleEmailSuccess = (email: string, position: number) => {
    setEmail(email);
    setQueuePosition(position);
    setIsSubmitted(true);
    setShowExitIntent(false);
  };

  const handleEmailError = (error: string) => {
    console.error('Email submission error:', error);
    // You could show a toast notification here
  };

  const shareOnTwitter = () => {
    const text = "Just joined the Dytto waitlist! AI that writes your life story automatically. 🤖📖";
    const url = "https://dytto.ai";
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const shareViaEmail = () => {
    const subject = "Check out Dytto - AI that writes your life story";
    const body = "I just joined the Dytto waitlist! It's an AI that automatically writes your life story from your daily experiences. Thought you might be interested: https://dytto.ai";
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const faqItems = [
    {
      question: "Will this drain my phone battery?",
      answer: "Dytto is optimized for minimal battery usage. We use efficient background processing and only collect data when necessary. Most users report less than 2% additional battery drain."
    },
    {
      question: "How is my privacy protected?",
      answer: "Your data is encrypted end-to-end and stored locally on your device. You have complete control over what's shared and can revoke access at any time. We never sell your personal data."
    },
    {
      question: "How much will it cost?",
      answer: "Dytto will be free to start with premium features available through subscription. Early beta users get 6 months of premium features free."
    },
    {
      question: "Can I export my stories?",
      answer: "Yes! You can export your stories in multiple formats including PDF, text, and even create beautiful photo books. Your stories are always yours to keep."
    },
    {
      question: "Which platforms will be supported?",
      answer: "We're launching on iOS first, with Android following shortly after. Web access for reading and managing your stories will be available from day one."
    },
    {
      question: "When will it be available?",
      answer: "We're planning to launch the beta in Q2 2024. Waitlist members will get early access and priority support during the beta period."
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
          
          <div className="hidden md:flex items-center space-x-6">
            <a 
              href="#how-it-works"
              style={{ 
                color: theme.colors.textSecondary,
                fontSize: theme.typography.fontSize.sm,
                textDecoration: 'none',
              }}
            >
              How it works
            </a>
            <Link
              to="/api"
              style={{ 
                color: theme.colors.textSecondary,
                fontSize: theme.typography.fontSize.sm,
                textDecoration: 'none',
              }}
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
            }}
          >
            Get Early Access
          </motion.button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-24">
        <div className="max-w-4xl mx-auto text-center">
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
              marginBottom: theme.semanticSpacing['3xl'],
              fontSize: 'clamp(1.125rem, 4vw, 1.5rem)',
              lineHeight: '1.6',
            }}
          >
            Automatic nightly stories from your day.
          </motion.p>

          {/* Phone Mockup with Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
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
                  {/* Animated Timeline → Story Transition */}
                  <motion.div
                    animate={{ 
                      opacity: [1, 0, 1],
                      scale: [1, 0.95, 1]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0"
                  >
                    <img 
                      src="/home.jpg"
                      alt="Timeline View"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <motion.div
                    animate={{ 
                      opacity: [0, 1, 0],
                      scale: [0.95, 1, 0.95]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 2
                    }}
                    className="absolute inset-0"
                  >
                    <img 
                      src="/story.jpg"
                      alt="Generated Story"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
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
      </section>

      {/* 3 Quick Benefits */}
      <section className="py-24 px-6" style={styles.bg.secondary}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Zero effort",
                description: "No typing, no streaks. Just live your life and read your story each night."
              },
              {
                icon: Star,
                title: "Story worth rereading",
                description: "2-minute narrative, every night. Beautifully crafted by AI that understands you."
              },
              {
                icon: Shield,
                title: "Your data, your device",
                description: "Encrypted, revocable. Complete control over your personal information."
              }
            ].map((benefit, index) => (
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
                    width: '4rem',
                    height: '4rem',
                    backgroundColor: theme.utils.alpha(theme.colors.primary, 0.1),
                    border: `1px solid ${theme.utils.alpha(theme.colors.primary, 0.3)}`,
                    borderRadius: '1rem',
                    marginBottom: theme.semanticSpacing.lg,
                  }}
                >
                  <benefit.icon style={{ color: theme.colors.primary }} size={28} />
                </motion.div>
                <h3 
                  style={{
                    ...styles.typography.h4,
                    color: theme.colors.text,
                    marginBottom: theme.semanticSpacing.md,
                  }}
                >
                  {benefit.title}
                </h3>
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
            className="text-center mt-16"
          >
            <button 
              onClick={() => document.getElementById('email-capture').scrollIntoView({ behavior: 'smooth' })}
              style={{
                ...styles.button.primary,
                display: 'inline-flex',
                alignItems: 'center',
                gap: theme.semanticSpacing.sm,
              }}
            >
              <span>Get Early Access</span>
              <ArrowRight size={20} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6" style={styles.bg.primary}>
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
              How it works
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: "①",
                title: "Install & grant sensors",
                description: "Give Dytto access to your photos, location, and activity data. Everything stays on your device."
              },
              {
                step: "②", 
                title: "Live your day",
                description: "Go about your normal routine. Dytto quietly observes and learns your patterns."
              },
              {
                step: "③",
                title: "Read tonight's chapter",
                description: "Every evening, discover a beautiful 2-minute story about your day, written just for you."
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <div 
                  style={{
                    fontSize: '4rem',
                    fontWeight: theme.typography.fontWeight.bold,
                    color: theme.colors.primary,
                    marginBottom: theme.semanticSpacing.lg,
                  }}
                >
                  {step.step}
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
            className="text-center mt-16"
          >
            <button 
              onClick={() => document.getElementById('email-capture').scrollIntoView({ behavior: 'smooth' })}
              style={{
                ...styles.button.primary,
                display: 'inline-flex',
                alignItems: 'center',
                gap: theme.semanticSpacing.sm,
              }}
            >
              <span>Reserve your spot</span>
              <ArrowRight size={20} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Live Sample Story */}
      <section className="py-24 px-6" style={styles.bg.secondary}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <h2 
              style={{
                ...styles.typography.h1,
                color: theme.colors.text,
                marginBottom: theme.semanticSpacing.lg,
                fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              }}
            >
              See it in action
            </h2>
            <p 
              style={{
                ...styles.typography.bodyLarge,
                color: theme.colors.textSecondary,
              }}
            >
              Here's what a real Dytto story looks like
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
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
            <div className="text-left mb-6">
              <h3 
                style={{
                  ...styles.typography.h4,
                  color: theme.colors.text,
                  marginBottom: theme.semanticSpacing.sm,
                }}
              >
                Tuesday, March 12th
              </h3>
              <div 
                style={{
                  ...styles.typography.caption,
                  color: theme.colors.textSecondary,
                }}
              >
                Generated at 9:47 PM
              </div>
            </div>

            <div 
              style={{
                ...styles.typography.body,
                color: theme.colors.textSecondary,
                lineHeight: '1.8',
                textAlign: 'left',
              }}
            >
              "The morning started with that perfect golden light streaming through your kitchen window as you made coffee—the same ritual that grounds you each day. Your walk to the farmer's market felt different today; maybe it was the way the cherry blossoms caught your attention, or how you lingered at the flower stand longer than usual.
              <br /><br />
              The afternoon brought unexpected joy when you discovered that little bookshop tucked between the café and the vintage store. Three hours disappeared as you lost yourself in the poetry section, and that conversation with the owner about Neruda felt like finding a kindred spirit..."
            </div>

            <div className="mt-8 flex items-center justify-between">
              <div 
                style={{
                  ...styles.typography.caption,
                  color: theme.colors.primary,
                  fontWeight: theme.typography.fontWeight.medium,
                }}
              >
                Click to read full story
              </div>
              <ArrowRight style={{ color: theme.colors.primary }} size={20} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12"
          >
            <button 
              onClick={() => document.getElementById('email-capture').scrollIntoView({ behavior: 'smooth' })}
              style={{
                ...styles.button.primary,
                display: 'inline-flex',
                alignItems: 'center',
                gap: theme.semanticSpacing.sm,
                fontSize: theme.typography.fontSize.lg,
                padding: `${theme.semanticSpacing.md} ${theme.semanticSpacing.xl}`,
              }}
            >
              <span>Write Mine Next</span>
              <ArrowRight size={20} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Social Proof / FOMO */}
      <section className="py-24 px-6" style={styles.bg.primary}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                ...styles.typography.h2,
                color: theme.colors.primary,
                marginBottom: theme.semanticSpacing.md,
                fontSize: 'clamp(2rem, 5vw, 3rem)',
              }}
            >
              {storiesCount.toLocaleString()}
            </motion.div>
            <p 
              style={{
                ...styles.typography.bodyLarge,
                color: theme.colors.textSecondary,
              }}
            >
              stories written so far
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                initials: "SJ",
                quote: "I never realized how beautiful my ordinary days were until Dytto started writing them down.",
                name: "Sarah J."
              },
              {
                initials: "MR",
                quote: "It's like having a personal biographer who actually gets me. The stories are so thoughtful.",
                name: "Marcus R."
              },
              {
                initials: "EW",
                quote: "Reading my Dytto stories has become my favorite part of each day. Pure magic.",
                name: "Emma W."
              }
            ].map((testimonial, index) => (
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
                <div className="flex items-center mb-4">
                  <div 
                    style={{
                      width: '3rem',
                      height: '3rem',
                      backgroundColor: theme.colors.primary,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: theme.colors.background,
                      fontWeight: theme.typography.fontWeight.semibold,
                      marginRight: theme.semanticSpacing.md,
                    }}
                  >
                    {testimonial.initials}
                  </div>
                  <div className="flex items-center space-x-1">
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
                <div 
                  style={{
                    ...styles.typography.caption,
                    color: theme.colors.textTertiary,
                  }}
                >
                  — {testimonial.name}
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
            <button 
              onClick={() => document.getElementById('email-capture').scrollIntoView({ behavior: 'smooth' })}
              style={{
                ...styles.button.primary,
                display: 'inline-flex',
                alignItems: 'center',
                gap: theme.semanticSpacing.sm,
                fontSize: theme.typography.fontSize.lg,
                padding: `${theme.semanticSpacing.md} ${theme.semanticSpacing.xl}`,
              }}
            >
              <span>Join the Private Beta</span>
              <ArrowRight size={20} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6" style={styles.bg.secondary}>
        <div className="max-w-4xl mx-auto">
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
              Questions?
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
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
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
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
                    {item.question}
                  </span>
                  {openFAQ === index ? 
                    <ChevronUp style={{ color: theme.colors.primary }} size={20} /> :
                    <ChevronDown style={{ color: theme.colors.primary }} size={20} />
                  }
                </button>
                <AnimatePresence>
                  {openFAQ === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        borderTop: `1px solid ${theme.colors.border}`,
                        padding: theme.semanticSpacing.lg,
                        paddingTop: theme.semanticSpacing.md,
                      }}
                    >
                      <p 
                        style={{
                          ...styles.typography.body,
                          color: theme.colors.textSecondary,
                          lineHeight: '1.6',
                        }}
                      >
                        {item.answer}
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
            className="text-center mt-16"
          >
            <button 
              onClick={() => document.getElementById('email-capture').scrollIntoView({ behavior: 'smooth' })}
              style={{
                ...styles.button.primary,
                display: 'inline-flex',
                alignItems: 'center',
                gap: theme.semanticSpacing.sm,
              }}
            >
              <span>Get Early Access</span>
              <ArrowRight size={20} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Email Capture Section */}
      <section id="email-capture" className="py-32 px-6" style={styles.bg.primary}>
        <div className="max-w-2xl mx-auto">
          {!isSubmitted ? (
            <EmailCapture 
              onSuccess={handleEmailSuccess}
              onError={handleEmailError}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              style={{
                ...styles.glass.light,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '1.5rem',
                padding: theme.semanticSpacing.xl,
                textAlign: 'center',
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
                  ...styles.typography.bodyLarge,
                  color: theme.colors.textSecondary,
                  marginBottom: theme.semanticSpacing.lg,
                }}
              >
                You're #{queuePosition.toLocaleString()} in line — move up by sharing
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={shareOnTwitter}
                  style={{
                    ...styles.button.primary,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: theme.semanticSpacing.sm,
                  }}
                >
                  <Twitter size={18} />
                  <span>Share on Twitter</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={shareViaEmail}
                  style={{
                    ...styles.button.secondary,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: theme.semanticSpacing.sm,
                  }}
                >
                  <Mail size={18} />
                  <span>Share via Email</span>
                </motion.button>
              </div>
            </motion.div>
          )}
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
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div 
                style={{
                  width: '2rem',
                  height: '2rem',
                  backgroundColor: theme.colors.primary,
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
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
              <a 
                href="#" 
                style={{ 
                  color: theme.colors.textSecondary, 
                  fontSize: theme.typography.fontSize.sm,
                  textDecoration: 'none',
                }}
              >
                Privacy
              </a>
              <a 
                href="#" 
                style={{ 
                  color: theme.colors.textSecondary, 
                  fontSize: theme.typography.fontSize.sm,
                  textDecoration: 'none',
                }}
              >
                Terms
              </a>
              <Link 
                to="/api" 
                style={{ 
                  color: theme.colors.primary, 
                  fontSize: theme.typography.fontSize.sm,
                  textDecoration: 'none',
                  fontWeight: theme.typography.fontWeight.medium,
                }}
              >
                API
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Demo Modal */}
      <AnimatePresence>
        {showDemo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: theme.utils.alpha(theme.colors.background, 0.9) }}
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
                maxWidth: '32rem',
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
                <X size={24} />
              </button>
              
              <h3 
                style={{
                  ...styles.typography.h3,
                  color: theme.colors.text,
                  marginBottom: theme.semanticSpacing.lg,
                }}
              >
                Sample Story: Tuesday, March 12th
              </h3>
              
              <div 
                style={{
                  ...styles.typography.body,
                  color: theme.colors.textSecondary,
                  lineHeight: '1.8',
                  marginBottom: theme.semanticSpacing.xl,
                }}
              >
                "The morning started with that perfect golden light streaming through your kitchen window as you made coffee—the same ritual that grounds you each day. Your walk to the farmer's market felt different today; maybe it was the way the cherry blossoms caught your attention, or how you lingered at the flower stand longer than usual.
                <br /><br />
                The afternoon brought unexpected joy when you discovered that little bookshop tucked between the café and the vintage store. Three hours disappeared as you lost yourself in the poetry section, and that conversation with the owner about Neruda felt like finding a kindred spirit.
                <br /><br />
                As evening approached, you found yourself on the park bench where you used to sit with your grandmother, watching the sunset paint the sky in shades of amber and rose. In that quiet moment, surrounded by the day's small discoveries, you realized that happiness isn't always about the grand gestures—sometimes it's about noticing the poetry hidden in ordinary Tuesday afternoons."
              </div>
              
              <button 
                onClick={() => {
                  setShowDemo(false);
                  document.getElementById('email-capture').scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  ...styles.button.primary,
                  width: '100%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: theme.semanticSpacing.sm,
                }}
              >
                <span>Write Mine Next</span>
                <ArrowRight size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exit Intent Modal */}
      <AnimatePresence>
        {showExitIntent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
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
                textAlign: 'center',
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
                <X size={24} />
              </button>
              
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
              
              <EmailCapture 
                onSuccess={(email, position) => {
                  handleEmailSuccess(email, position);
                  setShowExitIntent(false);
                }}
                onError={handleEmailError}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WaitlistLandingPage;