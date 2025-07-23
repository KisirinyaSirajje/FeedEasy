import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import DatabaseService, { Product } from '../services/DatabaseService';
import { useNavigation } from '@react-navigation/native';

const SellerProductsScreen = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (user?.userType === 'seller') {
      loadProducts();
    }
    const unsubscribe = navigation.addListener('focus', () => {
      if (user?.userType === 'seller') {
        loadProducts();
      }
    });

    return unsubscribe;
  }, [user, navigation]);

  const loadProducts = async () => {
    if (!user || user.userType !== 'seller') return;

    try {
      const sellerProducts = await DatabaseService.getProductsBySeller(user.id);
      setProducts(sellerProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      Alert.alert('Error', 'Failed to load products');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
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
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <Text style={styles.title}>My Products</Text>
      </View>

      <View style={styles.section}>
        {products.length > 0 ? (
          products.map((product) => (
            <View key={product.id} style={[styles.productCard, { backgroundColor: theme.surface }]}>
              <Image 
                source={{ uri: product.image || 'https://via.placeholder.com/300x200' }} 
                style={styles.productImage}
              />
              <View style={styles.productInfo}>
                <Text style={[styles.productName, { color: theme.text }]}>{product.name}</Text>
                <Text style={[styles.productPrice, { color: theme.primary }]}>
                  UGX {product.price.toLocaleString()}
                </Text>
                <Text style={[styles.productStock, { color: theme.textSecondary }]}>
                  Stock: {product.stock}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View style={[styles.emptyState, { backgroundColor: theme.surface }]}>
            <Ionicons name="cube-outline" size={48} color={theme.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              You have not added any products yet.
            </Text>
            <TouchableOpacity 
              style={[styles.addButton, {backgroundColor: theme.primary}]}
              onPress={() => navigation.navigate('ManageProducts' as never)}
            >
              <Text style={styles.addButtonText}>Add Your First Product</Text>
            </TouchableOpacity>
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
  productCard: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productStock: {
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
    marginBottom: 20,
    textAlign: 'center',
  },
  addButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
});

export default SellerProductsScreen;