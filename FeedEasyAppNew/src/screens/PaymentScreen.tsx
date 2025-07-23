/**
 * PaymentScreen
 * 
 * Handles payment processing with multiple payment options for Uganda market.
 * Features:
 * - MTN Mobile Money integration
 * - Airtel Money integration  
 * - Credit/Debit card processing
 * - Order summary display
 * - Payment confirmation with success modal
 * - Automatic cart clearing after successful payment
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
  Alert,
  Animated,
  Dimensions,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import DatabaseService from '../services/DatabaseService';
import GradientBackground from '../components/GradientBackground';
import AnimatedCard from '../components/AnimatedCard';
import Loader from '../components/Loader';

const { width } = Dimensions.get('window');

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

interface PaymentScreenProps {
  route: {
    params: {
      totalAmount: number;
      items: Array<{
        id: string;
        name: string;
        price: number;
        quantity: number;
        image: string;
        category: string;
      }>;
    };
  };
}

const PaymentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<PaymentScreenProps['route']>();
  const { theme } = useTheme();
  const { user } = useAuth();
  const { clearCart } = useCart();
  
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const { totalAmount, items } = route.params;

  useEffect(() => {
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
  }, []);

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'mtn',
      name: 'MTN Mobile Money',
      icon: 'phone-portrait',
      color: '#FFC107',
      description: 'Pay using MTN Mobile Money',
    },
    {
      id: 'airtel',
      name: 'Airtel Money',
      icon: 'phone-portrait',
      color: '#E91E63',
      description: 'Pay using Airtel Money',
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: 'card',
      color: '#2196F3',
      description: 'Pay using Visa, Mastercard, or other cards',
    },
  ];

  const handlePaymentSelection = (paymentId: string) => {
    setSelectedPayment(paymentId);
  };

  const handleConfirmPayment = async () => {
    if (!selectedPayment) {
      Alert.alert('Payment Method', 'Please select a payment method to continue.');
      return;
    }

    if (!user) {
      Alert.alert('Authentication Error', 'Please log in to complete your order.');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate order number
      const newOrderNumber = `FE${Date.now().toString().slice(-6)}`;
      setOrderNumber(newOrderNumber);

      // Prepare order data for database
      const orderData = {
        orderNumber: newOrderNumber,
        farmerId: user.id,
        totalAmount: totalAmount,
        status: 'confirmed' as const,
        deliveryAddress: user.location || 'Kampala, Uganda',
        paymentMethod: selectedPayment,
        orderDate: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
      };

      // Prepare order items for database
      const orderItems = items.map(item => ({
        productId: parseInt(item.id),
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
        totalPrice: item.price * item.quantity,
      }));

      // Save order to database
      const orderId = await DatabaseService.createOrder(orderData, orderItems);
      console.log('Order saved to database with ID:', orderId);

      // Clear cart after successful payment
      clearCart();

      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error creating order:', error);
      Alert.alert('Payment Failed', 'There was an error processing your payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewOrder = () => {
    setShowSuccessModal(false);
    navigation.navigate('Drawer' as never, { screen: 'MainTabs' } as never);
  };

  const handleContinueShopping = () => {
    setShowSuccessModal(false);
    navigation.navigate('Drawer' as never, { screen: 'MainTabs' } as never);
  };

  const renderPaymentMethod = (method: PaymentMethod, index: number) => (
    <AnimatedCard
      key={method.id}
      delay={index * 150}
      shadow="medium"
      style={styles.paymentMethodCard}
    >
      <TouchableOpacity
        style={[
          styles.paymentMethodContent,
          selectedPayment === method.id && { borderColor: method.color, borderWidth: 2 }
        ]}
        onPress={() => handlePaymentSelection(method.id)}
      >
        <View style={styles.paymentMethodLeft}>
          <View style={[styles.paymentIcon, { backgroundColor: method.color + '20' }]}>
            <Ionicons name={method.icon as any} size={24} color={method.color} />
          </View>
          <View style={styles.paymentInfo}>
            <Text style={[styles.paymentName, { color: theme.text }]}>
              {method.name}
            </Text>
            <Text style={[styles.paymentDescription, { color: theme.textSecondary }]}>
              {method.description}
            </Text>
          </View>
        </View>
        
        <View style={[
          styles.radioButton,
          selectedPayment === method.id && { backgroundColor: method.color }
        ]}>
          {selectedPayment === method.id && (
            <Ionicons name="checkmark" size={16} color="#fff" />
          )}
        </View>
      </TouchableOpacity>
    </AnimatedCard>
  );

  const renderOrderSummary = () => (
    <AnimatedCard shadow="light" style={styles.summaryCard}>
      <Text style={[styles.summaryTitle, { color: theme.text }]}>Order Summary</Text>
      
      <View style={styles.itemsList}>
        {items.map((item, index) => (
          <View key={index} style={styles.summaryItem}>
            <View style={styles.itemInfo}>
              <Text style={[styles.itemName, { color: theme.text }]} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={[styles.itemQuantity, { color: theme.textSecondary }]}>
                Qty: {item.quantity}
              </Text>
            </View>
            <Text style={[styles.itemPrice, { color: theme.primary }]}>
              UGX {(item.price * item.quantity).toLocaleString()}
            </Text>
          </View>
        ))}
      </View>
      
      <View style={[styles.totalSection, { borderTopColor: theme.border }]}>
        <Text style={[styles.totalLabel, { color: theme.text }]}>Total Amount:</Text>
        <Text style={[styles.totalAmount, { color: theme.secondary }]}>
          UGX {totalAmount.toLocaleString()}
        </Text>
      </View>
    </AnimatedCard>
  );

  if (isProcessing) {
    return <Loader text="Processing payment..." type="wave" />;
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
              <Text style={styles.headerTitle}>Payment</Text>
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
          {renderOrderSummary()}

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Select Payment Method
            </Text>
            <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
              Choose your preferred payment option
            </Text>
          </View>

          <View style={styles.paymentMethods}>
            {paymentMethods.map((method, index) => renderPaymentMethod(method, index))}
          </View>

          <View style={styles.confirmSection}>
            <TouchableOpacity
              style={[
                styles.confirmButton,
                { backgroundColor: selectedPayment ? theme.secondary : theme.textSecondary },
              ]}
              onPress={handleConfirmPayment}
              disabled={!selectedPayment}
            >
              <Text style={styles.confirmButtonText}>
                Confirm Payment - UGX {totalAmount.toLocaleString()}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.ScrollView>

        {/* Success Modal */}
        <Modal
          visible={showSuccessModal}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <AnimatedCard shadow="heavy" style={styles.successModal}>
              <View style={[styles.successIcon, { backgroundColor: theme.success + '20' }]}>
                <Ionicons name="checkmark-circle" size={64} color={theme.success} />
              </View>
              
              <Text style={[styles.successTitle, { color: theme.text }]}>
                Payment Successful!
              </Text>
              
              <Text style={[styles.successMessage, { color: theme.textSecondary }]}>
                Your order has been confirmed and is being processed.
              </Text>
              
              <View style={styles.orderInfo}>
                <Text style={[styles.orderNumber, { color: theme.primary }]}>
                  Order #{orderNumber}
                </Text>
                <Text style={[styles.orderAmount, { color: theme.secondary }]}>
                  UGX {totalAmount.toLocaleString()}
                </Text>
              </View>
              
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: theme.background }]}
                  onPress={handleContinueShopping}
                >
                  <Text style={[styles.modalButtonText, { color: theme.textSecondary }]}>
                    Continue Shopping
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: theme.primary }]}
                  onPress={handleViewOrder}
                >
                  <Text style={[styles.modalButtonText, { color: '#fff' }]}>
                    View Order
                  </Text>
                </TouchableOpacity>
              </View>
            </AnimatedCard>
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
  summaryCard: {
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  itemsList: {
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemInfo: {
    flex: 1,
    marginRight: 16,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 14,
  },
  itemPrice: {
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  paymentMethods: {
    marginBottom: 32,
  },
  paymentMethodCard: {
    marginBottom: 16,
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  paymentDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmSection: {
    marginBottom: 32,
  },
  confirmButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successModal: {
    alignItems: 'center',
    padding: 32,
    width: '100%',
    maxWidth: 400,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  orderInfo: {
    alignItems: 'center',
    marginBottom: 32,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  orderAmount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
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
  },
});

export default PaymentScreen; 