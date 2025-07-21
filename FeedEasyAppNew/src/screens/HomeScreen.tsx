import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to FeedEasy</Text>
        <Text style={styles.subtitle}>Empowering Farmers with Quality Feed Solutions</Text>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <View style={styles.actionGrid}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Products' as never)}
          >
            <Text style={styles.actionTitle}>Browse Products</Text>
            <Text style={styles.actionDescription}>Explore our feed catalog</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Orders' as never)}
          >
            <Text style={styles.actionTitle}>My Orders</Text>
            <Text style={styles.actionDescription}>Track your orders</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Quality' as never)}
          >
            <Text style={styles.actionTitle}>Quality Check</Text>
            <Text style={styles.actionDescription}>View certifications</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Education' as never)}
          >
            <Text style={styles.actionTitle}>Learn</Text>
            <Text style={styles.actionDescription}>Educational resources</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.recentActivity}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityCard}>
          <Text style={styles.activityTitle}>Order #FE001 Delivered</Text>
          <Text style={styles.activityDescription}>Premium Poultry Feed - 2 bags to Kampala</Text>
          <Text style={styles.activityDate}>2 days ago</Text>
        </View>
        <View style={styles.activityCard}>
          <Text style={styles.activityTitle}>New Quality Certificate</Text>
          <Text style={styles.activityDescription}>UNBS Quality Certification renewed</Text>
          <Text style={styles.activityDate}>1 week ago</Text>
        </View>
        <View style={styles.activityCard}>
          <Text style={styles.activityTitle}>Payment Received</Text>
          <Text style={styles.activityDescription}>UGX 285,000 for Order #FE001</Text>
          <Text style={styles.activityDate}>3 days ago</Text>
        </View>
      </View>

      <View style={styles.features}>
        <Text style={styles.sectionTitle}>Key Features</Text>
        <View style={styles.featuresList}>
          <Text style={styles.featureItem}>✓ High-quality certified feed products</Text>
          <Text style={styles.featureItem}>✓ Real-time order tracking</Text>
          <Text style={styles.featureItem}>✓ Quality assurance certificates</Text>
          <Text style={styles.featureItem}>✓ Educational farming resources</Text>
          <Text style={styles.featureItem}>✓ Inventory management tools</Text>
          <Text style={styles.featureItem}>✓ Offline functionality</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2e7d32',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#c8e6c9',
    textAlign: 'center',
  },
  quickActions: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    width: '48%',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 5,
  },
  actionDescription: {
    fontSize: 14,
    color: '#757575',
  },
  recentActivity: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  activityDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  activityDate: {
    fontSize: 12,
    color: '#999',
  },
  features: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  featuresList: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  featureItem: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    lineHeight: 22,
  },
});

export default HomeScreen;
