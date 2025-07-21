import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const navigation = useNavigation();

  const userProfile = {
    name: 'John Kamau',
    email: 'john.kamau@email.com',
    phone: '+254 712 345 678',
    location: 'Nakuru County, Kenya',
    farmType: 'Mixed Farm (Poultry & Dairy)',
    farmSize: '5 acres',
    memberSince: 'January 2024',
    totalOrders: 12,
    totalSpent: 85000,
  };

  const menuItems = [
    {
      title: 'Personal Information',
      subtitle: 'Update your personal details',
      icon: '👤',
      onPress: () => console.log('Personal Info'),
    },
    {
      title: 'Farm Details',
      subtitle: 'Manage your farm information',
      icon: '🚜',
      onPress: () => console.log('Farm Details'),
    },
    {
      title: 'Payment Methods',
      subtitle: 'Manage payment options',
      icon: '💳',
      onPress: () => console.log('Payment Methods'),
    },
    {
      title: 'Delivery Addresses',
      subtitle: 'Update delivery locations',
      icon: '📍',
      onPress: () => console.log('Delivery Address'),
    },
    {
      title: 'Notifications',
      subtitle: 'Manage notification preferences',
      icon: '🔔',
      onPress: () => console.log('Notifications'),
    },
    {
      title: 'Educational Resources',
      subtitle: 'Access farming guides and tips',
      icon: '📚',
      onPress: () => navigation.navigate('Education' as never),
    },
    {
      title: 'Inventory Management',
      subtitle: 'Track your feed inventory',
      icon: '📦',
      onPress: () => navigation.navigate('Inventory' as never),
    },
    {
      title: 'Help & Support',
      subtitle: 'Get help or contact support',
      icon: '❓',
      onPress: () => console.log('Help & Support'),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImagePlaceholder}>
            <Text style={styles.profileImageText}>
              {userProfile.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
        </View>
        
        <Text style={styles.userName}>{userProfile.name}</Text>
        <Text style={styles.userEmail}>{userProfile.email}</Text>
        
        <View style={styles.userStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userProfile.totalOrders}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>KSh {(userProfile.totalSpent / 1000).toFixed(0)}K</Text>
            <Text style={styles.statLabel}>Total Spent</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>4.8★</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>
      </View>

      <View style={styles.profileInfo}>
        <Text style={styles.sectionTitle}>Farm Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Phone</Text>
          <Text style={styles.infoValue}>{userProfile.phone}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Location</Text>
          <Text style={styles.infoValue}>{userProfile.location}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Farm Type</Text>
          <Text style={styles.infoValue}>{userProfile.farmType}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Farm Size</Text>
          <Text style={styles.infoValue}>{userProfile.farmSize}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Member Since</Text>
          <Text style={styles.infoValue}>{userProfile.memberSince}</Text>
        </View>
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <View style={styles.menuItemIcon}>
              <Text style={styles.iconText}>{item.icon}</Text>
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemTitle}>{item.title}</Text>
              <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
            </View>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.appInfo}>
        <Text style={styles.sectionTitle}>About FeedEasy</Text>
        <View style={styles.appInfoCard}>
          <Text style={styles.appInfoText}>
            FeedEasy is committed to providing Kenyan farmers with high-quality, 
            affordable animal feed solutions. Our products are locally sourced and 
            internationally certified to ensure the best nutrition for your livestock.
          </Text>
          <View style={styles.appVersion}>
            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileHeader: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  profileImageContainer: {
    marginBottom: 15,
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2e7d32',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImageText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  userStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#e0e0e0',
  },
  profileInfo: {
    backgroundColor: '#fff',
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  menuSection: {
    backgroundColor: '#fff',
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  iconText: {
    fontSize: 20,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginBottom: 3,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  menuItemArrow: {
    fontSize: 24,
    color: '#ccc',
  },
  appInfo: {
    backgroundColor: '#fff',
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  appInfoCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
  },
  appInfoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 10,
  },
  appVersion: {
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    color: '#999',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 30,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default ProfileScreen;
