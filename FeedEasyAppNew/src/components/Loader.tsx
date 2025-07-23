import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  type?: 'spinner' | 'dots' | 'pulse' | 'wave';
}

const Loader: React.FC<LoaderProps> = ({ 
  size = 'medium', 
  text = 'Loading...', 
  type = 'spinner' 
}) => {
  const { theme } = useTheme();
  const spinValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;
  const waveValues = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    if (type === 'spinner') {
      const spinAnimation = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      spinAnimation.start();
    } else if (type === 'pulse') {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseValue, {
            toValue: 1.2,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseValue, {
            toValue: 1,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
    } else if (type === 'wave') {
      const waveAnimation = Animated.loop(
        Animated.stagger(150, waveValues.map(value =>
          Animated.sequence([
            Animated.timing(value, {
              toValue: 1,
              duration: 400,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(value, {
              toValue: 0,
              duration: 400,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ])
        ))
      );
      waveAnimation.start();
    }
  }, [type]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const getSize = () => {
    switch (size) {
      case 'small': return 24;
      case 'large': return 48;
      default: return 32;
    }
  };

  const renderSpinner = () => (
    <Animated.View style={{ transform: [{ rotate: spin }] }}>
      <Ionicons 
        name="leaf" 
        size={getSize()} 
        color={theme.secondary} 
      />
    </Animated.View>
  );

  const renderPulse = () => (
    <Animated.View style={{ transform: [{ scale: pulseValue }] }}>
      <View style={[styles.pulseCircle, { backgroundColor: theme.secondary }]} />
    </Animated.View>
  );

  const renderWave = () => (
    <View style={styles.waveContainer}>
      {waveValues.map((value, index) => (
        <Animated.View
          key={index}
          style={[
            styles.waveDot,
            {
              backgroundColor: theme.secondary,
              transform: [{ scale: value }],
              opacity: value,
            },
          ]}
        />
      ))}
    </View>
  );

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {[0, 1, 2].map((index) => (
        <Animated.View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor: theme.secondary,
              transform: [{
                scale: waveValues[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1],
                }),
              }],
              opacity: waveValues[index],
            },
          ]}
        />
      ))}
    </View>
  );

  const renderLoader = () => {
    switch (type) {
      case 'spinner':
        return renderSpinner();
      case 'pulse':
        return renderPulse();
      case 'wave':
        return renderWave();
      case 'dots':
        return renderDots();
      default:
        return renderSpinner();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.loaderContainer, { backgroundColor: theme.surface }]}>
        {renderLoader()}
        {text && (
          <Text style={[styles.loaderText, { color: theme.textSecondary }]}>
            {text}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  loaderText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  pulseCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  waveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  waveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },
});

export default Loader; 