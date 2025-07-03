import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Star, MapPin, Apple, Play } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useThemeStyles } from '../hooks/useThemeStyles';

const features = [
  {
    icon: Calendar,
    title: 'Daily Context Collection',
    description: 'Automatically captures your photos, places, and activities'
  },
  {
    icon: Star,
    title: 'AI-Powered Stories',
    description: 'Transforms your day into meaningful narratives'
  },
  {
    icon: MapPin,
    title: 'Smart Recommendations',
    description: 'Personalized suggestions based on your context'
  }
];

const AppShowcase = () => {
  const { theme } = useTheme();
  const styles = useThemeStyles();

  return (
    <section style={styles.bg.secondary} className="py-12 sm:py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <h2 
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6"
            style={{ color: theme.colors.text }}
          >
            Experience{' '}
            <motion.span 
              key={`app-gradient-${theme.mode}`}
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
              Dytto
            </motion.span>{' '}
            on mobile
          </h2>
          <p 
            className="text-base sm:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed"
            style={{ color: theme.colors.textSecondary }}
          >
            Our flagship app demonstrates the power of context-aware AI. 
            Transform your daily experiences into meaningful stories and insights.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* App Screenshots - Mobile Optimized */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative order-2 lg:order-1 flex justify-center"
          >
            <div className="flex justify-center space-x-2 sm:space-x-4 scale-75 sm:scale-90 lg:scale-100">
              {/* Phone mockups with screenshots */}
              <div className="relative">
                <div 
                  className="w-40 sm:w-48 md:w-56 lg:w-64 h-80 sm:h-96 md:h-[450px] lg:h-[520px] rounded-[2rem] lg:rounded-[3rem] p-1.5 lg:p-2 shadow-2xl"
                  style={{ backgroundColor: theme.colors.text }}
                >
                  <div 
                    className="w-full h-full rounded-[1.5rem] lg:rounded-[2.5rem] overflow-hidden"
                    style={{ backgroundColor: theme.colors.background }}
                  >
                    <img 
                      src="/home.jpg"
                      alt="Dytto Home Screen"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                {/* Floating elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="hidden sm:block absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.background,
                  }}
                >
                  Today: 9 Photos
                </motion.div>
              </div>
              
              <div className="relative mt-4 sm:mt-8">
                <div 
                  className="w-40 sm:w-48 md:w-56 lg:w-64 h-80 sm:h-96 md:h-[450px] lg:h-[520px] rounded-[2rem] lg:rounded-[3rem] p-1.5 lg:p-2 shadow-2xl"
                  style={{ backgroundColor: theme.colors.text }}
                >
                  <div 
                    className="w-full h-full rounded-[1.5rem] lg:rounded-[2.5rem] overflow-hidden"
                    style={{ backgroundColor: theme.colors.background }}
                  >
                    <img 
                      src="/story.jpg"
                      alt="Dytto Story Screen"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  className="hidden sm:block absolute -top-2 -left-2 px-3 py-1 rounded-full text-xs font-semibold border"
                  style={{
                    backgroundColor: theme.colors.surface,
                    color: theme.colors.primary,
                    border: `1px solid ${theme.colors.primary}`,
                  }}
                >
                  AI Generated
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Features and Download */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 sm:space-y-8 order-1 lg:order-2"
          >
            <div>
              <h3 
                className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6"
                style={{ color: theme.colors.text }}
              >
                Your life, intelligently understood
              </h3>
              <p 
                className="text-base sm:text-lg lg:text-xl leading-relaxed mb-6 sm:mb-8"
                style={{ color: theme.colors.textSecondary }}
              >
                Dytto automatically collects context from your daily life and uses advanced AI 
                to generate meaningful stories, provide personalized recommendations, and help 
                you reflect on your experiences.
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-start space-x-4"
                >
                  <div 
                    className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: theme.utils.alpha(theme.colors.primary, 0.1),
                      border: `1px solid ${theme.utils.alpha(theme.colors.primary, 0.3)}`,
                    }}
                  >
                    <feature.icon style={{ color: theme.colors.primary }} size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 
                      className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2"
                      style={{ color: theme.colors.text }}
                    >
                      {feature.title}
                    </h4>
                    <p 
                      className="text-sm sm:text-base leading-relaxed"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="pt-6 sm:pt-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-medium transition-all duration-300"
                  style={{
                    backgroundColor: theme.colors.text,
                    border: `1px solid ${theme.colors.border}`,
                    color: theme.colors.background,
                    minHeight: '56px',
                  }}
                >
                  <Apple size={20} />
                  <div className="text-left">
                    <div className="text-xs opacity-70">Download on the</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-medium transition-all duration-300"
                  style={{
                    backgroundColor: theme.colors.text,
                    border: `1px solid ${theme.colors.border}`,
                    color: theme.colors.background,
                    minHeight: '56px',
                  }}
                >
                  <Play size={20} />
                  <div className="text-left">
                    <div className="text-xs opacity-70">Get it on</div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                </motion.button>
              </div>
              
              <div 
                className="flex items-center justify-center sm:justify-start space-x-2 mt-4 text-sm"
                style={{ color: theme.colors.textSecondary }}
              >
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} style={{ color: theme.colors.primary }} className="fill-current" />
                  ))}
                </div>
                <span>4.8 • 10K+ downloads</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AppShowcase;