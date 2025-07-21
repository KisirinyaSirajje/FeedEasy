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
  background: '#121212',
  surface: '#1e1e1e',
  primary: '#4caf50',
  primaryVariant: '#2e7d32',
  text: '#ffffff',
  textSecondary: '#b3b3b3',
  border: '#333333',
  card: '#2d2d2d',
  notification: '#f44336',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
};

interface ThemeContextType {
  isDarkMode: boolean;
  theme: ThemeColors;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  const value: ThemeContextType = {
    isDarkMode,
    theme,
    toggleDarkMode,
  };

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
