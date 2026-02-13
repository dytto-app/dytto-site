import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeProvider';
import { useThemeStyles } from '../hooks/useThemeStyles';
import { useAuth } from './AuthProvider';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, mode, toggleMode } = useTheme();
  const styles = useThemeStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCTAClick = () => {
    const ctaText = getCTAText();
    if (ctaText === 'Get API Key') {
      // Navigate to login if not authenticated, otherwise to API keys
      navigate(user ? '/settings/api-keys' : '/login');
    } else if (ctaText === 'Download App') {
      // Link to app store or waitlist
      window.open('https://apps.apple.com/app/dytto', '_blank');
    }
  };

  const isAPIPage = location.pathname === '/api';
  const isDocsPage = location.pathname.startsWith('/docs');
  const isFeedbackPage = location.pathname === '/feedback';
  const isHomePage = location.pathname === '/';
  const isBlogPage = location.pathname.startsWith('/blog');
  const isDemoPage = location.pathname === '/demo';
  const isLoginPage = location.pathname === '/login';

  // Dynamic navigation items based on current page - only functional sections
  const getNavItems = () => {
    if (isAPIPage) {
      return [
        { label: 'Platform', href: '#platform' },
        { label: 'API', href: '#api' }
      ];
    } else if (isHomePage) {
      return [
        { label: 'Features', href: '#features' },
        { label: 'Products', href: '#products' }
      ];
    } else {
      return []; // No section navigation for other pages
    }
  };

  const navItems = getNavItems();

  const handleNavClick = useCallback((href: string) => {
    setIsOpen(false);
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  const getCTAText = () => {
    if (isAPIPage) return 'Get API Key';
    if (isDocsPage) return 'Get API Key';
    if (isFeedbackPage) return 'Submit Feedback';
    if (isBlogPage) return 'Subscribe';
    if (isDemoPage) return 'View Demo';
    return 'Download App';
  };

  return (
    <>
      <motion.nav
        className="fixed top-3 sm:top-6 left-3 sm:left-6 right-3 sm:right-6 z-50 rounded-2xl sm:rounded-full px-4 sm:px-6 py-3"
        style={{
          ...styles.glass.medium,
          border: `1px solid ${theme.colors.border}`,
        }}
      >
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-center w-full" style={{ position: 'relative', minHeight: '2.5rem' }}>

          {/* Left Logo - Absolutely positioned */}
          <Link
            to="/"
            className="flex items-center space-x-2"
            style={{
              position: 'absolute',
              left: '0',
              top: '50%',
              transform: 'translateY(-50%)'
            }}
          >
            <img
              src="/adaptive-icon.png"
              alt="dytto"
              style={{
                width: '2rem',
                height: '2rem',
                borderRadius: '0.5rem',
              }}
            />
            <span style={{
              color: theme.colors.text,
              fontWeight: theme.typography.fontWeight.semibold,
              fontSize: '1.125rem',
            }}>
              dytto
            </span>
          </Link>

          {/* Center Navigation - Will be centered naturally */}
          <div className="flex items-center space-x-3" style={{ gap: '0.75rem' }}>
            {/* Section Navigation */}
            {navItems.length > 0 && (
              <motion.div
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                style={{ gap: '0.75rem' }}
              >
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item.href)}
                    style={{
                      color: theme.colors.textSecondary,
                      fontSize: theme.typography.fontSize.sm,
                      transition: theme.animations.transition.normal,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: `${theme.semanticSpacing.sm} 0`,
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLButtonElement).style.color = theme.colors.primary;
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLButtonElement).style.color = theme.colors.textSecondary;
                    }}
                  >
                    {item.label}
                  </button>
                ))}
                <div style={{ width: '1px', height: '1rem', backgroundColor: theme.colors.border, margin: '0 0.25rem' }} />
              </motion.div>
            )}

            {/* Page Links */}
            <Link
              to="/"
              style={{
                color: isHomePage ? theme.colors.primary : theme.colors.textSecondary,
                fontSize: theme.typography.fontSize.sm,
                transition: theme.animations.transition.normal,
                textDecoration: 'none',
                fontWeight: theme.typography.fontWeight.medium,
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLAnchorElement).style.color = theme.colors.primary;
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLAnchorElement).style.color = isHomePage ? theme.colors.primary : theme.colors.textSecondary;
              }}
            >
              App
            </Link>

            <Link
              to="/api"
              style={{
                color: isAPIPage ? theme.colors.primary : theme.colors.textSecondary,
                fontSize: theme.typography.fontSize.sm,
                transition: theme.animations.transition.normal,
                textDecoration: 'none',
                fontWeight: theme.typography.fontWeight.medium,
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLAnchorElement).style.color = theme.colors.primary;
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLAnchorElement).style.color = isAPIPage ? theme.colors.primary : theme.colors.textSecondary;
              }}
            >
              API
            </Link>

            <Link
              to="/docs"
              style={{
                color: isDocsPage ? theme.colors.primary : theme.colors.textSecondary,
                fontSize: theme.typography.fontSize.sm,
                transition: theme.animations.transition.normal,
                textDecoration: 'none',
                fontWeight: theme.typography.fontWeight.medium,
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLAnchorElement).style.color = theme.colors.primary;
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLAnchorElement).style.color = isDocsPage ? theme.colors.primary : theme.colors.textSecondary;
              }}
            >
              Docs
            </Link>

            <Link
              to="/blog"
              style={{
                color: isBlogPage ? theme.colors.primary : theme.colors.textSecondary,
                fontSize: theme.typography.fontSize.sm,
                transition: theme.animations.transition.normal,
                textDecoration: 'none',
                fontWeight: theme.typography.fontWeight.medium,
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLAnchorElement).style.color = theme.colors.primary;
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLAnchorElement).style.color = isBlogPage ? theme.colors.primary : theme.colors.textSecondary;
              }}
            >
              Blog
            </Link>

            <Link
              to="/demo"
              style={{
                color: isDemoPage ? theme.colors.primary : theme.colors.textSecondary,
                fontSize: theme.typography.fontSize.sm,
                transition: theme.animations.transition.normal,
                textDecoration: 'none',
                fontWeight: theme.typography.fontWeight.medium,
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLAnchorElement).style.color = theme.colors.primary;
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLAnchorElement).style.color = isDemoPage ? theme.colors.primary : theme.colors.textSecondary;
              }}
            >
              Demo
            </Link>

            <Link
              to="/feedback"
              style={{
                color: isFeedbackPage ? theme.colors.primary : theme.colors.textSecondary,
                fontSize: theme.typography.fontSize.sm,
                transition: theme.animations.transition.normal,
                textDecoration: 'none',
                fontWeight: theme.typography.fontWeight.medium,
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLAnchorElement).style.color = theme.colors.primary;
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLAnchorElement).style.color = isFeedbackPage ? theme.colors.primary : theme.colors.textSecondary;
              }}
            >
              Feedback
            </Link>

            <Link
              to="/login"
              style={{
                color: isLoginPage ? theme.colors.primary : theme.colors.textSecondary,
                fontSize: theme.typography.fontSize.sm,
                transition: theme.animations.transition.normal,
                textDecoration: 'none',
                fontWeight: theme.typography.fontWeight.medium,
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLAnchorElement).style.color = theme.colors.primary;
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLAnchorElement).style.color = isLoginPage ? theme.colors.primary : theme.colors.textSecondary;
              }}
            >
              Login
            </Link>

          </div>

          {/* Right CTA + Theme - Absolutely positioned */}
          <div
            className="flex items-center space-x-4"
            style={{
              gap: '0.75rem',
              position: 'absolute',
              right: '0',
              top: '50%',
              transform: 'translateY(-50%)'
            }}
          >
            <motion.button
              onClick={handleCTAClick}
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
                minWidth: '160px',
                textAlign: 'center',
                whiteSpace: 'nowrap',
              }}
            >
              {getCTAText()}
            </motion.button>

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
                (e.target as HTMLButtonElement).style.color = theme.colors.primary;
                (e.target as HTMLButtonElement).style.backgroundColor = theme.colors.surface;
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.color = theme.colors.textSecondary;
                (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
              }}
            >
              {mode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center justify-between lg:hidden w-full">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/adaptive-icon.png"
              alt="dytto"
              style={{
                width: '1.75rem',
                height: '1.75rem',
                borderRadius: '0.4rem',
              }}
            />
            <span style={{
              color: theme.colors.text,
              fontWeight: theme.typography.fontWeight.semibold,
              fontSize: '1rem',
            }}>
              dytto
            </span>
          </Link>

          <div className="flex items-center space-x-2">
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
                {/* Section Navigation (if applicable) */}
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleNavClick(item.href)}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      color: theme.colors.text,
                      fontSize: theme.typography.fontSize.lg,
                      fontWeight: theme.typography.fontWeight.medium,
                      padding: theme.semanticSpacing.md,
                      borderRadius: '0.75rem',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      transition: theme.animations.transition.normal,
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLButtonElement).style.backgroundColor = theme.colors.surface;
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
                    }}
                  >
                    {item.label}
                  </motion.button>
                ))}

                {/* Page Navigation - Always show */}
                {navItems.length > 0 && (
                  <div style={{
                    height: '1px',
                    backgroundColor: theme.colors.border,
                    margin: `${theme.semanticSpacing.md} 0`
                  }} />
                )}

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (navItems.length) * 0.1 }}
                >
                  <Link
                    to="/"
                    onClick={() => setIsOpen(false)}
                    style={{
                      display: 'block',
                      color: isHomePage ? theme.colors.primary : theme.colors.textSecondary,
                      fontSize: theme.typography.fontSize.lg,
                      fontWeight: theme.typography.fontWeight.medium,
                      padding: theme.semanticSpacing.md,
                      borderRadius: '0.75rem',
                      textDecoration: 'none',
                      transition: theme.animations.transition.normal,
                    }}
                  >
                    App
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (navItems.length + 1) * 0.1 }}
                >
                  <Link
                    to="/api"
                    onClick={() => setIsOpen(false)}
                    style={{
                      display: 'block',
                      color: isAPIPage ? theme.colors.primary : theme.colors.textSecondary,
                      fontSize: theme.typography.fontSize.lg,
                      fontWeight: theme.typography.fontWeight.medium,
                      padding: theme.semanticSpacing.md,
                      borderRadius: '0.75rem',
                      textDecoration: 'none',
                      transition: theme.animations.transition.normal,
                    }}
                  >
                    API
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (navItems.length + 1.5) * 0.1 }}
                >
                  <Link
                    to="/docs"
                    onClick={() => setIsOpen(false)}
                    style={{
                      display: 'block',
                      color: isDocsPage ? theme.colors.primary : theme.colors.textSecondary,
                      fontSize: theme.typography.fontSize.lg,
                      fontWeight: theme.typography.fontWeight.medium,
                      padding: theme.semanticSpacing.md,
                      borderRadius: '0.75rem',
                      textDecoration: 'none',
                      transition: theme.animations.transition.normal,
                    }}
                  >
                    Docs
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (navItems.length + 2) * 0.1 }}
                >
                  <Link
                    to="/blog"
                    onClick={() => setIsOpen(false)}
                    style={{
                      display: 'block',
                      color: isBlogPage ? theme.colors.primary : theme.colors.textSecondary,
                      fontSize: theme.typography.fontSize.lg,
                      fontWeight: theme.typography.fontWeight.medium,
                      padding: theme.semanticSpacing.md,
                      borderRadius: '0.75rem',
                      textDecoration: 'none',
                      transition: theme.animations.transition.normal,
                    }}
                  >
                    Blog
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (navItems.length + 3) * 0.1 }}
                >
                  <Link
                    to="/demo"
                    onClick={() => setIsOpen(false)}
                    style={{
                      display: 'block',
                      color: isDemoPage ? theme.colors.primary : theme.colors.textSecondary,
                      fontSize: theme.typography.fontSize.lg,
                      fontWeight: theme.typography.fontWeight.medium,
                      padding: theme.semanticSpacing.md,
                      borderRadius: '0.75rem',
                      textDecoration: 'none',
                      transition: theme.animations.transition.normal,
                    }}
                  >
                    Demo
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (navItems.length + 4) * 0.1 }}
                >
                  <Link
                    to="/feedback"
                    onClick={() => setIsOpen(false)}
                    style={{
                      display: 'block',
                      color: isFeedbackPage ? theme.colors.primary : theme.colors.textSecondary,
                      fontSize: theme.typography.fontSize.lg,
                      fontWeight: theme.typography.fontWeight.medium,
                      padding: theme.semanticSpacing.md,
                      borderRadius: '0.75rem',
                      textDecoration: 'none',
                      transition: theme.animations.transition.normal,
                    }}
                  >
                    Feedback
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (navItems.length + 5) * 0.1 }}
                >
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    style={{
                      display: 'block',
                      color: isLoginPage ? theme.colors.primary : theme.colors.textSecondary,
                      fontSize: theme.typography.fontSize.lg,
                      fontWeight: theme.typography.fontWeight.medium,
                      padding: theme.semanticSpacing.md,
                      borderRadius: '0.75rem',
                      textDecoration: 'none',
                      transition: theme.animations.transition.normal,
                    }}
                  >
                    Login
                  </Link>
                </motion.div>


                <div className="border-t pt-4" style={{ borderColor: theme.colors.border }}>
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    onClick={() => {
                      setIsOpen(false);
                      handleCTAClick();
                    }}
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
                    {getCTAText()}
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

export default React.memo(Navbar);
