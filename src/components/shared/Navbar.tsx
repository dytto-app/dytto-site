'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from './ThemeProvider';
import { useThemeStyles } from '@/hooks/useThemeStyles';
import { useAuth } from './AuthProvider';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, mode, toggleMode } = useTheme();
  const styles = useThemeStyles();
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const handleCTAClick = () => {
    const ctaText = getCTAText();
    if (ctaText === 'Get API Key') {
      router.push(user ? '/settings/api-keys' : '/login');
    } else if (ctaText === 'Download App') {
      window.open('https://apps.apple.com/app/dytto', '_blank');
    }
  };

  const isAPIPage = pathname === '/api-docs' || pathname === '/api';
  const isDocsPage = pathname?.startsWith('/docs');
  const isFeedbackPage = pathname === '/feedback';
  const isHomePage = pathname === '/';
  const isBlogPage = pathname?.startsWith('/blog');
  const isDemoPage = pathname === '/demo';
  const isLoginPage = pathname === '/login';

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

  const navLinks = [
    { label: 'App', href: '/', active: isHomePage },
    { label: 'API', href: '/api-docs', active: isAPIPage },
    { label: 'Docs', href: '/docs', active: isDocsPage },
    { label: 'Blog', href: '/blog', active: isBlogPage },
    { label: 'Demo', href: '/demo', active: isDemoPage },
    { label: 'Feedback', href: '/feedback', active: isFeedbackPage },
    { label: 'Login', href: '/login', active: isLoginPage },
  ];

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
          {/* Left Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2"
            style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)' }}
          >
            <img
              src="/adaptive-icon.png"
              alt="dytto"
              style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem' }}
            />
            <span style={{ color: theme.colors.text, fontWeight: theme.typography.fontWeight.semibold, fontSize: '1.125rem' }}>
              dytto
            </span>
          </Link>

          {/* Center Links */}
          <div className="flex items-center" style={{ gap: '0.75rem' }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  color: link.active ? theme.colors.primary : theme.colors.textSecondary,
                  fontSize: theme.typography.fontSize.sm,
                  textDecoration: 'none',
                  fontWeight: theme.typography.fontWeight.medium,
                  whiteSpace: 'nowrap',
                  transition: theme.animations.transition.normal,
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right CTA + Theme */}
          <div className="flex items-center" style={{ gap: '0.75rem', position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}>
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
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {mode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center justify-between lg:hidden w-full">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/adaptive-icon.png" alt="dytto" style={{ width: '1.75rem', height: '1.75rem', borderRadius: '0.4rem' }} />
            <span style={{ color: theme.colors.text, fontWeight: theme.typography.fontWeight.semibold, fontSize: '1rem' }}>
              dytto
            </span>
          </Link>
          <div className="flex items-center space-x-2">
            <button onClick={toggleMode} style={{ color: theme.colors.textSecondary, padding: theme.semanticSpacing.sm, backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
              {mode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button style={{ color: theme.colors.text, backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: theme.semanticSpacing.sm }} onClick={() => setIsOpen(!isOpen)}>
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
              style={{ ...styles.glass.medium, border: `1px solid ${theme.colors.border}` }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-4">
                {navLinks.map((link, i) => (
                  <motion.div key={link.href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      style={{
                        display: 'block',
                        color: link.active ? theme.colors.primary : theme.colors.textSecondary,
                        fontSize: theme.typography.fontSize.lg,
                        fontWeight: theme.typography.fontWeight.medium,
                        padding: theme.semanticSpacing.md,
                        borderRadius: '0.75rem',
                        textDecoration: 'none',
                      }}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <div className="border-t pt-4" style={{ borderColor: theme.colors.border }}>
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    onClick={() => { setIsOpen(false); handleCTAClick(); }}
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
