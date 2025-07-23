import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import DatabaseService, { Product } from '../services/DatabaseService';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

type ProductCatalogScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Drawer'>;

const ProductCatalogScreen = () => {
  const navigation = useNavigation<ProductCatalogScreenNavigationProp>();
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const { theme } = useTheme();

  const categories = [
    { value: 'All', label: 'All' },
    { value: 'poultry', label: 'Poultry' },
    { value: 'cattle', label: 'Cattle' },
    { value: 'fish', label: 'Aquaculture' },
    { value: 'pig', label: 'Swine' },
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const allProducts = await DatabaseService.getProducts();
      setProducts(allProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      Alert.alert('Error', 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: Product) => {
    if (product.stock <= 0) {
      Alert.alert(
        'Out of Stock',
        'This product is currently out of stock. You will be notified when it becomes available.',
        [{ text: 'OK' }]
      );
      return;
    }

    addToCart({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      image: product.image || 'https://via.placeholder.com/300x200',
      category: product.category,
    });

    Alert.alert(
      'Added to Cart',
      `${product.name} has been added to your cart.`,
      [{ text: 'OK' }]
    );
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={[styles.productCard, { backgroundColor: theme.surface }]}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
    >
      <Image
        source={{ uri: item.image || 'https://via.placeholder.com/300x200' }}
        style={styles.productImage}
        resizeMode="cover"
      />
      <View style={styles.productContent}>
        <View style={styles.productHeader}>
          <Text style={[styles.productName, { color: theme.text }]}>{item.name}</Text>
          <View style={[
            styles.stockStatus,
            { backgroundColor: item.stock > 0 ? '#4caf50' : '#f44336' }
          ]}>
            <Text style={styles.stockText}>
              {item.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </Text>
          </View>
        </View>
      
        <Text style={[styles.productDescription, { color: theme.textSecondary }]}>
          {item.description}
        </Text>
        
        <Text style={[styles.productCategory, { color: theme.primary }]}>
          Brand: {item.brand}
        </Text>
        
        <View style={styles.productDetails}>
          <Text style={[styles.productWeight, { color: theme.textSecondary }]}>
            Weight: {item.weight}
          </Text>
          <Text style={[styles.productStock, { color: theme.textSecondary }]}>
            Stock: {item.stock}
          </Text>
        </View>

        {item.ingredients && (
          <View style={[styles.nutritionInfo, { backgroundColor: theme.background }]}>
            <Text style={[styles.nutritionTitle, { color: theme.text }]}>Ingredients:</Text>
            <Text style={[styles.nutritionText, { color: theme.textSecondary }]}>
              {item.ingredients}
            </Text>
          </View>
        )}

        {item.quality_certificates && (
          <View style={[styles.qualityInfo, { backgroundColor: theme.background }]}>
            <Text style={[styles.qualityTitle, { color: theme.text }]}>Quality Certificates:</Text>
            <Text style={[styles.qualityText, { color: theme.primary }]}>
              {item.quality_certificates}
            </Text>
          </View>
        )}
        
        <View style={styles.productFooter}>
          <Text style={[styles.productPrice, { color: theme.primary }]}>
            UGX {item.price.toLocaleString()} / {item.weight}
          </Text>
          <View style={styles.cartActions}>
            {isInCart(item.id.toString()) && (
              <Text style={[styles.inCartText, { color: theme.primary }]}>
                In Cart ({getItemQuantity(item.id.toString())})
              </Text>
            )}
            <TouchableOpacity 
              style={[
                styles.addToCartButton, 
                { backgroundColor: theme.primary },
                item.stock <= 0 && styles.disabledButton,
                isInCart(item.id.toString()) && { backgroundColor: theme.primaryVariant }
              ]}
              onPress={() => handleAddToCart(item)}
              disabled={item.stock <= 0}
            >
              <Text style={styles.addToCartText}>
                {item.stock <= 0 ? 'Notify Me' : isInCart(item.id.toString()) ? 'Add More' : 'Add to Cart'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCategory = (category: { value: string; label: string }) => (
    <TouchableOpacity
      key={category.value}
      style={[
        styles.categoryButton,
        { backgroundColor: theme.background },
        selectedCategory === category.value && { backgroundColor: theme.primary }
      ]}
      onPress={() => setSelectedCategory(category.value)}
    >
      <Text style={[
        styles.categoryText,
        { color: theme.textSecondary },
        selectedCategory === category.value && { color: '#fff' }
      ]}>
        {category.label}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.text }]}>Loading products...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.searchContainer, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
          placeholder="Search feed products..."
          placeholderTextColor={theme.textSecondary}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <View style={[styles.categoriesContainer, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          renderItem={({ item }) => renderCategory(item)}
          keyExtractor={(item) => item.value}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      <View style={[styles.resultsHeader, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <Text style={[styles.resultsText, { color: theme.textSecondary }]}>
          {filteredProducts.length} products found
        </Text>
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.productsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={[styles.emptyState, { backgroundColor: theme.surface }]}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No products found. Try adjusting your search or category.
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
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  searchContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  categoriesContainer: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  categoriesList: {
    paddingHorizontal: 15,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  resultsHeader: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  resultsText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  productsList: {
    padding: 15,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#f0f0f0',
  },
  productContent: {
    padding: 15,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  stockStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  stockText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  productCategory: {
    fontSize: 12,
    color: '#2e7d32',
    marginBottom: 8,
    fontWeight: '500',
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  productWeight: {
    fontSize: 12,
    color: '#666',
  },
  productStock: {
    fontSize: 12,
    color: '#666',
  },
  nutritionInfo: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  nutritionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  nutritionText: {
    fontSize: 13,
    color: '#666',
  },
  qualityInfo: {
    backgroundColor: '#e8f5e8',
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
  },
  qualityTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  qualityText: {
    fontSize: 13,
    color: '#2e7d32',
    fontWeight: '500',
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartActions: {
    alignItems: 'flex-end',
  },
  inCartText: {
    fontSize: 12,
    color: '#2e7d32',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  addToCartButton: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  addToCartText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 10,
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ProductCatalogScreen;
