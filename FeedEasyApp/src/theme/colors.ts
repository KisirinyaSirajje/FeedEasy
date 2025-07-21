export const colors = {
  // Primary theme colors - Teal and Army Green
  primary: '#008080', // Teal
  primaryDark: '#006666',
  primaryLight: '#40E0D0',
  
  secondary: '#4B5320', // Army Green
  secondaryDark: '#2F3420',
  secondaryLight: '#6B7330',
  
  // UI Colors
  background: '#FFFFFF',
  surface: '#F5F5F5',
  card: '#FFFFFF',
  
  // Text colors
  text: '#333333',
  textSecondary: '#666666',
  textLight: '#999999',
  textOnPrimary: '#FFFFFF',
  textOnSecondary: '#FFFFFF',
  
  // Status colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // Border and divider
  border: '#E0E0E0',
  divider: '#EEEEEE',
  
  // Shadow
  shadow: '#000000',
  
  // Opacity variants
  overlay: 'rgba(0, 0, 0, 0.5)',
  disabled: '#CCCCCC',
  
  // Feed category colors
  poultryFeed: '#FF6B6B',
  pigFeed: '#4ECDC4',
  cattleFeed: '#45B7D1',
  fishFeed: '#96CEB4',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 50,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  h4: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  body1: {
    fontSize: 16,
    fontWeight: 'normal' as const,
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    fontWeight: 'normal' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: 'normal' as const,
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 20,
  },
};
