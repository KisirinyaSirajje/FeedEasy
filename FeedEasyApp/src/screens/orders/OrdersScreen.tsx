import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme/colors';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: number;
}

export const OrdersScreen: React.FC = () => {
  const [orders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: 'FE001',
      date: '2024-01-20',
      status: 'delivered',
      total: 170000,
      items: 2,
    },
    {
      id: '2',
      orderNumber: 'FE002',
      date: '2024-01-18',
      status: 'shipped',
      total: 85000,
      items: 1,
    },
    {
      id: '3',
      orderNumber: 'FE003',
      date: '2024-01-15',
      status: 'pending',
      total: 255000,
      items: 3,
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return colors.success;
      case 'shipped':
        return colors.info;
      case 'confirmed':
        return colors.primary;
      case 'pending':
        return colors.warning;
      case 'cancelled':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return '✅';
      case 'shipped':
        return '🚚';
      case 'confirmed':
        return '✔️';
      case 'pending':
        return '⏳';
      case 'cancelled':
        return '❌';
      default:
        return '📦';
    }
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>#{item.orderNumber}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusIcon}>{getStatusIcon(item.status)}</Text>
          <Text style={styles.statusText}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      <Text style={styles.orderDate}>{item.date}</Text>
      
      <View style={styles.orderDetails}>
        <Text style={styles.orderTotal}>
          UGX {item.total.toLocaleString()}
        </Text>
        <Text style={styles.orderItems}>
          {item.items} item{item.items > 1 ? 's' : ''}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.ordersList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No orders yet</Text>
            <Text style={styles.emptySubtext}>
              Start shopping to see your orders here
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  ordersList: {
    padding: spacing.md,
  },
  
  orderCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  
  orderNumber: {
    ...typography.h4,
    color: colors.text,
    fontWeight: 'bold',
  },
  
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  
  statusIcon: {
    fontSize: 12,
    marginRight: spacing.xs,
  },
  
  statusText: {
    ...typography.caption,
    color: colors.textOnPrimary,
    fontWeight: '600',
  },
  
  orderDate: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  orderTotal: {
    ...typography.h4,
    color: colors.primary,
    fontWeight: 'bold',
  },
  
  orderItems: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  
  emptyText: {
    ...typography.h4,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  
  emptySubtext: {
    ...typography.body2,
    color: colors.textLight,
    textAlign: 'center',
  },
});
