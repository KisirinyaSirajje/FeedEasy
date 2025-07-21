import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme/colors';

interface HomeScreenProps {
  navigation: any;
}

interface FeedCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  count: number;
}

interface QuickAction {
  id: string;
  title: string;
  icon: string;
  route: string;
  color: string;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [userName] = useState('John Farmer'); // TODO: Get from user context

  const feedCategories: FeedCategory[] = [
    {
      id: '1',
      name: 'Poultry Feed',
      icon: '🐔',
      color: colors.poultryFeed,
      description: 'Layer, Broiler & Chick feeds',
      count: 24,
    },
    {
      id: '2',
      name: 'Pig Feed',
      icon: '🐷',
      color: colors.pigFeed,
      description: 'Starter, Grower & Finisher',
      count: 18,
    },
    {
      id: '3',
      name: 'Cattle Feed',
      icon: '🐄',
      color: colors.cattleFeed,
      description: 'Dairy & Beef supplements',
      count: 12,
    },
    {
      id: '4',
      name: 'Fish Feed',
      icon: '🐟',
      color: colors.fishFeed,
      description: 'Tilapia & Catfish feeds',
      count: 8,
    },
  ];

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Browse Products',
      icon: '🛍️',
      route: 'ProductCatalog',
      color: colors.primary,
    },
    {
      id: '2',
      title: 'My Orders',
      icon: '📦',
      route: 'Orders',
      color: colors.secondary,
    },
    {
      id: '3',
      title: 'Feed Calculator',
      icon: '🧮',
      route: 'Calculator',
      color: colors.info,
    },
    {
      id: '4',
      title: 'Education',
      icon: '📚',
      route: 'Education',
      color: colors.success,
    },
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    // TODO: Refresh data from API
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const navigateToCategory = (category: FeedCategory) => {
    navigation.navigate('ProductCatalog', { category: category.id });
  };

  const navigateToAction = (action: QuickAction) => {
    if (action.route === 'Calculator') {
      Alert.alert('Coming Soon', 'Feed calculator feature will be available soon!');
      return;
    }
    navigation.navigate(action.route);
  };

  const renderWelcomeCard = () => (
    <View style={styles.welcomeCard}>
      <Text style={styles.welcomeText}>Welcome back, {userName}! 👋</Text>
      <Text style={styles.welcomeSubtext}>
        Find quality feeds for your livestock
      </Text>
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActionsGrid}>
        {quickActions.map(action => (
          <TouchableOpacity
            key={action.id}
            style={[styles.quickActionCard, { borderLeftColor: action.color }]}
            onPress={() => navigateToAction(action)}
          >
            <Text style={styles.quickActionIcon}>{action.icon}</Text>
            <Text style={styles.quickActionTitle}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderFeedCategories = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Feed Categories</Text>
      <View style={styles.categoriesGrid}>
        {feedCategories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[styles.categoryCard, { backgroundColor: category.color + '20' }]}
            onPress={() => navigateToCategory(category)}
          >
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryCount}>{category.count}</Text>
            </View>
            <Text style={styles.categoryName}>{category.name}</Text>
            <Text style={styles.categoryDescription}>{category.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderRecentActivity = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Recent Activity</Text>
      <View style={styles.activityCard}>
        <Text style={styles.activityText}>
          📦 Your order #FE001 is being prepared
        </Text>
        <Text style={styles.activityTime}>2 hours ago</Text>
      </View>
      <View style={styles.activityCard}>
        <Text style={styles.activityText}>
          ✅ Payment received for order #FE002
        </Text>
        <Text style={styles.activityTime}>1 day ago</Text>
      </View>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {renderWelcomeCard()}
      {renderQuickActions()}
      {renderFeedCategories()}
      {renderRecentActivity()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  content: {
    padding: spacing.md,
  },
  
  welcomeCard: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  
  welcomeText: {
    ...typography.h3,
    color: colors.textOnPrimary,
    marginBottom: spacing.xs,
  },
  
  welcomeSubtext: {
    ...typography.body2,
    color: colors.textOnPrimary,
    opacity: 0.9,
  },
  
  section: {
    marginBottom: spacing.xl,
  },
  
  sectionTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.md,
  },
  
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  
  quickActionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderLeftWidth: 4,
    alignItems: 'center',
  },
  
  quickActionIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  
  quickActionTitle: {
    ...typography.body2,
    color: colors.text,
    textAlign: 'center',
    fontWeight: '600',
  },
  
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  
  categoryCard: {
    flex: 1,
    minWidth: '45%',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    minHeight: 120,
  },
  
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  
  categoryIcon: {
    fontSize: 28,
  },
  
  categoryCount: {
    ...typography.caption,
    color: colors.textSecondary,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
    fontWeight: '600',
  },
  
  categoryName: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  
  categoryDescription: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  
  activityCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  
  activityText: {
    ...typography.body2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  
  activityTime: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
