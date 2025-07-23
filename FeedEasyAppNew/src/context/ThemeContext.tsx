import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ThemeColors {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  primaryVariant: string;
  secondaryVariant: string;
  text: string;
  textSecondary: string;
  border: string;
  card: string;
  notification: string;
  success: string;
  warning: string;
  error: string;
  gradient: {
    primary: string[];
    secondary: string[];
    background: string[];
  };
  shadow: {
    light: string;
    medium: string;
    heavy: string;
  };
}

const lightTheme: ThemeColors = {
  background: '#fafbfc',
  surface: '#ffffff',
  primary: '#2e7d32',
  secondary: '#C0CF29',
  primaryVariant: '#1b5e20',
  secondaryVariant: '#a8b824',
  text: '#1a1a1a',
  textSecondary: '#6b7280',
  border: '#e5e7eb',
  card: '#ffffff',
  notification: '#ef4444',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  gradient: {
    primary: ['#2e7d32', '#1b5e20'],
    secondary: ['#C0CF29', '#a8b824'],
    background: ['#fafbfc', '#f3f4f6'],
  },
  shadow: {
    light: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    heavy: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
};

const darkTheme: ThemeColors = {
  background: '#0f172a',
  surface: '#1e293b',
  primary: '#4caf50',
  secondary: '#C0CF29',
  primaryVariant: '#2e7d32',
  secondaryVariant: '#a8b824',
  text: '#f8fafc',
  textSecondary: '#94a3b8',
  border: '#334155',
  card: '#1e293b',
  notification: '#f87171',
  success: '#34d399',
  warning: '#fbbf24',
  error: '#f87171',
  gradient: {
    primary: ['#4caf50', '#2e7d32'],
    secondary: ['#C0CF29', '#a8b824'],
    background: ['#0f172a', '#1e293b'],
  },
  shadow: {
    light: '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
    medium: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
    heavy: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
  },
};

interface ThemeContextType {
  isDarkMode: boolean;
  theme: ThemeColors;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = React.useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const theme = React.useMemo(() => (isDarkMode ? darkTheme : lightTheme), [isDarkMode]);

  const value: ThemeContextType = React.useMemo(() => ({
    isDarkMode,
    theme,
    toggleDarkMode,
  }), [isDarkMode, theme, toggleDarkMode]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
