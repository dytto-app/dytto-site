'use client';

import { useMemo } from 'react';
import { useTheme } from '@/components/shared/ThemeProvider';

// Hook for generating theme-aware styles
export const useThemeStyles = () => {
  const { theme } = useTheme();

  return useMemo(() => ({
    bg: {
      primary: { backgroundColor: theme.colors.background },
      secondary: { backgroundColor: theme.colors.backgroundSecondary },
      tertiary: { backgroundColor: theme.colors.backgroundTertiary },
      surface: { backgroundColor: theme.colors.surface },
      surfaceSecondary: { backgroundColor: theme.colors.surfaceSecondary },
    },
    text: {
      primary: { color: theme.colors.text },
      secondary: { color: theme.colors.textSecondary },
      tertiary: { color: theme.colors.textTertiary },
      accent: { color: theme.colors.primary },
    },
    border: {
      default: { borderColor: theme.colors.border },
      secondary: { borderColor: theme.colors.borderSecondary },
    },
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
    glass: theme.glassEffects,
    shadow: theme.shadows,
    spacing: theme.semanticSpacing,
    typography: theme.textStyles,
  }), [theme]);
};
