/**
 * OrderDetailsScreen
 * 
 * Displays detailed information about a specific order with blur overlay modal.
 * Features:
 * - Order summary with items and pricing
 * - Delivery information
 * - Payment method details
 * - Blur overlay modal for detailed view
 * - Track order functionality for shipped orders
 * 
 * @author FeedEasy Team
 * @version 1.0.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import DatabaseService from '../services/DatabaseService';
import GradientBackground from '../components/GradientBackground';
import AnimatedCard from '../components/AnimatedCard';
import Loader from '../components/Loader';

const { width, height } = Dimensions.get('window');

interface OrderDetailsProps {
  route: {
    params: {
      order: {
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
        paymentMethod?: string;
      };
    };
  };
}

const OrderDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<OrderDetailsProps['route']>();
  const { theme } = useTheme();
  
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const { order } = route.params;

  useEffect(() => {
    loadOrderDetails();
    startAnimations();
  }, []);

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

  const loadOrderDetails = async () => {
    try {
      // Load order details from database
      const orderId = parseInt(order.id);
      const orderWithItems = await DatabaseService.getOrderWithItems(orderId);
      
      if (orderWithItems) {
        // Update the order with items from database
        order.items = orderWithItems.items.map(item => ({
          name: item.productName,
          quantity: item.quantity,
          price: item.price,
        }));
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading order details:', error);
      setIsLoading(false);
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleTrackOrder = () => {
    closeModal();
    navigation.navigate('OrderTracking' as never, {
      orderId: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      deliveryAddress: order.deliveryAddress,
      estimatedDelivery: order.estimatedDelivery || new Date().toISOString(),
    } as never);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return theme.warning;
      case 'confirmed': return theme.primary;
      case 'shipped': return theme.secondary;
      case 'delivered': return theme.success;
      case 'cancelled': return theme.error;
      default: return theme.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return 'time';
      case 'confirmed': return 'checkmark-circle';
      case 'shipped': return 'car';
      case 'delivered': return 'home';
      case 'cancelled': return 'close-circle';
      default: return 'help-circle';
    }
  };

  const renderOrderHeader = () => (
    <AnimatedCard shadow="medium" style={styles.headerCard}>
      <View style={styles.headerContent}>
        <View style={styles.orderNumberSection}>
          <Text style={[styles.orderNumber, { color: theme.primary }]}>
            #{order.orderNumber}
          </Text>
          <Text style={[styles.orderDate, { color: theme.textSecondary }]}>
            {new Date(order.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>
        
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
          <Ionicons name={getStatusIcon(order.status) as any} size={16} color={getStatusColor(order.status)} />
          <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
            {order.status.toUpperCase()}
          </Text>
        </View>
      </View>
    </AnimatedCard>
  );

  const renderOrderItems = () => (
    <AnimatedCard shadow="light" style={styles.itemsCard}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Order Items</Text>
      
      <View style={styles.itemsList}>
        {order.items.map((item, index) => (
          <View key={index} style={styles.orderItem}>
            <View style={styles.itemInfo}>
              <Text style={[styles.itemName, { color: theme.text }]} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={[styles.itemQuantity, { color: theme.textSecondary }]}>
                Quantity: {item.quantity}
              </Text>
            </View>
            <View style={styles.itemPrice}>
              <Text style={[styles.itemPriceText, { color: theme.primary }]}>
                UGX {item.price.toLocaleString()}
              </Text>
              <Text style={[styles.itemTotal, { color: theme.secondary }]}>
                UGX {(item.price * item.quantity).toLocaleString()}
              </Text>
            </View>
          </View>
        ))}
      </View>
      
      <View style={[styles.totalSection, { borderTopColor: theme.border }]}>
        <Text style={[styles.totalLabel, { color: theme.text }]}>Total Amount:</Text>
        <Text style={[styles.totalAmount, { color: theme.secondary }]}>
          UGX {order.total.toLocaleString()}
        </Text>
      </View>
    </AnimatedCard>
  );

  const renderDeliveryInfo = () => (
    <AnimatedCard shadow="light" style={styles.deliveryCard}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Delivery Information</Text>
      
      <View style={styles.deliveryDetails}>
        <View style={styles.deliveryItem}>
          <View style={[styles.deliveryIcon, { backgroundColor: theme.primary + '20' }]}>
            <Ionicons name="location" size={20} color={theme.primary} />
          </View>
          <View style={styles.deliveryText}>
            <Text style={[styles.deliveryLabel, { color: theme.textSecondary }]}>
              Delivery Address
            </Text>
            <Text style={[styles.deliveryValue, { color: theme.text }]}>
              {order.deliveryAddress}
            </Text>
          </View>
        </View>
        
        {order.estimatedDelivery && (
          <View style={styles.deliveryItem}>
            <View style={[styles.deliveryIcon, { backgroundColor: theme.secondary + '20' }]}>
              <Ionicons name="calendar" size={20} color={theme.secondary} />
            </View>
            <View style={styles.deliveryText}>
              <Text style={[styles.deliveryLabel, { color: theme.textSecondary }]}>
                Estimated Delivery
              </Text>
              <Text style={[styles.deliveryValue, { color: theme.text }]}>
                {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
          </View>
        )}
        
        {order.paymentMethod && (
          <View style={styles.deliveryItem}>
            <View style={[styles.deliveryIcon, { backgroundColor: theme.success + '20' }]}>
              <Ionicons name="card" size={20} color={theme.success} />
            </View>
            <View style={styles.deliveryText}>
              <Text style={[styles.deliveryLabel, { color: theme.textSecondary }]}>
                Payment Method
              </Text>
              <Text style={[styles.deliveryValue, { color: theme.text }]}>
                {order.paymentMethod === 'mtn' ? 'MTN Mobile Money' :
                 order.paymentMethod === 'airtel' ? 'Airtel Money' :
                 order.paymentMethod === 'card' ? 'Credit/Debit Card' : order.paymentMethod}
              </Text>
            </View>
          </View>
        )}
      </View>
    </AnimatedCard>
  );

  const renderActionButtons = () => (
    <View style={styles.actionButtons}>
      {order.status === 'shipped' && (
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.secondary }]}
          onPress={handleTrackOrder}
        >
          <Ionicons name="location" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Track Order</Text>
        </TouchableOpacity>
      )}
      
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: theme.primary }]}
        onPress={openModal}
      >
        <Ionicons name="eye" size={20} color="#fff" />
        <Text style={styles.actionButtonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return <Loader text="Loading order details..." type="wave" />;
  }

  return (
    <GradientBackground type="background">
      <View style={styles.container}>
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
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Order Details</Text>
              <View style={styles.placeholder} />
            </View>
          </GradientBackground>
        </Animated.View>

        <Animated.ScrollView
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {renderOrderHeader()}
          {renderOrderItems()}
          {renderDeliveryInfo()}
          {renderActionButtons()}
        </Animated.ScrollView>

        {/* Simple Modal */}
        <Modal
          visible={showModal}
          transparent={true}
          animationType="fade"
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: theme.text }]}>
                  Order Details
                </Text>
                <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                <View style={styles.detailSection}>
                  <Text style={[styles.detailSectionTitle, { color: theme.text }]}>
                    Order Information
                  </Text>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
                      Order Number:
                    </Text>
                    <Text style={[styles.detailValue, { color: theme.text }]}>
                      #{order.orderNumber}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
                      Order Date:
                    </Text>
                    <Text style={[styles.detailValue, { color: theme.text }]}>
                      {new Date(order.date).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
                      Status:
                    </Text>
                    <Text style={[styles.detailValue, { color: getStatusColor(order.status) }]}>
                      {order.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <Text style={[styles.detailSectionTitle, { color: theme.text }]}>
                    Items Ordered
                  </Text>
                  {order.items.map((item, index) => (
                    <View key={index} style={styles.modalItem}>
                      <Text style={[styles.modalItemName, { color: theme.text }]}>
                        {item.name}
                      </Text>
                      <View style={styles.modalItemDetails}>
                        <Text style={[styles.modalItemQuantity, { color: theme.textSecondary }]}>
                          Qty: {item.quantity}
                        </Text>
                        <Text style={[styles.modalItemPrice, { color: theme.primary }]}>
                          UGX {item.price.toLocaleString()} each
                        </Text>
                      </View>
                      <Text style={[styles.modalItemTotal, { color: theme.secondary }]}>
                        UGX {(item.price * item.quantity).toLocaleString()}
                      </Text>
                    </View>
                  ))}
                  <View style={[styles.modalTotal, { borderTopColor: theme.border }]}>
                    <Text style={[styles.modalTotalLabel, { color: theme.text }]}>
                      Total:
                    </Text>
                    <Text style={[styles.modalTotalAmount, { color: theme.secondary }]}>
                      UGX {order.total.toLocaleString()}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <Text style={[styles.detailSectionTitle, { color: theme.text }]}>
                    Delivery Details
                  </Text>
                  <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
                    Address:
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.text }]}>
                    {order.deliveryAddress}
                  </Text>
                  {order.estimatedDelivery && (
                    <>
                      <Text style={[styles.detailLabel, { color: theme.textSecondary, marginTop: 12 }]}>
                        Estimated Delivery:
                      </Text>
                      <Text style={[styles.detailValue, { color: theme.text }]}>
                        {new Date(order.estimatedDelivery).toLocaleDateString()}
                      </Text>
                    </>
                  )}
                </View>
              </ScrollView>

              <View style={styles.modalFooter}>
                {order.status === 'shipped' && (
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: theme.secondary }]}
                    onPress={handleTrackOrder}
                  >
                    <Text style={styles.modalButtonText}>Track Order</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: theme.primary }]}
                  onPress={closeModal}
                >
                  <Text style={styles.modalButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </GradientBackground>
  );
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  headerCard: {
    marginBottom: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  orderNumberSection: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  itemsCard: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  itemsList: {
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  itemInfo: {
    flex: 1,
    marginRight: 16,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    lineHeight: 20,
  },
  itemQuantity: {
    fontSize: 14,
  },
  itemPrice: {
    alignItems: 'flex-end',
  },
  itemPriceText: {
    fontSize: 14,
    marginBottom: 2,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  deliveryCard: {
    marginBottom: 24,
  },
  deliveryDetails: {
    gap: 16,
  },
  deliveryItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  deliveryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  deliveryText: {
    flex: 1,
  },
  deliveryLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  deliveryValue: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: height * 0.8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  detailSection: {
    marginBottom: 24,
  },
  detailSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    flex: 2,
    textAlign: 'right',
  },
  modalItem: {
    marginBottom: 16,
  },
  modalItemName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  modalItemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modalItemQuantity: {
    fontSize: 14,
  },
  modalItemPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalItemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  modalTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
  },
  modalTotalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalTotalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default OrderDetailsScreen; 