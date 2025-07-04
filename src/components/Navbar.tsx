import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Brain, Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from './ThemeProvider';
import { useThemeStyles } from '../hooks/useThemeStyles';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, mode, toggleMode } = useTheme();
  const styles = useThemeStyles();
  const location = useLocation();
  const isAPIPage = location.pathname === '/api';
  const isWaitlistPage = location.pathname === '/waitlist';

  const navItems = isAPIPage 
    ? ['Platform', 'API', 'Use Cases', 'Developers', 'Pricing']
    : ['Features', 'App', 'Products', 'Testimonials', 'Pricing'];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-3 sm:top-6 left-3 sm:left-6 right-3 sm:right-6 z-50 rounded-2xl sm:rounded-full px-4 sm:px-6 py-3"
        style={{
          ...styles.glass.medium,
          border: `1px solid ${theme.colors.border}`,
        }}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
            <div 
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center"
              style={{ backgroundColor: theme.colors.primary }}
            >
              <Brain style={{ color: theme.colors.background }} size={20} />
            </div>
            <span style={{ 
              color: theme.colors.text, 
              fontWeight: theme.typography.fontWeight.semibold,
              fontSize: theme.typography.fontSize.lg,
              '@media (min-width: 640px)': {
                fontSize: theme.typography.fontSize.xl
              }
            }}>
              Dytto
            </span>
          </Link>
          
          {/* Desktop Navigation Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase()}`} 
                style={{ 
                  color: theme.colors.textSecondary,
                  fontSize: theme.typography.fontSize.sm,
                  transition: theme.animations.transition.normal,
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = theme.colors.primary;
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = theme.colors.textSecondary;
                }}
              >
                {item}
              </a>
            ))}
            <Link
              to={isAPIPage ? '/' : '/api'}
              style={{ 
                color: theme.colors.primary,
                fontSize: theme.typography.fontSize.sm,
                transition: theme.animations.transition.normal,
                textDecoration: 'none',
                fontWeight: theme.typography.fontWeight.medium,
              }}
            >
              {isAPIPage ? 'App' : 'API'}
            </Link>
            {!isWaitlistPage && (
              <Link
                to="/waitlist"
                style={{ 
                  color: theme.colors.textSecondary,
                  fontSize: theme.typography.fontSize.sm,
                  transition: theme.animations.transition.normal,
                  textDecoration: 'none',
                  fontWeight: theme.typography.fontWeight.medium,
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = theme.colors.primary;
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = theme.colors.textSecondary;
                }}
              >
                Waitlist
              </Link>
            )}
          </div>

          {/* Desktop Auth buttons and theme toggle */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={toggleMode}
              style={{
                color: theme.colors.textSecondary,
                padding: theme.semanticSpacing.sm,
                borderRadius: '0.5rem',
                transition: theme.animations.transition.normal,
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.target.style.color = theme.colors.primary;
                e.target.style.backgroundColor = theme.colors.surface;
              }}
              onMouseLeave={(e) => {
                e.target.style.color = theme.colors.textSecondary;
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              {mode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            
            <button 
              style={{ 
                color: theme.colors.textSecondary,
                fontSize: theme.typography.fontSize.sm,
                transition: theme.animations.transition.normal,
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: `${theme.semanticSpacing.sm} ${theme.semanticSpacing.md}`,
                borderRadius: '0.5rem',
              }}
              onMouseEnter={(e) => {
                e.target.style.color = theme.colors.primary;
                e.target.style.backgroundColor = theme.colors.surface;
              }}
              onMouseLeave={(e) => {
                e.target.style.color = theme.colors.textSecondary;
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              Sign In
            </button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
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
              {isAPIPage ? 'Get API Key' : isWaitlistPage ? 'Join Waitlist' : 'Download App'}
            </motion.button>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={toggleMode}
              style={{
                color: theme.colors.textSecondary,
                padding: theme.semanticSpacing.sm,
                borderRadius: '0.5rem',
                transition: theme.animations.transition.normal,
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {mode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            
            <button
              style={{ 
                color: theme.colors.text,
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: theme.semanticSpacing.sm,
              }}
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
            style={{ backgroundColor: theme.utils.alpha(theme.colors.background, 0.95) }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-20 left-3 right-3 rounded-2xl p-6"
              style={{
                ...styles.glass.medium,
                border: `1px solid ${theme.colors.border}`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-4">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setIsOpen(false)}
                    style={{
                      display: 'block',
                      color: theme.colors.text,
                      fontSize: theme.typography.fontSize.lg,
                      fontWeight: theme.typography.fontWeight.medium,
                      padding: theme.semanticSpacing.md,
                      borderRadius: '0.75rem',
                      textDecoration: 'none',
                      transition: theme.animations.transition.normal,
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = theme.colors.surface;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                    }}
                  >
                    {item}
                  </motion.a>
                ))}
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.1 }}
                >
                  <Link
                    to={isAPIPage ? '/' : '/api'}
                    onClick={() => setIsOpen(false)}
                    style={{
                      display: 'block',
                      color: theme.colors.primary,
                      fontSize: theme.typography.fontSize.lg,
                      fontWeight: theme.typography.fontWeight.medium,
                      padding: theme.semanticSpacing.md,
                      borderRadius: '0.75rem',
                      textDecoration: 'none',
                      transition: theme.animations.transition.normal,
                    }}
                  >
                    {isAPIPage ? 'App' : 'API'}
                  </Link>
                </motion.div>

                {!isWaitlistPage && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (navItems.length + 1) * 0.1 }}
                  >
                    <Link
                      to="/waitlist"
                      onClick={() => setIsOpen(false)}
                      style={{
                        display: 'block',
                        color: theme.colors.textSecondary,
                        fontSize: theme.typography.fontSize.lg,
                        fontWeight: theme.typography.fontWeight.medium,
                        padding: theme.semanticSpacing.md,
                        borderRadius: '0.75rem',
                        textDecoration: 'none',
                        transition: theme.animations.transition.normal,
                      }}
                    >
                      Waitlist
                    </Link>
                  </motion.div>
                )}
                
                <div className="border-t pt-4" style={{ borderColor: theme.colors.border }}>
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    style={{
                      width: '100%',
                      color: theme.colors.textSecondary,
                      fontSize: theme.typography.fontSize.lg,
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: theme.semanticSpacing.md,
                      borderRadius: '0.75rem',
                      textAlign: 'left',
                      marginBottom: theme.semanticSpacing.sm,
                    }}
                  >
                    Sign In
                  </motion.button>
                  
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    style={{
                      width: '100%',
                      backgroundColor: theme.colors.primary,
                      color: theme.colors.background,
                      padding: theme.semanticSpacing.md,
                      borderRadius: '0.75rem',
                      fontSize: theme.typography.fontSize.lg,
                      fontWeight: theme.typography.fontWeight.semibold,
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {isAPIPage ? 'Get API Key' : isWaitlistPage ? 'Join Waitlist' : 'Download App'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;