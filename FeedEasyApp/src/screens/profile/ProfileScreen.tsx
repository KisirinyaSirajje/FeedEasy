import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Button } from '../../components/common/Button';
import { colors, typography, spacing, borderRadius } from '../../theme/colors';

interface ProfileScreenProps {
  navigation: any;
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  userType: 'farmer' | 'retailer' | 'cooperative';
  location: string;
  joinDate: string;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [profile] = useState<UserProfile>({
    name: 'John Farmer',
    email: 'john.farmer@example.com',
    phone: '+256 700 123 456',
    userType: 'farmer',
    location: 'Kampala, Uganda',
    joinDate: '2024-01-15',
  });

  const menuItems = [
    {
      id: '1',
      title: 'Edit Profile',
      icon: '✏️',
      action: () => Alert.alert('Coming Soon', 'Edit profile feature will be available soon!'),
    },
    {
      id: '2',
      title: 'Order History',
      icon: '📦',
      action: () => navigation.navigate('Orders'),
    },
    {
      id: '3',
      title: 'Payment Methods',
      icon: '💳',
      action: () => Alert.alert('Coming Soon', 'Payment methods feature will be available soon!'),
    },
    {
      id: '4',
      title: 'Notifications',
      icon: '🔔',
      action: () => Alert.alert('Coming Soon', 'Notification settings will be available soon!'),
    },
    {
      id: '5',
      title: 'Language Settings',
      icon: '🌍',
      action: () => Alert.alert('Languages', 'Choose your preferred language:\n• English\n• Luganda\n• Swahili'),
    },
    {
      id: '6',
      title: 'Help & Support',
      icon: '❓',
      action: () => Alert.alert('Support', 'Contact us:\n📧 support@feedeasy.ug\n📱 +256 700 FEEDD'),
    },
    {
      id: '7',
      title: 'About FeedEasy',
      icon: 'ℹ️',
      action: () => Alert.alert('About', 'FeedEasy v1.0.0\nTransforming Uganda\'s animal feed industry'),
    },
  ];

  const getUserTypeDisplay = (userType: string) => {
    switch (userType) {
      case 'farmer':
        return { icon: '👨‍🌾', label: 'Farmer' };
      case 'retailer':
        return { icon: '🏪', label: 'Retailer' };
      case 'cooperative':
        return { icon: '🤝', label: 'Cooperative' };
      default:
        return { icon: '👤', label: 'User' };
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // TODO: Clear user session and navigate to auth
            Alert.alert('Logged Out', 'You have been logged out successfully.');
          },
        },
      ]
    );
  };

  const userTypeInfo = getUserTypeDisplay(profile.userType);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>👤</Text>
        </View>
        
        <Text style={styles.name}>{profile.name}</Text>
        
        <View style={styles.userTypeContainer}>
          <Text style={styles.userTypeIcon}>{userTypeInfo.icon}</Text>
          <Text style={styles.userTypeLabel}>{userTypeInfo.label}</Text>
        </View>
        
        <Text style={styles.email}>{profile.email}</Text>
        <Text style={styles.phone}>{profile.phone}</Text>
        <Text style={styles.location}>📍 {profile.location}</Text>
        
        <Text style={styles.joinDate}>
          Member since {new Date(profile.joinDate).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Account</Text>
        {menuItems.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={item.action}
          >
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuTitle}>{item.title}</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.logoutSection}>
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="outline"
          style={styles.logoutButton}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>FeedEasy - Quality feeds for healthy livestock</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>
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
  
  profileCard: {
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  
  avatar: {
    fontSize: 40,
    color: colors.textOnPrimary,
  },
  
  name: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  
  userTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
    marginBottom: spacing.md,
  },
  
  userTypeIcon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  
  userTypeLabel: {
    ...typography.caption,
    color: colors.textOnPrimary,
    fontWeight: '600',
  },
  
  email: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  
  phone: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  
  location: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  
  joinDate: {
    ...typography.caption,
    color: colors.textLight,
  },
  
  menuSection: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  
  sectionTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.md,
  },
  
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  menuIcon: {
    fontSize: 20,
    marginRight: spacing.md,
    width: 24,
    textAlign: 'center',
  },
  
  menuTitle: {
    ...typography.body1,
    color: colors.text,
    flex: 1,
  },
  
  menuArrow: {
    ...typography.h4,
    color: colors.textLight,
  },
  
  logoutSection: {
    marginBottom: spacing.xl,
  },
  
  logoutButton: {
    borderColor: colors.error,
  },
  
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  
  footerText: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  
  version: {
    ...typography.caption,
    color: colors.textLight,
  },
});
