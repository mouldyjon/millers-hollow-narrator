/**
 * Design Tokens - Core Design System
 * Inspired by One Night Ultimate Werewolf + Miller's Hollow aesthetics
 */

export const colors = {
  // Base palette - Dark blue-grey atmosphere
  background: {
    primary: '#1a2332', // Deep dark blue-grey
    secondary: '#2c3e50', // Slightly lighter blue-grey
    tertiary: '#34495e', // Medium blue-grey
    overlay: 'rgba(0, 0, 0, 0.7)', // Dark overlay
  },

  // Accent colours - Medieval/mystical theme
  accent: {
    gold: '#d4af37', // Golden accent for important elements
    amber: '#f59e0b', // Amber for warnings/highlights
    tan: '#d2b48c', // Tan for secondary accents
  },

  // Team colours
  village: {
    primary: '#3b82f6', // Blue
    light: '#60a5fa',
    dark: '#1e40af',
    subtle: 'rgba(59, 130, 246, 0.1)',
  },

  werewolf: {
    primary: '#ef4444', // Red
    light: '#f87171',
    dark: '#991b1b',
    subtle: 'rgba(239, 68, 68, 0.1)',
  },

  solo: {
    primary: '#a855f7', // Purple
    light: '#c084fc',
    dark: '#6b21a8',
    subtle: 'rgba(168, 85, 247, 0.1)',
  },

  // Semantic colours
  success: {
    primary: '#10b981',
    light: '#34d399',
    dark: '#047857',
  },

  warning: {
    primary: '#f59e0b',
    light: '#fbbf24',
    dark: '#d97706',
  },

  error: {
    primary: '#ef4444',
    light: '#f87171',
    dark: '#dc2626',
  },

  // UI elements
  text: {
    primary: '#f8fafc', // Off-white for main text
    secondary: '#cbd5e1', // Light grey for secondary text
    tertiary: '#94a3b8', // Muted grey for tertiary text
    muted: '#64748b', // Very muted for disabled/subtle
    gold: '#fbbf24', // Gold for role names and important text
  },

  border: {
    default: '#475569',
    light: '#64748b',
    dark: '#334155',
  },

  // Interactive states
  interactive: {
    hover: 'rgba(255, 255, 255, 0.1)',
    active: 'rgba(255, 255, 255, 0.15)',
    disabled: 'rgba(255, 255, 255, 0.05)',
  },
} as const;

export const typography = {
  // Font families
  fontFamily: {
    header: '"Cinzel", "Georgia", serif', // Medieval-style serif for headers
    body: '"Inter", "system-ui", sans-serif', // Clean modern sans-serif
  },

  // Font sizes
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem', // 48px
    '6xl': '3.75rem', // 60px
  },

  // Font weights
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  // Line heights
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

export const spacing = {
  0: '0',
  1: '0.25rem', // 4px
  2: '0.5rem', // 8px
  3: '0.75rem', // 12px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  8: '2rem', // 32px
  10: '2.5rem', // 40px
  12: '3rem', // 48px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
} as const;

export const borderRadius = {
  none: '0',
  sm: '0.25rem', // 4px
  default: '0.5rem', // 8px
  md: '0.75rem', // 12px
  lg: '1rem', // 16px
  xl: '1.5rem', // 24px
  '2xl': '2rem', // 32px
  full: '9999px', // Pill shape
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  default: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  glow: '0 0 20px rgba(212, 175, 55, 0.3)', // Gold glow
  glowBlue: '0 0 20px rgba(59, 130, 246, 0.3)', // Blue glow
  glowRed: '0 0 20px rgba(239, 68, 68, 0.3)', // Red glow
} as const;

export const transitions = {
  fast: '150ms ease-in-out',
  default: '250ms ease-in-out',
  slow: '350ms ease-in-out',
} as const;

export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modalBackdrop: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
} as const;

// Gradients for atmospheric effects
export const gradients = {
  night: 'linear-gradient(135deg, #1a1f3a 0%, #2c1f3a 50%, #1a1f3a 100%)', // Deep indigo gradient
  dawn: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #fdc830 100%)', // Warm sunrise gradient
  day: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', // Bright sky gradient
  village: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', // Blue team gradient
  werewolf: 'linear-gradient(135deg, #ef4444 0%, #991b1b 100%)', // Red team gradient
  gold: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', // Gold accent gradient
} as const;
