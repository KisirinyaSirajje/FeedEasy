import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart, CartItem } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import DatabaseService from '../services/DatabaseService';

const CartScreen = () => {
  const { state, updateQuantity, removeFromCart, clearCart } = useCart();
  const { theme } = useTheme();
  const { user } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);

  const handleQuantityChange = (id: string, change: number) => {
    const currentItem = state.items.find(item => item.id === id);
    if (currentItem) {
      const newQuantity = currentItem.quantity + change;
      if (newQuantity > 0) {
        updateQuantity(id, newQuantity);
      } else {
        handleRemoveItem(id);
      }
    }
  };

  const handleRemoveItem = (id: string) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeFromCart(id) },
      ]
    );
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: clearCart },
      ]
    );
  };

  const handleCheckout = async () => {
    if (!user || user.userType !== 'farmer') {
      Alert.alert('Error', 'You must be logged in as a farmer to place an order.');
      return;
    }

    if (state.items.length === 0) {
      Alert.alert('Empty Cart', 'Your cart is empty.');
      return;
    }

    setIsCheckingOut(true);

    try {
      for (const item of state.items) {
        const product = await DatabaseService.getProductById(parseInt(item.id, 10));
        if (!product) {
          throw new Error(`Product with ID ${item.id} not found.`);
        }

        await DatabaseService.createOrder({
          farmerId: user.id,
          sellerId: product.sellerId,
          productId: product.id,
          quantity: item.quantity,
          totalPrice: item.price * item.quantity,
          status: 'pending',
          shippingAddress: user.location, // Using user's default location
        });
      }

      Alert.alert('Success', 'Your order has been placed successfully!');
      clearCart();
    } catch (error) {
      console.error('Checkout error:', error);
      Alert.alert('Error', 'There was an issue placing your order. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={[styles.cartItem, { backgroundColor: theme.surface }]}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={[styles.itemName, { color: theme.text }]}>{item.name}</Text>
        <Text style={[styles.itemCategory, { color: theme.textSecondary }]}>{item.category}</Text>
        <Text style={[styles.itemPrice, { color: theme.primary }]}>UGX {item.price.toLocaleString()}</Text>
      </View>
      <View style={styles.quantityControls}>
        <TouchableOpacity
          style={[styles.quantityButton, { backgroundColor: theme.primary }]}
          onPress={() => handleQuantityChange(item.id, -1)}
        >
          <Ionicons name="remove" size={16} color="#fff" />
        </TouchableOpacity>
        <Text style={[styles.quantity, { color: theme.text }]}>{item.quantity}</Text>
        <TouchableOpacity
          style={[styles.quantityButton, { backgroundColor: theme.primary }]}
          onPress={() => handleQuantityChange(item.id, 1)}
        >
          <Ionicons name="add" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveItem(item.id)}
      >
        <Ionicons name="trash-outline" size={20} color={theme.error} />
      </TouchableOpacity>
    </View>
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyCart}>
      <Ionicons name="cart-outline" size={80} color={theme.textSecondary} />
      <Text style={[styles.emptyTitle, { color: theme.text }]}>Your cart is empty</Text>
      <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
        Add some feed products to get started
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        {state.items.length > 0 && (
          <TouchableOpacity onPress={handleClearCart}>
            <Text style={styles.clearButton}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {state.items.length === 0 ? (
        renderEmptyCart()
      ) : (
        <>
          <FlatList
            data={state.items}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.cartList}
            showsVerticalScrollIndicator={false}
          />
          
          <View style={[styles.cartSummary, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Items ({state.totalItems})</Text>
              <Text style={[styles.summaryValue, { color: theme.text }]}>
                UGX {state.totalPrice.toLocaleString()}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Delivery Fee</Text>
              <Text style={[styles.summaryValue, { color: theme.text }]}>UGX 25,000</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow, { borderTopColor: theme.border }]}>
              <Text style={[styles.totalLabel, { color: theme.text }]}>Total</Text>
              <Text style={[styles.totalValue, { color: theme.primary }]}>
                UGX {(state.totalPrice + 25000).toLocaleString()}
              </Text>
            </View>
            
            <TouchableOpacity
              style={[styles.checkoutButton, { backgroundColor: theme.primary }]}
              onPress={handleCheckout}
              disabled={isCheckingOut}
            >
              {isCheckingOut ? (
                <Text style={styles.checkoutText}>Placing Order...</Text>
              ) : (
                <Text style={styles.checkoutText}>
                  Proceed to Checkout
                </Text>
              )}
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </>
      )}
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
  clearButton: {
    fontSize: 16,
    color: '#c8e6c9',
    textDecorationLine: 'underline',
  },
  cartList: {
    padding: 15,
  },
  cartItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  quantityButton: {
    backgroundColor: '#2e7d32',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    padding: 5,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  cartSummary: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 10,
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  checkoutButton: {
    backgroundColor: '#2e7d32',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 8,
  },
  checkoutText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 8,
  },
});

export default CartScreen;
