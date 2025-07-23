import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import GradientBackground from '../components/GradientBackground';
import AnimatedCard from '../components/AnimatedCard';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { user } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const quickActions = [
    {
      id: 1,
      title: 'Browse Products',
      description: 'Explore our feed catalog',
      icon: 'leaf',
      route: 'Products',
      color: theme.primary,
    },
    {
      id: 2,
      title: 'My Orders',
      description: 'Track your orders',
      icon: 'receipt',
      route: 'Orders',
      color: theme.secondary,
    },
    {
      id: 3,
      title: 'Inventory',
      description: 'Manage your stock',
      icon: 'cube',
      route: 'Inventory',
      color: theme.success,
    },
    {
      id: 4,
      title: 'Quality Check',
      description: 'View certifications',
      icon: 'shield-checkmark',
      route: 'Quality',
      color: theme.warning,
    },
    {
      id: 5,
      title: 'Learn',
      description: 'Educational resources',
      icon: 'book',
      route: 'Education',
      color: theme.error,
    },
    {
      id: 6,
      title: 'Chat Support',
      description: 'Get help anytime',
      icon: 'chatbubbles',
      route: 'Chat',
      color: theme.primary,
    },
  ];

  const recentActivities = [
    {
      id: 1,
      title: 'Order #FE001 Delivered',
      description: 'Premium Poultry Feed - 2 bags to Kampala',
      date: '2 days ago',
      icon: 'checkmark-circle',
      color: theme.success,
    },
    {
      id: 2,
      title: 'New Quality Certificate',
      description: 'UNBS Quality Certification renewed',
      date: '1 week ago',
      icon: 'shield-checkmark',
      color: theme.primary,
    },
    {
      id: 3,
      title: 'Payment Received',
      description: 'UGX 285,000 for Order #FE001',
      date: '3 days ago',
      icon: 'card',
      color: theme.secondary,
    },
  ];

  const features = [
    'High-quality certified feed products',
    'Real-time order tracking',
    'Quality assurance certificates',
    'Educational farming resources',
    'Inventory management tools',
    'Offline functionality',
  ];

  const renderQuickAction = (action: any, index: number) => (
    <AnimatedCard
      key={action.id}
      onPress={() => navigation.navigate(action.route as never)}
      delay={index * 100}
      shadow="medium"
      style={styles.actionCard}
    >
      <View style={styles.actionContent}>
        <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
          <Ionicons name={action.icon as any} size={24} color={action.color} />
        </View>
        <Text style={[styles.actionTitle, { color: theme.text }]}>{action.title}</Text>
        <Text style={[styles.actionDescription, { color: theme.textSecondary }]}>
          {action.description}
        </Text>
      </View>
    </AnimatedCard>
  );

  const renderActivity = (activity: any, index: number) => (
    <AnimatedCard
      key={activity.id}
      delay={index * 150}
      shadow="light"
      style={styles.activityCard}
    >
      <View style={styles.activityContent}>
        <View style={[styles.activityIcon, { backgroundColor: activity.color + '20' }]}>
          <Ionicons name={activity.icon as any} size={20} color={activity.color} />
        </View>
        <View style={styles.activityText}>
          <Text style={[styles.activityTitle, { color: theme.text }]}>{activity.title}</Text>
          <Text style={[styles.activityDescription, { color: theme.textSecondary }]}>
            {activity.description}
          </Text>
          <Text style={[styles.activityDate, { color: theme.textSecondary }]}>
            {activity.date}
          </Text>
        </View>
      </View>
    </AnimatedCard>
  );

  // Helper to chunk array into rows of 2
  const chunkArray = (arr: any[], size: number) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };

  return (
    <GradientBackground type="background">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <GradientBackground type="primary" style={styles.headerGradient}>
            <View style={styles.headerContent}>
              <View style={styles.logoContainer}>
                <View style={[styles.logo, { backgroundColor: theme.secondary }]}>
                  <Ionicons name="leaf" size={32} color="#fff" />
                </View>
              </View>
              <Text style={styles.welcomeText}>
                Welcome back, {user?.firstName || 'Farmer'}! 👋
              </Text>
              <Text style={styles.subtitle}>
                Empowering Farmers with Quality Feed Solutions
              </Text>
            </View>
          </GradientBackground>
        </Animated.View>

        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Actions</Text>
            <View style={styles.actionGrid}>
              {chunkArray(quickActions, 2).map((row, rowIndex) => (
                <View key={rowIndex} style={styles.actionRow}>
                  {row.map((action, colIndex) =>
                    renderQuickAction(action, rowIndex * 2 + colIndex)
                  )}
                  {row.length < 2 && <View style={[styles.actionCard, { opacity: 0 }]} />}
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Activity</Text>
            {recentActivities.map((activity, index) => renderActivity(activity, index))}
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Key Features</Text>
            <AnimatedCard shadow="light" style={styles.featuresCard}>
              <View style={styles.featuresList}>
                {features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <View style={[styles.featureIcon, { backgroundColor: theme.secondary + '20' }]}>
                      <Ionicons name="checkmark" size={16} color={theme.secondary} />
                    </View>
                    <Text style={[styles.featureText, { color: theme.text }]}>{feature}</Text>
                  </View>
                ))}
              </View>
            </AnimatedCard>
          </View>
        </Animated.View>
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 20,
  },
  headerGradient: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    padding: 24,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 16,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
  content: {
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    marginLeft: 8,
  },
  actionGrid: {
    // Remove flexDirection and flexWrap, handled by actionRow
    paddingHorizontal: 4,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0,
    gap: 12,
    marginBottom: 16,
  },
  actionCard: {
    width: (width - 48) / 2,
    marginBottom: 0,
    flex: 0,
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionContent: {
    alignItems: 'center',
    padding: 20,
    minHeight: 120,
    justifyContent: 'center',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
    lineHeight: 20,
  },
  actionDescription: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    opacity: 0.8,
  },
  activityCard: {
    marginBottom: 12,
  },
  activityContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityText: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 18,
  },
  activityDate: {
    fontSize: 12,
    fontWeight: '500',
  },
  featuresCard: {
    marginBottom: 20,
  },
  featuresList: {
    padding: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    lineHeight: 22,
    flex: 1,
  },
});

export default HomeScreen;
