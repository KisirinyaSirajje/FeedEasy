import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ThemeColors {
  background: string;
  surface: string;
  primary: string;
  primaryVariant: string;
  text: string;
  textSecondary: string;
  border: string;
  card: string;
  notification: string;
  success: string;
  warning: string;
  error: string;
}

const lightTheme: ThemeColors = {
  background: '#f5f5f5',
  surface: '#ffffff',
  primary: '#2e7d32',
  primaryVariant: '#1b5e20',
  text: '#333333',
  textSecondary: '#666666',
  border: '#e0e0e0',
  card: '#ffffff',
  notification: '#f44336',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
};

const darkTheme: ThemeColors = {
  background: '#0d1b0f',
  surface: '#1a2e1d',
  primary: '#4caf50',
  primaryVariant: '#2e7d32',
  text: '#e8f5e8',
  textSecondary: '#a5c9a7',
  border: '#2d4a30',
  card: '#1a2e1d',
  notification: '#f44336',
  success: '#66bb6a',
  warning: '#ffa726',
  error: '#ef5350',
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
