import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import DatabaseService, { Product, Order } from '../services/DatabaseService';
import GradientBackground from '../components/GradientBackground';
import AnimatedCard from '../components/AnimatedCard';
import Loader from '../components/Loader';

const { width } = Dimensions.get('window');

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  monthlyRevenue: number;
  topProducts: (Product & { sales: number; revenue: number })[];
  recentOrders: Order[];
  lowStockProducts: Product[];
}

const SellerDashboardScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    topProducts: [],
    recentOrders: [],
    lowStockProducts: [],
  });
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('month');
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (user?.userType === 'seller') {
      loadDashboardData();
      startAnimations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const startAnimations = () => {
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
  };

  const loadDashboardData = async () => {
    if (!user || user.userType !== 'seller') return;

    try {
      setIsLoading(true);
      const products = await DatabaseService.getProductsBySeller(user.id);
      const orders = await DatabaseService.getOrdersBySeller(user.id);
      
      const pendingOrders = orders.filter(order => order.status === 'pending');
      const recentOrders = orders.slice(0, 5);
      const deliveredOrders = orders.filter(o => o.status === 'delivered');
      
      const totalRevenue = deliveredOrders.reduce((sum, o) => sum + o.totalPrice, 0);
      
      // Calculate monthly revenue
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyOrders = deliveredOrders.filter(order => {
        const orderDate = new Date(order.orderDate);
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
      });
      const monthlyRevenue = monthlyOrders.reduce((sum, o) => sum + o.totalPrice, 0);

      // Calculate product sales and revenue
      const productSales: { [key: number]: { sales: number; revenue: number } } = {};
      deliveredOrders.forEach(order => {
        if (productSales[order.productId]) {
          productSales[order.productId].sales += order.quantity;
          productSales[order.productId].revenue += order.totalPrice;
        } else {
          productSales[order.productId] = { sales: order.quantity, revenue: order.totalPrice };
        }
      });

      const topProducts = (await Promise.all(
        Object.keys(productSales).map(async (productId) => {
          const product = await DatabaseService.getProductById(Number(productId));
          return product ? { 
            ...product, 
            sales: productSales[Number(productId)].sales,
            revenue: productSales[Number(productId)].revenue
          } : null;
        })
      ))
      .filter((p): p is Product & { sales: number; revenue: number } => p !== null)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 3);

      // Get low stock products (less than 10 units)
      const lowStockProducts = products.filter(product => product.stockQuantity < 10);

      const unreadCount = await DatabaseService.getUnreadMessageCount(user.id);
      setUnreadMessages(unreadCount);

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        pendingOrders: pendingOrders.length,
        totalRevenue,
        monthlyRevenue,
        topProducts,
        recentOrders,
        lowStockProducts,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const getRevenueForPeriod = () => {
    switch (selectedPeriod) {
      case 'today':
        return stats.totalRevenue * 0.1; // Mock today's revenue
      case 'week':
        return stats.totalRevenue * 0.3; // Mock weekly revenue
      case 'month':
        return stats.monthlyRevenue;
      default:
        return stats.monthlyRevenue;
    }
  };

  // Helper to chunk an array into rows of 2
  const chunkArray = <T,>(arr: T[]): T[][] => {
    const result: T[][] = [];
    for (let i = 0; i < arr.length; i += 2) {
      result.push(arr.slice(i, i + 2));
    }
    return result;
  };

  const renderStatCard = (icon: string, value: string | number, label: string, color: string, index: number) => (
    <AnimatedCard
      key={label}
      delay={index * 100}
      shadow="light"
      style={styles.statCard}
    >
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon as any} size={24} color={color} />
      </View>
      <Text style={[styles.statValue, { color: theme.text }]}>
        {typeof value === 'number' && value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
      </Text>
      <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
        {label}
      </Text>
    </AnimatedCard>
  );

  const renderTopProduct = (product: Product & { sales: number; revenue: number }, index: number) => (
    <AnimatedCard
      key={product.id}
      delay={index * 150}
      shadow="light"
      style={styles.productCard}
    >
      <View style={styles.productContent}>
        <View style={styles.productInfo}>
          <Text style={[styles.productName, { color: theme.text }]} numberOfLines={1}>
            {product.name}
          </Text>
          <Text style={[styles.productCategory, { color: theme.textSecondary }]}>
            {product.category}
          </Text>
        </View>
        <View style={styles.productStats}>
          <Text style={[styles.productSales, { color: theme.primary }]}>
            {product.sales} sold
          </Text>
          <Text style={[styles.productRevenue, { color: theme.secondary }]}>
            UGX {product.revenue.toLocaleString()}
          </Text>
        </View>
      </View>
    </AnimatedCard>
  );

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
          {action.badge && (
            <View style={[styles.actionBadge, { backgroundColor: theme.error }]}>
              <Text style={styles.actionBadgeText}>{action.badge}</Text>
            </View>
          )}
        </View>
        <Text style={[styles.actionTitle, { color: theme.text }]}>{action.title}</Text>
        <Text style={[styles.actionDescription, { color: theme.textSecondary }]}>
          {action.description}
        </Text>
      </View>
    </AnimatedCard>
  );

  const renderRecentOrder = (order: Order, index: number) => (
    <AnimatedCard
      key={order.id}
      delay={index * 150}
      shadow="light"
      style={styles.orderCard}
    >
      <View style={styles.orderContent}>
        <View style={styles.orderHeader}>
          <Text style={[styles.orderTitle, { color: theme.text }]}>
            Order #{order.id.toString().padStart(3, '0')}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
              {order.status.toUpperCase()}
            </Text>
          </View>
        </View>
        <View style={styles.orderDetails}>
          <Text style={[styles.orderQuantity, { color: theme.textSecondary }]}>
            Quantity: {order.quantity} units
          </Text>
          <Text style={[styles.orderTotal, { color: theme.primary }]}>
            UGX {order.totalPrice.toLocaleString()}
          </Text>
        </View>
        <Text style={[styles.orderDate, { color: theme.textSecondary }]}>
          {new Date(order.orderDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </Text>
      </View>
    </AnimatedCard>
  );

  if (!user || user.userType !== 'seller') {
    return (
      <GradientBackground type="background">
        <View style={styles.container}>
          <AnimatedCard shadow="heavy" style={styles.errorCard}>
            <View style={[styles.errorIcon, { backgroundColor: theme.error + '20' }]}>
              <Ionicons name="lock-closed" size={48} color={theme.error} />
            </View>
            <Text style={[styles.errorTitle, { color: theme.text }]}>
              Access Denied
            </Text>
            <Text style={[styles.errorMessage, { color: theme.textSecondary }]}>
              Seller account required to access this dashboard
            </Text>
          </AnimatedCard>
        </View>
      </GradientBackground>
    );
  }

  if (isLoading) {
    return <Loader text="Loading dashboard..." type="wave" />;
  }

  const quickActions = [
    {
      id: 1,
      title: 'Add Product',
      description: 'Create new listing',
      icon: 'add-circle',
      route: 'ManageProducts',
      color: theme.primary,
    },
    {
      id: 2,
      title: 'My Products',
      description: 'Manage listings',
      icon: 'grid',
      route: 'SellerProducts',
      color: theme.secondary,
    },
    {
      id: 3,
      title: 'Orders',
      description: 'View all orders',
      icon: 'receipt',
      route: 'SellerOrders',
      color: theme.success,
    },
    {
      id: 4,
      title: 'Messages',
      description: 'Chat with customers',
      icon: 'chatbubbles',
      route: 'SellerMessages',
      color: theme.warning,
      badge: unreadMessages > 0 ? unreadMessages : undefined,
    },
  ];

  // Stats cards data for easier mapping
  const statCardsData = [
    { icon: 'cube', value: stats.totalProducts, label: 'Products', color: theme.primary },
    { icon: 'receipt', value: stats.totalOrders, label: 'Total Orders', color: theme.secondary },
    { icon: 'time', value: stats.pendingOrders, label: 'Pending', color: theme.warning },
    { icon: 'cash', value: `UGX ${getRevenueForPeriod().toLocaleString()}`, label: 'Revenue', color: theme.success },
  ];

  return (
    <GradientBackground type="background">
      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
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
                  <Ionicons name="business" size={32} color="#fff" />
                </View>
              </View>
              <Text style={styles.welcomeText}>
                Welcome back, {user.firstName}! 👋
              </Text>
              <Text style={styles.subtitle}>
                Manage your feed business efficiently
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
          {/* Revenue Period Selector */}
          <View style={styles.periodSelector}>
            <Text style={[styles.periodLabel, { color: theme.text }]}>Revenue Period:</Text>
            <View style={styles.periodButtons}>
              {[
                { key: 'today', label: 'Today' },
                { key: 'week', label: 'Week' },
                { key: 'month', label: 'Month' },
              ].map((period) => (
                <TouchableOpacity
                  key={period.key}
                  style={[
                    styles.periodButton,
                    { backgroundColor: selectedPeriod === period.key ? theme.secondary : theme.background },
                  ]}
                  onPress={() => setSelectedPeriod(period.key as 'today' | 'week' | 'month')}
                >
                  <Text style={[
                    styles.periodButtonText,
                    { color: selectedPeriod === period.key ? '#fff' : theme.textSecondary }
                  ]}>
                    {period.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Stats Cards - 2 per row */}
          <View style={styles.statsGrid}>
            {chunkArray(statCardsData).map((row, rowIndex) => (
              <View style={styles.statsRow} key={rowIndex}>
                {row.map((card, colIndex) =>
                  renderStatCard(card.icon, card.value, card.label, card.color, rowIndex * 2 + colIndex)
                )}
                {row.length < 2 && <View style={[styles.statCard, { backgroundColor: 'transparent', elevation: 0 }]} />}
              </View>
            ))}
          </View>

          {/* Quick Actions - 2 per row */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Actions</Text>
            <View style={styles.actionGrid}>
              {chunkArray(quickActions).map((row, rowIndex) => (
                <View style={styles.actionRow} key={rowIndex}>
                  {row.map((action, colIndex) => renderQuickAction(action, rowIndex * 2 + colIndex))}
                  {row.length < 2 && <View style={[styles.actionCard, { backgroundColor: 'transparent', elevation: 0 }]} />}
                </View>
              ))}
            </View>
          </View>

          {/* Top Products - 2 per row */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Top Selling Products</Text>
              <TouchableOpacity onPress={() => navigation.navigate('SellerProducts' as never)}>
                <Text style={[styles.viewAllText, { color: theme.secondary }]}>View All</Text>
              </TouchableOpacity>
            </View>
            {stats.topProducts.length > 0 ? (
              <View style={styles.productGrid}>
                {chunkArray(stats.topProducts).map((row, rowIndex) => (
                  <View style={styles.productRow} key={rowIndex}>
                    {row.map((product, colIndex) => renderTopProduct(product, rowIndex * 2 + colIndex))}
                    {row.length < 2 && <View style={[styles.productCard, { backgroundColor: 'transparent', elevation: 0 }]} />}
                  </View>
                ))}
              </View>
            ) : (
              <AnimatedCard shadow="light" style={styles.emptyCard}>
                <View style={[styles.emptyIcon, { backgroundColor: theme.textSecondary + '20' }]}>
                  <Ionicons name="trending-up" size={32} color={theme.textSecondary} />
                </View>
                <Text style={[styles.emptyTitle, { color: theme.text }]}>
                  No Sales Data
                </Text>
                <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                  Start selling to see your top products here
                </Text>
              </AnimatedCard>
            )}
          </View>

          {/* Low Stock Alerts */}
          {stats.lowStockProducts.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Low Stock Alerts ({stats.lowStockProducts.length})
              </Text>
              {stats.lowStockProducts.slice(0, 3).map((product, index) => (
                <AnimatedCard
                  key={product.id}
                  delay={index * 100}
                  shadow="light"
                  style={styles.alertCard}
                >
                  <View style={styles.alertContent}>
                    <View style={[styles.alertIcon, { backgroundColor: theme.error + '20' }]}>
                      <Ionicons name="warning" size={20} color={theme.error} />
                    </View>
                    <View style={styles.alertDetails}>
                      <Text style={[styles.alertTitle, { color: theme.text }]}>
                        {product.name}
                      </Text>
                      <Text style={[styles.alertMessage, { color: theme.textSecondary }]}>
                        Only {product.stockQuantity} units remaining
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={[styles.restockButton, { backgroundColor: theme.primary }]}
                      onPress={() => navigation.navigate('ManageProducts' as never)}
                    >
                      <Text style={styles.restockButtonText}>Restock</Text>
                    </TouchableOpacity>
                  </View>
                </AnimatedCard>
              ))}
            </View>
          )}

          {/* Recent Orders */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Orders</Text>
              <TouchableOpacity onPress={() => navigation.navigate('SellerOrders' as never)}>
                <Text style={[styles.viewAllText, { color: theme.secondary }]}>View All</Text>
              </TouchableOpacity>
            </View>
            {stats.recentOrders.length > 0 ? (
              stats.recentOrders.map((order, index) => renderRecentOrder(order, index))
            ) : (
              <AnimatedCard shadow="light" style={styles.emptyCard}>
                <View style={[styles.emptyIcon, { backgroundColor: theme.textSecondary + '20' }]}>
                  <Ionicons name="receipt-outline" size={32} color={theme.textSecondary} />
                </View>
                <Text style={[styles.emptyTitle, { color: theme.text }]}>
                  No Recent Orders
                </Text>
                <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                  New orders will appear here
                </Text>
              </AnimatedCard>
            )}
          </View>
        </Animated.View>
      </ScrollView>
    </GradientBackground>
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
  periodSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  periodLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  periodButtons: {
    flexDirection: 'row',
    // gap: 8, // gap is not supported in React Native, use marginRight
  },
  periodButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  // Stats grid for 2 per row
  statsGrid: {
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    marginRight: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    // Remove right margin for last card in row
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionGrid: {
    // Remove flexWrap here, handled in rows
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  actionCard: {
    width: (width - 48) / 2,
    marginBottom: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 12,
  },
  actionContent: {
    alignItems: 'center',
    padding: 20,
    minHeight: 120,
    width: '100%',
    justifyContent: 'center',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  actionBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
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
  // Product grid for 2 per row
  productGrid: {},
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  productCard: {
    flex: 1,
    marginRight: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  productContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  productInfo: {
    flex: 1,
    marginRight: 16,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 14,
  },
  productStats: {
    alignItems: 'flex-end',
  },
  productSales: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  productRevenue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  alertCard: {
    marginBottom: 12,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  alertIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  alertDetails: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: 14,
  },
  restockButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  restockButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  orderCard: {
    marginBottom: 12,
  },
  orderContent: {
    padding: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderQuantity: {
    fontSize: 14,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderDate: {
    fontSize: 12,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  errorCard: {
    alignItems: 'center',
    padding: 40,
    margin: 20,
  },
  errorIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default SellerDashboardScreen;
