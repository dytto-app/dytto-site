import { useMemo } from 'react';
import { useTheme } from '../components/ThemeProvider';

// Hook for generating theme-aware styles
export const useThemeStyles = () => {
  const { theme } = useTheme();
  
  return useMemo(() => ({
    // Background styles
    bg: {
      primary: { backgroundColor: theme.colors.background },
      secondary: { backgroundColor: theme.colors.backgroundSecondary },
      tertiary: { backgroundColor: theme.colors.backgroundTertiary },
      surface: { backgroundColor: theme.colors.surface },
      surfaceSecondary: { backgroundColor: theme.colors.surfaceSecondary },
    },
    
    // Text styles
    text: {
      primary: { color: theme.colors.text },
      secondary: { color: theme.colors.textSecondary },
      tertiary: { color: theme.colors.textTertiary },
      accent: { color: theme.colors.primary },
    },
    
    // Border styles
    border: {
      default: { borderColor: theme.colors.border },
      secondary: { borderColor: theme.colors.borderSecondary },
    },
    
    // Button styles
    button: {
      primary: {
        backgroundColor: theme.colors.primary,
        color: theme.colors.background,
        border: 'none',
        borderRadius: '0.75rem',
        padding: `${theme.semanticSpacing.md} ${theme.semanticSpacing.lg}`,
        fontSize: theme.typography.fontSize.base,
        fontWeight: theme.typography.fontWeight.medium,
        transition: theme.animations.transition.normal,
        cursor: 'pointer',
        boxShadow: theme.shadows.sm,
      },
      secondary: {
        backgroundColor: 'transparent',
        color: theme.colors.text,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '0.75rem',
        padding: `${theme.semanticSpacing.md} ${theme.semanticSpacing.lg}`,
        fontSize: theme.typography.fontSize.base,
        fontWeight: theme.typography.fontWeight.medium,
        transition: theme.animations.transition.normal,
        cursor: 'pointer',
      },
      ghost: {
        backgroundColor: 'transparent',
        color: theme.colors.textSecondary,
        border: 'none',
        borderRadius: '0.75rem',
        padding: `${theme.semanticSpacing.md} ${theme.semanticSpacing.lg}`,
        fontSize: theme.typography.fontSize.base,
        fontWeight: theme.typography.fontWeight.medium,
        transition: theme.animations.transition.normal,
        cursor: 'pointer',
      },
    },
    
    // Card styles
    card: {
      default: {
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '1rem',
        padding: theme.semanticSpacing.lg,
        boxShadow: theme.shadows.sm,
      },
      elevated: {
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '1rem',
        padding: theme.semanticSpacing.lg,
        boxShadow: theme.shadows.lg,
      },
      glass: {
        ...theme.glassEffects.light,
        borderRadius: '1rem',
        padding: theme.semanticSpacing.lg,
      },
    },
    
    // Glass morphism utilities
    glass: theme.glassEffects,
    
    // Shadow utilities
    shadow: theme.shadows,
    
    // Spacing utilities
    spacing: theme.semanticSpacing,
    
    // Typography utilities
    typography: theme.textStyles,
  }), [theme]);
};