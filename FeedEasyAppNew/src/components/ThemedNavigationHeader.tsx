import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface ThemedNavigationHeaderProps {
  title: string;
  rightComponent?: React.ReactNode;
}

const ThemedNavigationHeader: React.FC<ThemedNavigationHeaderProps> = ({
  title,
  rightComponent,
}) => {
  const { theme, isDarkMode } = useTheme();

  return (
    <>
      <StatusBar
        backgroundColor={theme.primary}
        barStyle={isDarkMode ? 'light-content' : 'light-content'}
      />
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <Text style={[styles.title, { color: '#fff' }]}>{title}</Text>
        {rightComponent && (
          <View style={styles.rightContainer}>{rightComponent}</View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ThemedNavigationHeader;
