// Dark theme color palette inspired by Google AI/Perplexity aesthetic
export const colors = {
  // Backgrounds
  bg: {
    primary: '#0f0f0f',      // Very dark background
    secondary: '#1a1a1a',    // Dark card background
    tertiary: '#242424',     // Slightly lighter for hover states
    accent: '#2d2d2d',       // Dark accent background
  },
  
  // Text colors
  text: {
    primary: '#ffffff',      // Main text
    secondary: '#b0b0b0',    // Secondary text
    tertiary: '#808080',     // Tertiary text
    muted: '#606060',        // Muted text
    light: '#e8e8e8',        // Light text
    brand: '#c9b8a8',        // Brand beige color from image
  },
  
  // Accent colors
  accent: {
    primary: '#8b7355',      // Beige/taupe (from chart bars)
    secondary: '#a89968',    // Lighter beige
    light: '#d4c4b0',        // Light beige
    hover: '#9d8367',        // Hover state for beige
  },
  
  // Semantic colors
  semantic: {
    error: '#ef4444',
    warning: '#f59e0b',
    success: '#10b981',
    info: '#3b82f6',
  },
  
  // Borders
  border: {
    primary: '#333333',
    secondary: '#2a2a2a',
    light: '#404040',
  },
};

export const typography = {
  sizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  weights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
};

export const borderRadius = {
  none: '0',
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  full: '9999px',
};
