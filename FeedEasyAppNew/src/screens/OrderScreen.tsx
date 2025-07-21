import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  deliveryAddress: string;
  estimatedDelivery?: string;
}

const OrderScreen = () => {
  const [selectedTab, setSelectedTab] = useState<'current' | 'history'>('current');
  const { theme } = useTheme();

  // Sample order data
  const orders: Order[] = [
    {
      id: '1',
      orderNumber: 'FE001',
      date: '2024-01-15',
      status: 'shipped',
      total: 645000,
      deliveryAddress: 'Kampala, Central Uganda',
      estimatedDelivery: '2024-01-17',
      items: [
        { name: 'Premium Poultry Layer Feed', quantity: 2, price: 285000 },
        { name: 'Catfish Feed Floating', quantity: 1, price: 225000 },
      ],
    },
    {
      id: '2',
      orderNumber: 'FE002',
      date: '2024-01-12',
      status: 'delivered',
      total: 630000,
      deliveryAddress: 'Mbarara, Western Uganda',
      items: [
        { name: 'Pig Grower Feed', quantity: 2, price: 315000 },
      ],
    },
    {
      id: '3',
      orderNumber: 'FE003',
      date: '2024-01-18',
      status: 'confirmed',
      total: 540000,
      deliveryAddress: 'Gulu, Northern Uganda',
      estimatedDelivery: '2024-01-20',
      items: [
        { name: 'Broiler Starter Feed', quantity: 1, price: 294000 },
        { name: 'Goat & Sheep Pellets', quantity: 1, price: 246000 },
      ],
    },
    {
      id: '4',
      orderNumber: 'FE004',
      date: '2024-01-10',
      status: 'cancelled',
      total: 204000,
      deliveryAddress: 'Jinja, Eastern Uganda',
      items: [
        { name: 'Tilapia Feed Concentrate', quantity: 1, price: 204000 },
      ],
    },
  ];

  const currentOrders = orders.filter(order => 
    order.status === 'pending' || order.status === 'confirmed' || order.status === 'shipped'
  );
  
  const orderHistory = orders.filter(order => 
    order.status === 'delivered' || order.status === 'cancelled'
  );

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

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const renderOrder = ({ item }: { item: Order }) => (
    <TouchableOpacity style={[styles.orderCard, { backgroundColor: theme.surface }]}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={[styles.orderNumber, { color: theme.text }]}>Order #{item.orderNumber}</Text>
          <Text style={[styles.orderDate, { color: theme.textSecondary }]}>Ordered on {item.date}</Text>
        </View>
        <View style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(item.status) }
        ]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
      
      <View style={[styles.deliveryInfo, { backgroundColor: theme.background }]}>
        <Text style={[styles.deliveryLabel, { color: theme.textSecondary }]}>Delivery Address:</Text>
        <Text style={[styles.deliveryAddress, { color: theme.text }]}>{item.deliveryAddress}</Text>
        {item.estimatedDelivery && (
          <>
            <Text style={[styles.deliveryLabel, { color: theme.textSecondary }]}>Estimated Delivery:</Text>
            <Text style={[styles.estimatedDelivery, { color: theme.primary }]}>{item.estimatedDelivery}</Text>
          </>
        )}
      </View>
      
      <View style={styles.itemsList}>
        <Text style={[styles.itemsTitle, { color: theme.text }]}>Items Ordered:</Text>
        {item.items.map((orderItem, index) => (
          <View key={index} style={styles.orderItem}>
            <Text style={[styles.itemName, { color: theme.text }]}>{orderItem.name}</Text>
            <Text style={[styles.itemDetails, { color: theme.textSecondary }]}>
              Qty: {orderItem.quantity} × UGX {orderItem.price.toLocaleString()}
            </Text>
          </View>
        ))}
      </View>
      
      <View style={[styles.orderFooter, { borderTopColor: theme.border }]}>
        <Text style={[styles.orderTotal, { color: theme.primary }]}>
          Total: UGX {item.total.toLocaleString()}
        </Text>
        <View style={styles.actionButtons}>
          {item.status === 'shipped' && (
            <TouchableOpacity style={[styles.trackButton, { backgroundColor: theme.warning }]}>
              <Text style={styles.trackButtonText}>Track Order</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={[styles.viewButton, { backgroundColor: theme.primary }]}>
            <Text style={styles.viewButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = (type: 'current' | 'history') => (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyTitle, { color: theme.text }]}>
        {type === 'current' ? 'No Current Orders' : 'No Order History'}
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
        {type === 'current' 
          ? 'Your active orders will appear here'
          : 'Your completed orders will appear here'
        }
      </Text>
      {type === 'current' && (
        <TouchableOpacity style={[styles.browseButton, { backgroundColor: theme.primary }]}>
          <Text style={styles.browseButtonText}>Browse Products</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.tabContainer, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <TouchableOpacity
          style={[
            styles.tab, 
            selectedTab === 'current' && { borderBottomColor: theme.primary }
          ]}
          onPress={() => setSelectedTab('current')}
        >
          <Text style={[
            styles.tabText,
            { color: theme.textSecondary },
            selectedTab === 'current' && { color: theme.primary, fontWeight: 'bold' }
          ]}>
            Current Orders ({currentOrders.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab, 
            selectedTab === 'history' && { borderBottomColor: theme.primary }
          ]}
          onPress={() => setSelectedTab('history')}
        >
          <Text style={[
            styles.tabText,
            { color: theme.textSecondary },
            selectedTab === 'history' && { color: theme.primary, fontWeight: 'bold' }
          ]}>
            Order History ({orderHistory.length})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={selectedTab === 'current' ? currentOrders : orderHistory}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.ordersList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => renderEmptyState(selectedTab)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#2e7d32',
  },
  tabText: {
    fontSize: 16,
    color: '#757575',
  },
  activeTabText: {
    color: '#2e7d32',
    fontWeight: 'bold',
  },
  ordersList: {
    padding: 15,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  deliveryInfo: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
  },
  deliveryLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginBottom: 2,
  },
  deliveryAddress: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
  estimatedDelivery: {
    fontSize: 14,
    color: '#2e7d32',
    fontWeight: '500',
  },
  itemsList: {
    marginBottom: 15,
  },
  itemsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  orderItem: {
    marginBottom: 6,
  },
  itemName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  itemDetails: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  trackButton: {
    backgroundColor: '#ff9800',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
  },
  trackButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  viewButton: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  viewButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  browseButton: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  browseButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default OrderScreen;
