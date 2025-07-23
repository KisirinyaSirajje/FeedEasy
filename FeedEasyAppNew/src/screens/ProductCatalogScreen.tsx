import React, { useState, useEffect, useRef } from 'react';
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
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import DatabaseService, { Product } from '../services/DatabaseService';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import GradientBackground from '../components/GradientBackground';
import AnimatedCard from '../components/AnimatedCard';
import Loader from '../components/Loader';

const { width } = Dimensions.get('window');

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
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const categories = [
    { value: 'All', label: 'All', icon: 'grid' },
    { value: 'poultry', label: 'Poultry', icon: 'egg' },
    { value: 'cattle', label: 'Cattle', icon: 'paw' },
    { value: 'fish', label: 'Aquaculture', icon: 'fish' },
    { value: 'pig', label: 'Swine', icon: 'paw' },
  ];

  useEffect(() => {
    loadProducts();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
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

  const renderProduct = ({ item, index }: { item: Product; index: number }) => (
    <AnimatedCard
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
      delay={index * 100}
      shadow="medium"
      style={styles.productCard}
    >
      <View style={styles.productContent}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image || 'https://via.placeholder.com/300x200' }}
            style={styles.productImage}
            resizeMode="cover"
          />
          <View style={[
            styles.stockBadge,
            { backgroundColor: item.stock > 0 ? theme.success : theme.error }
          ]}>
            <Text style={styles.stockText}>
              {item.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </Text>
          </View>
          {item.quality_certificates && (
            <View style={[styles.certificateBadge, { backgroundColor: theme.secondary }]}>
              <Ionicons name="shield-checkmark" size={12} color="#fff" />
            </View>
          )}
        </View>

        <View style={styles.productInfo}>
          <View style={styles.productHeader}>
            <Text style={[styles.productName, { color: theme.text }]} numberOfLines={2}>
              {item.name}
            </Text>
          </View>
          
          <Text style={[styles.productDescription, { color: theme.textSecondary }]} numberOfLines={2}>
            {item.description}
          </Text>
          
          <View style={styles.productMeta}>
            <View style={[styles.brandTag, { backgroundColor: theme.primary + '15' }]}>
              <Text style={[styles.brandText, { color: theme.primary }]}>
                {item.brand}
              </Text>
            </View>
            <Text style={[styles.weightText, { color: theme.textSecondary }]}>
              {item.weight}
            </Text>
          </View>

          {item.ingredients && (
            <View style={[styles.ingredientsContainer, { backgroundColor: theme.background }]}>
              <Text style={[styles.ingredientsTitle, { color: theme.text }]}>
                Ingredients:
              </Text>
              <Text style={[styles.ingredientsText, { color: theme.textSecondary }]} numberOfLines={1}>
                {item.ingredients}
              </Text>
            </View>
          )}
          
          <View style={styles.productFooter}>
            <View style={styles.priceContainer}>
              <Text style={[styles.productPrice, { color: theme.primary }]}>
                UGX {item.price.toLocaleString()}
              </Text>
              <Text style={[styles.priceUnit, { color: theme.textSecondary }]}>
                per {item.weight}
              </Text>
            </View>
            
            <View style={styles.cartActions}>
              {isInCart(item.id.toString()) && (
                <View style={[styles.inCartIndicator, { backgroundColor: theme.secondary + '20' }]}>
                  <Text style={[styles.inCartText, { color: theme.secondary }]}>
                    {getItemQuantity(item.id.toString())} in cart
                  </Text>
                </View>
              )}
              <TouchableOpacity 
                style={[
                  styles.addToCartButton, 
                  { backgroundColor: item.stock <= 0 ? theme.textSecondary : theme.secondary },
                  isInCart(item.id.toString()) && { backgroundColor: theme.secondaryVariant }
                ]}
                onPress={() => handleAddToCart(item)}
                disabled={item.stock <= 0}
              >
                <Ionicons 
                  name={item.stock <= 0 ? 'notifications' : 'add'} 
                  size={16} 
                  color="#fff" 
                />
                <Text style={styles.addToCartText}>
                  {item.stock <= 0 ? 'Notify' : isInCart(item.id.toString()) ? 'Add More' : 'Add'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </AnimatedCard>
  );

  const renderCategory = ({ item, index }: { item: any; index: number }) => (
    <AnimatedCard
      onPress={() => setSelectedCategory(item.value)}
      delay={index * 50}
      shadow="light"
      style={[
        styles.categoryCard,
        selectedCategory === item.value && { backgroundColor: theme.secondary }
      ]}
    >
      <View style={styles.categoryContent}>
        <Ionicons 
          name={item.icon as any} 
          size={20} 
          color={selectedCategory === item.value ? '#fff' : theme.textSecondary} 
        />
        <Text style={[
          styles.categoryText,
          { color: selectedCategory === item.value ? '#fff' : theme.textSecondary }
        ]}>
          {item.label}
        </Text>
      </View>
    </AnimatedCard>
  );

  if (loading) {
    return <Loader text="Loading products..." type="wave" />;
  }

  return (
    <GradientBackground type="background">
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <View style={[styles.searchContainer, { backgroundColor: theme.surface }]}>
          <View style={[styles.searchInputContainer, { backgroundColor: theme.background }]}>
            <Ionicons name="search" size={20} color={theme.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: theme.text }]}
              placeholder="Search feed products..."
              placeholderTextColor={theme.textSecondary}
              value={searchText}
              onChangeText={setSearchText}
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText('')}>
                <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={[styles.categoriesContainer, { backgroundColor: theme.surface }]}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.value}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        <View style={[styles.resultsHeader, { backgroundColor: theme.surface }]}>
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
              <Ionicons name="search" size={48} color={theme.textSecondary} />
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                No products found. Try adjusting your search or category.
              </Text>
            </View>
          }
        />
      </Animated.View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  categoriesContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryCard: {
    marginRight: 12,
    minWidth: 80,
  },
  categoryContent: {
    alignItems: 'center',
    padding: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  resultsText: {
    fontSize: 14,
    fontWeight: '600',
  },
  productsList: {
    padding: 16,
  },
  productCard: {
    marginBottom: 16,
  },
  productContent: {
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#f0f0f0',
  },
  stockBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stockText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  certificateBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    padding: 16,
  },
  productHeader: {
    marginBottom: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  productDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  brandTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  brandText: {
    fontSize: 12,
    fontWeight: '600',
  },
  weightText: {
    fontSize: 12,
    fontWeight: '500',
  },
  ingredientsContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  ingredientsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  ingredientsText: {
    fontSize: 13,
    lineHeight: 18,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  priceContainer: {
    flex: 1,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  priceUnit: {
    fontSize: 12,
    marginTop: 2,
  },
  cartActions: {
    alignItems: 'flex-end',
  },
  inCartIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  inCartText: {
    fontSize: 12,
    fontWeight: '600',
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addToCartText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 16,
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 22,
  },
});

export default ProductCatalogScreen;
