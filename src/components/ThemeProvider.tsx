import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme, createTheme } from '../theme';

interface ThemeContextType {
  theme: Theme;
  mode: 'light' | 'dark';
  toggleMode: () => void;
  setMode: (mode: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultMode?: 'light' | 'dark';
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultMode = 'light' 
}) => {
  const [mode, setModeState] = useState<'light' | 'dark'>(defaultMode);
  const [theme, setTheme] = useState(() => createTheme(defaultMode));

  // Update theme when mode changes
  useEffect(() => {
    setTheme(createTheme(mode));
  }, [mode]);

  // Persist mode preference
  useEffect(() => {
    const savedMode = localStorage.getItem('theme-mode') as 'light' | 'dark' | null;
    if (savedMode && savedMode !== mode) {
      setModeState(savedMode);
    }
  }, []);

  const setMode = (newMode: 'light' | 'dark') => {
    setModeState(newMode);
    localStorage.setItem('theme-mode', newMode);
  };

  const toggleMode = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  // Apply CSS custom properties for easy access in components
  useEffect(() => {
    const root = document.documentElement;
    const colors = theme.colors;
    
    // Set CSS custom properties
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    
    // Set spacing
    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });
    
    // Set typography
    root.style.setProperty('--font-sans', theme.typography.fontFamily.sans);
    root.style.setProperty('--font-mono', theme.typography.fontFamily.mono);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, mode, toggleMode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};