import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import DatabaseService, { Order } from '../services/DatabaseService';

const FarmerDashboardScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (user?.userType === 'farmer') {
      loadFarmerData();
    }
  }, [user]);

  const loadFarmerData = async () => {
    if (!user || user.userType !== 'farmer') return;

    try {
      const farmerOrders = await DatabaseService.getOrdersByFarmer(user.id);
      setOrders(farmerOrders);
    } catch (error) {
      console.error('Error loading farmer data:', error);
      Alert.alert('Error', 'Failed to load your data.');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFarmerData();
    setRefreshing(false);
  };

  if (!user || user.userType !== 'farmer') {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.text }]}>
          Access denied. Farmer account required.
        </Text>
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#ff9800';
      case 'confirmed': return '#2196f3';
      case 'shipped': return '#9c27b0';
      case 'delivered': return '#4caf50';
      case 'cancelled': return '#f44336';
      default: return '#757575';
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <Text style={styles.title}>My Dashboard</Text>
        <Text style={styles.subtitle}>Welcome, {user.firstName}!</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>My Orders</Text>
        
        {orders.length > 0 ? (
          orders.map((order) => (
            <View key={order.id} style={[styles.orderCard, { backgroundColor: theme.surface }]}>
              <View style={styles.orderHeader}>
                <Text style={[styles.orderTitle, { color: theme.text }]}>
                  Order #{order.orderNumber || order.id.toString().padStart(3, '0')}
                </Text>
                <Text style={[styles.orderStatus, { color: getStatusColor(order.status) }]}>
                  {order.status.toUpperCase()}
                </Text>
              </View>
              <Text style={[styles.orderDetails, { color: theme.textSecondary }]}>
                Total: UGX {(order.totalAmount || 0).toLocaleString()}
              </Text>
              <Text style={[styles.orderDate, { color: theme.textSecondary }]}>
                {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}
              </Text>
            </View>
          ))
        ) : (
          <View style={[styles.emptyState, { backgroundColor: theme.surface }]}>
            <Ionicons name="receipt-outline" size={48} color={theme.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              You haven't placed any orders yet.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
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
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  orderCard: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderStatus: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  orderDetails: {
    fontSize: 14,
    marginBottom: 3,
  },
  orderDate: {
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    padding: 30,
    borderRadius: 10,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 10,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
});

export default FarmerDashboardScreen;