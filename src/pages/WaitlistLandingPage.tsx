import React from 'react';
import Navbar from '../components/Navbar';
import EmailCapture from '../components/waitlist/EmailCapture';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Users, Zap, CheckCircle, Star } from 'lucide-react';
import { useTheme } from '../components/ThemeProvider';
import { useThemeStyles } from '../hooks/useThemeStyles';

const WaitlistLandingPage = () => {
  const { theme } = useTheme();
  const styles = useThemeStyles();

  const benefits = [
    {
      icon: Brain,
      title: 'Early Access to Dytto',
      description: 'Be among the first to experience context-aware AI that truly understands you',
      color: '#3B82F6'
    },
    {
      icon: Zap,
      title: 'MCP Server Integration',
      description: 'Make AI applications like Claude Desktop context-aware with our API',
      color: '#8B5CF6'
    },
    {
      icon: Users,
      title: 'Direct Team Access',
      description: 'Get a direct line to our development team for feedback and feature requests',
      color: '#10B981'
    },
    {
      icon: Sparkles,
      title: 'Completely Free',
      description: 'No hidden costs, no credit card required. Just pure AI innovation',
      color: '#F59E0B'
    }
  ];

  const stats = [
    { number: '12,000+', label: 'People Waiting' },
    { number: '50+', label: 'AI Researchers' },
    { number: '25+', label: 'Universities' },
    { number: '100%', label: 'Free Access' }
  ];

  return (
    <div style={styles.bg.primary} className="min-h-screen mobile-safe">
      <Navbar />
      
      {/* Hero Section - Mobile Optimized */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-24 px-4 sm:px-6">
        {/* Background Effects */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${theme.colors.background} 0%, ${theme.colors.backgroundSecondary} 50%, ${theme.colors.backgroundTertiary} 100%)`
          }}
        >
          <motion.div
            animate={{
              background: [
                `radial-gradient(circle at 20% 50%, ${theme.utils.alpha(theme.colors.primary, 0.03)} 0%, transparent 50%)`,
                `radial-gradient(circle at 80% 20%, ${theme.utils.alpha(theme.colors.primary, 0.05)} 0%, transparent 50%)`,
                `radial-gradient(circle at 40% 80%, ${theme.utils.alpha(theme.colors.primary, 0.03)} 0%, transparent 50%)`,
                `radial-gradient(circle at 20% 50%, ${theme.utils.alpha(theme.colors.primary, 0.03)} 0%, transparent 50%)`
              ]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          />
        </div>

        {/* Floating Elements - Desktop Only */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="absolute top-32 right-4 sm:right-8 rounded-2xl p-3 sm:p-4 hidden lg:block"
          style={{
            ...styles.glass.light,
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          <div className="flex items-center space-x-2 mb-2">
            <Users style={{ color: theme.colors.primary }} size={16} />
            <span 
              style={{ 
                color: theme.colors.text, 
                fontSize: theme.typography.fontSize.sm, 
                fontWeight: theme.typography.fontWeight.semibold 
              }}
            >
              12K+ Waiting
            </span>
          </div>
          <div 
            style={{ 
              color: theme.colors.textSecondary, 
              fontSize: theme.typography.fontSize.xs 
            }}
          >
            Join the community
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="absolute top-48 left-4 sm:left-8 rounded-2xl p-3 sm:p-4 hidden lg:block"
          style={{
            ...styles.glass.light,
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles style={{ color: theme.colors.primary }} size={16} />
            <span 
              style={{ 
                color: theme.colors.text, 
                fontSize: theme.typography.fontSize.sm, 
                fontWeight: theme.typography.fontWeight.semibold 
              }}
            >
              Beta Access
            </span>
          </div>
          <div 
            style={{ 
              color: theme.colors.textSecondary, 
              fontSize: theme.typography.fontSize.xs 
            }}
          >
            Coming Soon
          </div>
        </motion.div>

        {/* Main Content - Mobile Safe */}
        <div className="relative z-10 w-full max-w-4xl mx-auto mobile-safe">
          <EmailCapture 
            source="waitlist-landing"
            onSuccess={(email, position) => {
              console.log(`User ${email} joined at position ${position}`);
            }}
            onError={(error) => {
              console.error('Waitlist error:', error);
            }}
          />
        </div>
      </section>

      {/* Benefits Section - Mobile Optimized */}
      <section style={styles.bg.secondary} className="py-12 sm:py-16 lg:py-24 mobile-safe">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 sm:mb-12 lg:mb-16"
          >
            <h2 
              className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 mobile-text hero-text"
              style={{ color: theme.colors.text }}
            >
              Why join the{' '}
              <motion.span 
                key={`waitlist-gradient-${theme.mode}`}
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
                waitlist?
              </motion.span>
            </h2>
            <p 
              className="text-sm sm:text-base lg:text-lg xl:text-xl max-w-3xl mx-auto leading-relaxed mobile-text responsive-body"
              style={{ color: theme.colors.textSecondary }}
            >
              Get exclusive early access to the future of context-aware AI and help shape 
              the platform that will revolutionize how AI understands human context.
            </p>
          </motion.div>

          {/* Benefits Grid - Mobile First */}
          <div className="space-y-4 sm:space-y-6 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0 xl:gap-8 mb-8 sm:mb-12 lg:mb-16">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -2 }}
                className="group mobile-grid-item feature-card"
                style={{
                  ...styles.glass.light,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  transition: 'all 0.3s ease',
                }}
              >
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    className="flex-shrink-0"
                    style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      backgroundColor: theme.utils.alpha(benefit.color, 0.1),
                      borderRadius: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <benefit.icon style={{ color: benefit.color }} size={20} />
                  </motion.div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 
                      className="text-base sm:text-lg lg:text-xl font-semibold mb-2 leading-tight mobile-text"
                      style={{ color: theme.colors.text }}
                    >
                      {benefit.title}
                    </h3>
                    <p 
                      className="text-sm sm:text-base leading-relaxed mobile-text responsive-body"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats Section - Mobile Optimized */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mobile-grid-item"
            style={{
              ...styles.glass.light,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '1.5rem',
              padding: '1.5rem sm:2rem',
            }}
          >
            <h3 
              className="text-lg sm:text-xl lg:text-2xl font-bold text-center mb-6 sm:mb-8 mobile-text"
              style={{ color: theme.colors.text }}
            >
              Join the Community
            </h3>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center mobile-grid-item"
                >
                  <div 
                    className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-1 sm:mb-2 mobile-text"
                    style={{ color: theme.colors.primary }}
                  >
                    {stat.number}
                  </div>
                  <div 
                    className="text-xs sm:text-sm lg:text-base mobile-text"
                    style={{ color: theme.colors.textSecondary }}
                  >
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof Section - Mobile Optimized */}
      <section style={styles.bg.primary} className="py-12 sm:py-16 lg:py-24 mobile-safe">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 
              className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-6 sm:mb-8 mobile-text hero-text"
              style={{ color: theme.colors.text }}
            >
              Trusted by AI Researchers Worldwide
            </h2>
            
            <div className="space-y-4 sm:space-y-6 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0 xl:grid-cols-3 xl:gap-8">
              {[
                { name: 'Stanford AI Lab', type: 'University', users: '150+ researchers' },
                { name: 'MIT CSAIL', type: 'Research Lab', users: '200+ students' },
                { name: 'DeepMind', type: 'Industry', users: '50+ engineers' },
                { name: 'OpenAI', type: 'Industry', users: '75+ researchers' },
                { name: 'Berkeley AI', type: 'University', users: '100+ academics' },
                { name: 'Google Research', type: 'Industry', users: '125+ scientists' }
              ].map((org, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="mobile-grid-item feature-card"
                  style={{
                    ...styles.glass.light,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    textAlign: 'center',
                  }}
                >
                  <h3 
                    className="text-base sm:text-lg font-semibold mb-2 mobile-text"
                    style={{ color: theme.colors.text }}
                  >
                    {org.name}
                  </h3>
                  <p 
                    className="text-sm mb-1 mobile-text"
                    style={{ color: theme.colors.primary }}
                  >
                    {org.type}
                  </p>
                  <p 
                    className="text-xs mobile-text"
                    style={{ color: theme.colors.textSecondary }}
                  >
                    {org.users}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-6 sm:mt-8 lg:mt-12 flex items-center justify-center space-x-2 mobile-text"
              style={{ color: theme.colors.textTertiary }}
            >
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} style={{ color: theme.colors.primary }} className="fill-current" />
                ))}
              </div>
              <span className="text-sm">Rated 4.9/5 by early users</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section - Mobile Optimized */}
      <section style={styles.bg.secondary} className="py-12 sm:py-16 lg:py-24 mobile-safe">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mobile-grid-item"
            style={{
              ...styles.glass.medium,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '1.5rem',
              padding: '1.5rem sm:2rem',
              background: `linear-gradient(135deg, ${theme.utils.alpha(theme.colors.primary, 0.02)}, ${theme.utils.alpha(theme.colors.accent, 0.02)})`,
            }}
          >
            <h2 
              className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-4 mobile-text hero-text"
              style={{ color: theme.colors.text }}
            >
              Ready to shape the future of AI?
            </h2>
            <p 
              className="text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 leading-relaxed mobile-text responsive-body"
              style={{ color: theme.colors.textSecondary }}
            >
              Join thousands of researchers, developers, and AI enthusiasts who are 
              building the next generation of context-aware applications.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex items-center space-x-2">
                <CheckCircle style={{ color: theme.colors.success }} size={18} />
                <span className="text-sm mobile-text" style={{ color: theme.colors.textSecondary }}>No spam, ever</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle style={{ color: theme.colors.success }} size={18} />
                <span className="text-sm mobile-text" style={{ color: theme.colors.textSecondary }}>Unsubscribe anytime</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle style={{ color: theme.colors.success }} size={18} />
                <span className="text-sm mobile-text" style={{ color: theme.colors.textSecondary }}>Privacy first</span>
              </div>
            </div>

            <motion.a
              href="#top"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold transition-all duration-300 mobile-buttons"
              style={{
                backgroundColor: theme.colors.primary,
                color: theme.colors.background,
                boxShadow: theme.shadows.brand,
                textDecoration: 'none',
                minHeight: '48px',
              }}
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Join the Waitlist Now
            </motion.a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WaitlistLandingPage;