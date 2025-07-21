import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'promotion' | 'system' | 'payment';
  time: string;
  read: boolean;
}

const NotificationsScreen = () => {
  const notifications: Notification[] = [
    {
      id: '1',
      title: 'Order Delivered',
      message: 'Your order #FE001 has been delivered to Kampala, Central Uganda',
      type: 'order',
      time: '2 hours ago',
      read: false,
    },
    {
      id: '2',
      title: 'Payment Confirmed',
      message: 'Payment of UGX 285,000 has been received for order #FE001',
      type: 'payment',
      time: '1 day ago',
      read: true,
    },
    {
      id: '3',
      title: 'Special Offer',
      message: '20% off on all Poultry Feed this week! Limited time offer.',
      type: 'promotion',
      time: '2 days ago',
      read: false,
    },
    {
      id: '4',
      title: 'Quality Certificate Updated',
      message: 'UNBS Quality Certification has been renewed for all products',
      type: 'system',
      time: '1 week ago',
      read: true,
    },
    {
      id: '5',
      title: 'New Product Available',
      message: 'Rabbit Pellets Premium is now available in our catalog',
      type: 'system',
      time: '1 week ago',
      read: true,
    },
    {
      id: '6',
      title: 'Order Shipped',
      message: 'Your order #FE003 is on its way to Gulu, Northern Uganda',
      type: 'order',
      time: '2 weeks ago',
      read: true,
    },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order': return 'cube-outline';
      case 'payment': return 'card-outline';
      case 'promotion': return 'pricetag-outline';
      case 'system': return 'information-circle-outline';
      default: return 'notifications-outline';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'order': return '#2e7d32';
      case 'payment': return '#ff9800';
      case 'promotion': return '#e91e63';
      case 'system': return '#2196f3';
      default: return '#757575';
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity 
      style={[
        styles.notificationCard,
        !item.read && styles.unreadCard
      ]}
    >
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <View style={[
            styles.iconContainer,
            { backgroundColor: getNotificationColor(item.type) + '20' }
          ]}>
            <Ionicons 
              name={getNotificationIcon(item.type) as any} 
              size={24} 
              color={getNotificationColor(item.type)} 
            />
          </View>
          <View style={styles.notificationText}>
            <Text style={[
              styles.notificationTitle,
              !item.read && styles.unreadTitle
            ]}>
              {item.title}
            </Text>
            <Text style={styles.notificationTime}>{item.time}</Text>
          </View>
          {!item.read && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.notificationMessage}>{item.message}</Text>
      </View>
    </TouchableOpacity>
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 && (
          <Text style={styles.unreadCount}>
            {unreadCount} unread
          </Text>
        )}
      </View>

      {unreadCount > 0 && (
        <TouchableOpacity style={styles.markAllRead}>
          <Text style={styles.markAllReadText}>Mark all as read</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.notificationsList}
        showsVerticalScrollIndicator={false}
      />
    </View>
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
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  unreadCount: {
    fontSize: 14,
    color: '#c8e6c9',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  markAllRead: {
    backgroundColor: '#fff',
    padding: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  markAllReadText: {
    fontSize: 16,
    color: '#2e7d32',
    fontWeight: '500',
  },
  notificationsList: {
    padding: 15,
  },
  notificationCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#2e7d32',
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginBottom: 2,
  },
  unreadTitle: {
    fontWeight: 'bold',
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginLeft: 52,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2e7d32',
    marginLeft: 8,
    marginTop: 4,
  },
});

export default NotificationsScreen;
