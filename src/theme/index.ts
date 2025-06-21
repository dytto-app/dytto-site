import { lightTheme, darkTheme } from './colors';
import { spacing, semanticSpacing } from './spacing';
import { typography, textStyles } from './typography';
import { shadows, glassEffects } from './shadows';

// Main theme object
export const createTheme = (mode: 'light' | 'dark' = 'light') => {
  const colorTheme = mode === 'light' ? lightTheme : darkTheme;
  
  return {
    mode,
    colors: colorTheme.colors,
    spacing,
    semanticSpacing,
    typography,
    textStyles,
    shadows,
    glassEffects,
    
    // Utility functions
    utils: {
      // Generate responsive values
      responsive: (base: string, sm?: string, md?: string, lg?: string, xl?: string) => ({
        base,
        ...(sm && { sm }),
        ...(md && { md }),
        ...(lg && { lg }),
        ...(xl && { xl }),
      }),
      
      // Generate color with opacity
      alpha: (color: string, opacity: number) => {
        // Simple implementation - in real app you'd use a color library
        return `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
      },
      
      // Generate gradient
      gradient: (from: string, to: string, direction = 'to right') => 
        `linear-gradient(${direction}, ${from}, ${to})`,
    },
    
    // Breakpoints for responsive design
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    
    // Animation presets
    animations: {
      transition: {
        fast: '150ms ease-in-out',
        normal: '250ms ease-in-out',
        slow: '350ms ease-in-out',
      },
      easing: {
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
    },
  };
};

export type Theme = ReturnType<typeof createTheme>;

// Default themes
export const theme = createTheme('light');
export const darkThemeObj = createTheme('dark');

// Export individual modules
export * from './colors';
export * from './spacing';
export * from './typography';
export * from './shadows';