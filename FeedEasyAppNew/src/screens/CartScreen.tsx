/**
 * CartScreen
 * 
 * Manages shopping cart functionality with item management and checkout.
 * Features:
 * - Add/remove items from cart
 * - Quantity adjustment with validation
 * - Cart total calculation in UGX
 * - Checkout flow to payment screen
 * - Empty cart state with call-to-action
 * - Smooth animations and professional UI
 * 
 * @author FeedEasy Team
 * @version 1.0.0
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import GradientBackground from '../components/GradientBackground';
import AnimatedCard from '../components/AnimatedCard';
import Loader from '../components/Loader';

const { width } = Dimensions.get('window');

const CartScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { state, removeFromCart, updateQuantity, clearCart } = useCart();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      Alert.alert(
        'Remove Item',
        'Do you want to remove this item from your cart?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Remove', onPress: () => removeFromCart(id), style: 'destructive' },
        ]
      );
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (state.items.length === 0) {
      Alert.alert('Empty Cart', 'Please add some items to your cart before checkout.');
      return;
    }
    
    navigation.navigate('Payment' as never, {
      totalAmount: state.totalPrice,
      items: state.items,
    } as never);
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', onPress: clearCart, style: 'destructive' },
      ]
    );
  };

  const renderCartItem = (item: any, index: number) => (
    <AnimatedCard
      key={item.id}
      delay={index * 100}
      shadow="medium"
      style={styles.cartItem}
    >
      <View style={styles.itemContent}>
        <Image
          source={{ uri: item.image }}
          style={styles.itemImage}
          resizeMode="cover"
        />
        
        <View style={styles.itemDetails}>
          <View style={styles.itemHeader}>
            <Text style={[styles.itemName, { color: theme.text }]} numberOfLines={2}>
              {item.name}
            </Text>
            <TouchableOpacity
              onPress={() => removeFromCart(item.id)}
              style={styles.removeButton}
            >
              <Ionicons name="close-circle" size={20} color={theme.error} />
            </TouchableOpacity>
          </View>
          
          <View style={[styles.categoryTag, { backgroundColor: theme.primary + '15' }]}>
            <Text style={[styles.categoryText, { color: theme.primary }]}>
              {item.category}
            </Text>
          </View>
          
          <View style={styles.itemFooter}>
            <Text style={[styles.itemPrice, { color: theme.primary }]}>
              UGX {item.price.toLocaleString()}
            </Text>
            
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={[styles.quantityButton, { backgroundColor: theme.background }]}
                onPress={() => handleQuantityChange(item.id, item.quantity - 1)}
              >
                <Ionicons name="remove" size={16} color={theme.text} />
              </TouchableOpacity>
              
              <Text style={[styles.quantityText, { color: theme.text }]}>
                {item.quantity}
              </Text>
              
              <TouchableOpacity
                style={[styles.quantityButton, { backgroundColor: theme.background }]}
                onPress={() => handleQuantityChange(item.id, item.quantity + 1)}
              >
                <Ionicons name="add" size={16} color={theme.text} />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.itemTotal}>
            <Text style={[styles.totalLabel, { color: theme.textSecondary }]}>
              Total:
            </Text>
            <Text style={[styles.totalAmount, { color: theme.secondary }]}>
              UGX {(item.price * item.quantity).toLocaleString()}
            </Text>
          </View>
        </View>
      </View>
    </AnimatedCard>
  );

  if (state.items.length === 0) {
    return (
      <GradientBackground type="background">
        <Animated.View 
          style={[
            styles.emptyContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <AnimatedCard shadow="light" style={styles.emptyCard}>
            <View style={styles.emptyContent}>
              <View style={[styles.emptyIcon, { backgroundColor: theme.secondary + '20' }]}>
                <Ionicons name="cart-outline" size={48} color={theme.secondary} />
              </View>
              <Text style={[styles.emptyTitle, { color: theme.text }]}>
                Your cart is empty
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                Add some products to get started
              </Text>
              <TouchableOpacity
                style={[styles.browseButton, { backgroundColor: theme.secondary }]}
                onPress={() => navigation.navigate('Products' as never)}
              >
                <Ionicons name="leaf" size={20} color="#fff" />
                <Text style={styles.browseButtonText}>Browse Products</Text>
              </TouchableOpacity>
            </View>
          </AnimatedCard>
        </Animated.View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground type="background">
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <View style={[styles.header, { backgroundColor: theme.surface }]}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text style={[styles.headerTitle, { color: theme.text }]}>
                Shopping Cart
              </Text>
              <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
                {state.totalItems} {state.totalItems === 1 ? 'item' : 'items'}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.clearButton, { backgroundColor: theme.error + '15' }]}
              onPress={handleClearCart}
            >
              <Ionicons name="trash-outline" size={20} color={theme.error} />
              <Text style={[styles.clearButtonText, { color: theme.error }]}>
                Clear
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          style={styles.itemsContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.itemsContent}
        >
          {state.items.map((item, index) => renderCartItem(item, index))}
        </ScrollView>

        <AnimatedCard shadow="heavy" style={styles.summaryCard}>
          <View style={styles.summaryContent}>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
                Subtotal
              </Text>
              <Text style={[styles.summaryValue, { color: theme.text }]}>
                UGX {state.totalPrice.toLocaleString()}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
                Delivery
              </Text>
              <Text style={[styles.summaryValue, { color: theme.success }]}>
                Free
              </Text>
            </View>
            
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            
            <View style={styles.summaryRow}>
              <Text style={[styles.totalLabel, { color: theme.text }]}>
                Total
              </Text>
              <Text style={[styles.totalValue, { color: theme.secondary }]}>
                UGX {state.totalPrice.toLocaleString()}
              </Text>
            </View>
            
            <TouchableOpacity
              style={[styles.checkoutButton, { backgroundColor: theme.secondary }]}
              onPress={handleCheckout}
              activeOpacity={0.8}
            >
              <Ionicons name="card" size={20} color="#fff" />
              <Text style={styles.checkoutButtonText}>
                Proceed to Checkout
              </Text>
            </TouchableOpacity>
          </View>
        </AnimatedCard>
      </Animated.View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 40,
  },
  emptyContent: {
    alignItems: 'center',
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  browseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  browseButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  itemsContainer: {
    flex: 1,
  },
  itemsContent: {
    padding: 16,
  },
  cartItem: {
    marginBottom: 16,
  },
  itemContent: {
    flexDirection: 'row',
    padding: 16,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
    lineHeight: 20,
  },
  removeButton: {
    padding: 4,
  },
  categoryTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 16,
    minWidth: 20,
    textAlign: 'center',
  },
  itemTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryCard: {
    margin: 16,
    marginTop: 0,
  },
  summaryContent: {
    padding: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  checkoutButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
});

export default CartScreen;
