// Sophisticated color palette with reduced contrast and eye-friendly tones
export const colors = {
  // Primary brand colors - softer, more sophisticated
  brand: {
    primary: '#84BABF', // Sky blue - professional and accessible
    secondary: '#1E293B', // Warm dark slate instead of pure black
    accent: '#06363D', // Darker sky blue for contrast
    muted: '#94A3B8', // Soft blue-gray for secondary text
  },

  // Neutral palette - warm grays instead of cold grays
  neutral: {
    50: '#FAFAFA',   // Softest white with warmth
    100: '#F4F4F5',  // Very light warm gray
    200: '#E4E4E7',  // Light warm gray
    300: '#D4D4D8',  // Medium-light warm gray
    400: '#A1A1AA',  // Medium warm gray
    500: '#71717A',  // Balanced warm gray
    600: '#52525B',  // Dark warm gray
    700: '#3F3F46',  // Darker warm gray
    800: '#27272A',  // Very dark warm gray
    900: '#18181B',  // Deepest warm gray (not pure black)
  },

  // Background variations - subtle gradients and depths
  background: {
    primary: '#FAFAFA',     // Soft white
    secondary: '#F1F5F9',   // Very light blue-gray
    tertiary: '#E2E8F0',    // Light blue-gray
    dark: '#0A0A0A',        // Very dark gray (almost black)
    darkSecondary: '#171717', // Dark gray
    darkTertiary: '#262626',  // Medium dark gray
  },

  // Text colors - optimized for readability without harsh contrast
  text: {
    primary: '#1E293B',     // Dark slate instead of black
    secondary: '#475569',   // Medium slate
    tertiary: '#64748B',    // Light slate
    inverse: '#F5F5F5',     // Soft white for dark backgrounds
    inverseSecondary: '#D4D4D8', // Light gray for dark backgrounds
    accent: '#0EA5E9',      // Blue accent for links
  },

  // Semantic colors - softer, more pleasant versions
  semantic: {
    success: '#10B981',     // Emerald green
    warning: '#F59E0B',     // Amber
    error: '#EF4444',       // Red
    info: '#3B82F6',        // Blue
  },

  // Interactive states
  interactive: {
    hover: 'rgba(14, 165, 233, 0.1)',      // Sky blue hover
    active: 'rgba(14, 165, 233, 0.2)',     // Slightly stronger blue
    focus: 'rgba(2, 132, 199, 0.3)',       // Darker blue focus ring
    disabled: 'rgba(148, 163, 184, 0.5)',  // Muted gray
  },

  // Glass morphism effects
  glass: {
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.2)',
    dark: 'rgba(0, 0, 0, 0.1)',
  }
};

// Theme variants
export const lightTheme = {
  colors: {
    primary: colors.brand.primary,
    secondary: colors.brand.secondary,
    accent: colors.brand.accent,
    
    background: colors.background.primary,
    backgroundSecondary: colors.background.secondary,
    backgroundTertiary: colors.background.tertiary,
    
    text: colors.text.primary,
    textSecondary: colors.text.secondary,
    textTertiary: colors.text.tertiary,
    
    border: colors.neutral[200],
    borderSecondary: colors.neutral[300],
    
    surface: colors.neutral[50],
    surfaceSecondary: colors.neutral[100],
    
    ...colors.semantic,
    ...colors.interactive,
  }
};

export const darkTheme = {
  colors: {
    primary: colors.brand.primary,
    secondary: colors.brand.accent,
    accent: colors.brand.primary,
    
    background: colors.background.dark,
    backgroundSecondary: colors.background.darkSecondary,
    backgroundTertiary: colors.background.darkTertiary,
    
    text: colors.text.inverse,
    textSecondary: colors.text.inverseSecondary,
    textTertiary: colors.brand.muted,
    
    border: colors.neutral[700],
    borderSecondary: colors.neutral[600],
    
    surface: colors.neutral[800],
    surfaceSecondary: colors.neutral[700],
    
    ...colors.semantic,
    ...colors.interactive,
  }
};