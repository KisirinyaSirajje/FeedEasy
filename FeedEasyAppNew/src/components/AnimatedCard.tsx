import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface AnimatedCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  animated?: boolean;
  delay?: number;
  shadow?: 'light' | 'medium' | 'heavy';
  borderRadius?: number;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  style,
  onPress,
  animated = true,
  delay = 0,
  shadow = 'medium',
  borderRadius = 16,
}) => {
  const { theme } = useTheme();
  const scaleValue = useRef(new Animated.Value(0.9)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;
  const shadowValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      const animation = Animated.parallel([
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 300,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 300,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(shadowValue, {
          toValue: 1,
          duration: 300,
          delay,
          useNativeDriver: true,
        }),
      ]);
      animation.start();
    }
  }, [animated, delay]);

  const getShadowStyle = () => {
    const shadowStyles = {
      light: theme.shadow.light,
      medium: theme.shadow.medium,
      heavy: theme.shadow.heavy,
    };
    return shadowStyles[shadow];
  };

  const cardStyle = {
    backgroundColor: theme.surface,
    borderRadius,
    shadowColor: theme.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: shadowValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.1],
    }),
    shadowRadius: shadowValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 8],
    }),
    elevation: shadowValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 8],
    }),
    transform: [{ scale: scaleValue }],
    opacity: opacityValue,
  };

  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <Animated.View style={[styles.container, cardStyle, style]}>
      <CardComponent
        style={styles.content}
        onPress={onPress}
        activeOpacity={onPress ? 0.8 : 1}
      >
        {children}
      </CardComponent>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 8,
  },
  content: {
    padding: 16,
  },
});

export default AnimatedCard; 