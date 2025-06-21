import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Brain, Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useThemeStyles } from '../hooks/useThemeStyles';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, mode, toggleMode } = useTheme();
  const styles = useThemeStyles();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-6 left-6 right-6 z-50 rounded-full px-6 py-3"
      style={{
        ...styles.glass.medium,
        border: `1px solid ${theme.colors.border}`,
      }}
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: theme.colors.primary }}
          >
            <Brain style={{ color: theme.colors.background }} size={24} />
          </div>
          <span style={{ 
            color: theme.colors.text, 
            fontWeight: theme.typography.fontWeight.semibold,
            fontSize: theme.typography.fontSize.xl 
          }}>
            Dytto
          </span>
        </div>
        
        {/* Navigation Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {['Platform', 'App', 'API', 'Developers', 'Docs'].map((item) => (
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
        </div>

        {/* Auth buttons and theme toggle */}
        <div className="hidden md:flex items-center space-x-4">
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
            Get API Key
          </motion.button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
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
    </motion.nav>
  );
};

export default Navbar;