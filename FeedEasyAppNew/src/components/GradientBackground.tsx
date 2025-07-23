import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

interface GradientBackgroundProps {
  children: React.ReactNode;
  type?: 'primary' | 'secondary' | 'background';
  style?: ViewStyle;
  start?: { x: number; y: number };
  end?: { x: number; y: number };
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({
  children,
  type = 'background',
  style,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
}) => {
  const { theme } = useTheme();

  const getGradientColors = () => {
    switch (type) {
      case 'primary':
        return theme.gradient.primary;
      case 'secondary':
        return theme.gradient.secondary;
      case 'background':
      default:
        return theme.gradient.background;
    }
  };

  return (
    <LinearGradient
      colors={getGradientColors()}
      start={start}
      end={end}
      style={[styles.container, style]}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default GradientBackground; 