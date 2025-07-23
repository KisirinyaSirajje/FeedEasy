import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import DatabaseService, { Product, Order } from '../services/DatabaseService';

const SellerDashboardScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    topProducts: [] as (Product & { sales: number })[],
    recentOrders: [] as Order[],
  });
  const [unreadMessages, setUnreadMessages] = React.useState(0);

  useEffect(() => {
    if (user?.userType === 'seller') {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user || user.userType !== 'seller') return;

    try {
      const products = await DatabaseService.getProductsBySeller(user.id);
      const orders = await DatabaseService.getOrdersBySeller(user.id);
      const pendingOrders = orders.filter(order => order.status === 'pending');
      const recentOrders = orders.slice(0, 5);
      const totalRevenue = orders
        .filter(o => o.status === 'delivered')
        .reduce((sum, o) => sum + o.totalPrice, 0);

      const productSales: { [key: number]: number } = {};
      orders.forEach(order => {
        if (productSales[order.productId]) {
          productSales[order.productId] += order.quantity;
        } else {
          productSales[order.productId] = order.quantity;
        }
      });

      const topProducts = (await Promise.all(
        Object.keys(productSales).map(async (productId) => {
          const product = await DatabaseService.getProductById(Number(productId));
          return product ? { ...product, sales: productSales[Number(productId)] } : null;
        })
      ))
      .filter((p): p is Product & { sales: number } => p !== null)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 3);

      const unreadCount = await DatabaseService.getUnreadMessageCount(user.id);
      setUnreadMessages(unreadCount);

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        pendingOrders: pendingOrders.length,
        totalRevenue,
        topProducts,
        recentOrders,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
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

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <Text style={styles.title}>Seller Dashboard</Text>
        <Text style={styles.subtitle}>Welcome back, {user.firstName}!</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
          <Ionicons name="cube" size={24} color={theme.primary} />
          <Text style={[styles.statNumber, { color: theme.text }]}>{stats.totalProducts}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Products</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
          <Ionicons name="receipt" size={24} color={theme.primary} />
          <Text style={[styles.statNumber, { color: theme.text }]}>{stats.totalOrders}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total Orders</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
          <Ionicons name="time" size={24} color="#ff9800" />
          <Text style={[styles.statNumber, { color: theme.text }]}>{stats.pendingOrders}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Pending</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
          <Ionicons name="cash" size={24} color="#4caf50" />
          <Text style={[styles.statNumber, { color: theme.text }]}>
            {(stats.totalRevenue / 1000).toFixed(0)}k
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Revenue</Text>
        </View>
      </View>

      {/* Top Products */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Top Selling Products</Text>
        {stats.topProducts.length > 0 ? (
          stats.topProducts.map(product => (
            <View key={product.id} style={[styles.productCard, { backgroundColor: theme.surface }]}>
              <Text style={[styles.productName, {color: theme.text}]}>{product.name}</Text>
              <Text style={[styles.productSales, {color: theme.primary}]}>{product.sales} units sold</Text>
            </View>
          ))
        ) : (
          <Text style={{color: theme.textSecondary}}>No sales data yet.</Text>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Actions</Text>
        
        <View style={styles.actionGrid}>
          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: theme.surface }]}
            onPress={() => navigation.navigate('ManageProducts' as never)}
          >
            <Ionicons name="add-circle" size={32} color={theme.primary} />
            <Text style={[styles.actionTitle, { color: theme.text }]}>Add Product</Text>
            <Text style={[styles.actionDescription, { color: theme.textSecondary }]}>
              Create new product listing
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: theme.surface }]}
            onPress={() => navigation.navigate('SellerProducts' as never)}
          >
            <Ionicons name="grid" size={32} color={theme.primary} />
            <Text style={[styles.actionTitle, { color: theme.text }]}>My Products</Text>
            <Text style={[styles.actionDescription, { color: theme.textSecondary }]}>
              Manage your listings
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: theme.surface }]}
            onPress={() => navigation.navigate('SellerOrders' as never)}
          >
            <Ionicons name="list" size={32} color={theme.primary} />
            <Text style={[styles.actionTitle, { color: theme.text }]}>View Orders</Text>
            <Text style={[styles.actionDescription, { color: theme.textSecondary }]}>
              Manage customer orders
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: theme.surface }]}
            onPress={() => navigation.navigate('SellerMessages' as never)}
          >
            <Ionicons name="chatbubbles" size={32} color={theme.primary} />
            {unreadMessages > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{unreadMessages}</Text>
              </View>
            )}
            <Text style={[styles.actionTitle, { color: theme.text }]}>Messages</Text>
            <Text style={[styles.actionDescription, { color: theme.textSecondary }]}>
              Chat with customers
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Orders */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Orders</Text>
        
        {stats.recentOrders.length > 0 ? (
          stats.recentOrders.map((order) => (
            <View key={order.id} style={[styles.orderCard, { backgroundColor: theme.surface }]}>
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
              <Text style={[styles.orderDate, { color: theme.textSecondary }]}>
                {new Date(order.orderDate).toLocaleDateString()}
              </Text>
            </View>
          ))
        ) : (
          <View style={[styles.emptyState, { backgroundColor: theme.surface }]}>
            <Ionicons name="receipt-outline" size={48} color={theme.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No recent orders
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

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
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  productCard: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
  },
  productSales: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    alignItems: 'center',
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  actionDescription: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
  unreadBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#f44336',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  unreadText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
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

export default SellerDashboardScreen;
