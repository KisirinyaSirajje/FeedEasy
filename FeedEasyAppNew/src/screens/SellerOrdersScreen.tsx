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
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import DatabaseService, { Order } from '../services/DatabaseService';

const SellerOrdersScreen = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (user?.userType === 'seller') {
      loadSellerOrders();
    }
  }, [user]);

  const loadSellerOrders = async () => {
    if (!user || user.userType !== 'seller') return;

    try {
      const sellerOrders = await DatabaseService.getOrdersBySeller(user.id);
      setOrders(sellerOrders);
    } catch (error) {
      console.error('Error loading seller orders:', error);
      Alert.alert('Error', 'Failed to load your orders.');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSellerOrders();
    setRefreshing(false);
  };

  const handleStatusChange = async (orderId: number, currentStatus: Order['status']) => {
    const newStatus: Order['status'] | undefined = await new Promise(resolve => {
      Alert.alert(
        'Update Order Status',
        `Select a new status for Order #${orderId}`,
        [
          { text: 'Cancel', style: 'cancel', onPress: () => resolve(undefined) },
          { text: 'Confirmed', onPress: () => resolve('confirmed') },
          { text: 'Shipped', onPress: () => resolve('shipped') },
          { text: 'Delivered', onPress: () => resolve('delivered') },
          { text: 'Cancelled', style: 'destructive', onPress: () => resolve('cancelled') },
        ],
        { cancelable: true }
      );
    });

    if (newStatus && newStatus !== currentStatus) {
      try {
        const success = await DatabaseService.updateOrderStatus(orderId, newStatus);
        if (success) {
          Alert.alert('Success', `Order status updated to ${newStatus}.`);
          await loadSellerOrders();
        } else {
          Alert.alert('Error', 'Failed to update order status.');
        }
      } catch (error) {
        console.error('Error updating status:', error);
        Alert.alert('Error', 'An error occurred while updating the status.');
      }
    }
  };

  if (!user || user.userType !== 'seller') {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.text }]}>
          Access denied. Seller account required.
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
        <Text style={styles.title}>Manage Orders</Text>
      </View>

      <View style={styles.section}>
        {orders.length > 0 ? (
          orders.map((order) => (
            <TouchableOpacity 
              key={order.id} 
              style={[styles.orderCard, { backgroundColor: theme.surface }]}
              onPress={() => handleStatusChange(order.id, order.status)}
            >
              <View style={styles.orderHeader}>
                <Text style={[styles.orderTitle, { color: theme.text }]}>
                  Order #{order.id.toString().padStart(3, '0')}
                </Text>
                <Text style={[styles.orderStatus, { color: getStatusColor(order.status) }]}>
                  {order.status.toUpperCase()}
                </Text>
              </View>
              <Text style={[styles.orderDetails, { color: theme.textSecondary }]}>
                Quantity: {order.quantity} • Total: UGX {order.totalPrice.toLocaleString()}
              </Text>
              <Text style={[styles.orderDetails, { color: theme.textSecondary }]}>
                Shipping to: {order.shippingAddress}
              </Text>
              <Text style={[styles.orderDate, { color: theme.textSecondary }]}>
                {new Date(order.orderDate).toLocaleString()}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <View style={[styles.emptyState, { backgroundColor: theme.surface }]}>
            <Ionicons name="receipt-outline" size={48} color={theme.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              You have no orders yet.
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
  },
  section: {
    padding: 20,
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

export default SellerOrdersScreen;