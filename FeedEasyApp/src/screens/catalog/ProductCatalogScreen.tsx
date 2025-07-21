import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme/colors';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  description: string;
  quality: 'Premium' | 'Standard' | 'Economy';
  inStock: boolean;
  rating: number;
  reviews: number;
}

interface ProductCatalogScreenProps {
  navigation: any;
  route?: any;
}

export const ProductCatalogScreen: React.FC<ProductCatalogScreenProps> = ({
  navigation,
  route,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    route?.params?.category || null
  );
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: '1', name: 'Poultry Feed', icon: '🐔' },
    { id: '2', name: 'Pig Feed', icon: '🐷' },
    { id: '3', name: 'Cattle Feed', icon: '🐄' },
    { id: '4', name: 'Fish Feed', icon: '🐟' },
  ];

  // Mock product data
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Layer Mash Premium',
      category: '1',
      price: 85000,
      unit: '50kg bag',
      description: 'High-quality layer feed for maximum egg production',
      quality: 'Premium',
      inStock: true,
      rating: 4.8,
      reviews: 124,
    },
    {
      id: '2',
      name: 'Broiler Starter',
      category: '1',
      price: 90000,
      unit: '50kg bag',
      description: 'Complete nutrition for broiler chicks 0-3 weeks',
      quality: 'Premium',
      inStock: true,
      rating: 4.6,
      reviews: 89,
    },
    {
      id: '3',
      name: 'Pig Grower Feed',
      category: '2',
      price: 75000,
      unit: '50kg bag',
      description: 'Balanced nutrition for growing pigs 8-20 weeks',
      quality: 'Standard',
      inStock: true,
      rating: 4.4,
      reviews: 67,
    },
    {
      id: '4',
      name: 'Dairy Cow Supplement',
      category: '3',
      price: 120000,
      unit: '50kg bag',
      description: 'Mineral and vitamin supplement for dairy cows',
      quality: 'Premium',
      inStock: false,
      rating: 4.7,
      reviews: 45,
    },
    {
      id: '5',
      name: 'Tilapia Feed Pellets',
      category: '4',
      price: 95000,
      unit: '25kg bag',
      description: 'Floating pellets for tilapia fish farming',
      quality: 'Standard',
      inStock: true,
      rating: 4.3,
      reviews: 32,
    },
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, selectedCategory, products]);

  const loadProducts = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setProducts(mockProducts);
    setLoading(false);
  };

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'Premium':
        return colors.success;
      case 'Standard':
        return colors.primary;
      case 'Economy':
        return colors.warning;
      default:
        return colors.textSecondary;
    }
  };

  const formatPrice = (price: number) => {
    return `UGX ${price.toLocaleString()}`;
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push('⭐');
    }
    if (hasHalfStar) {
      stars.push('⭐');
    }
    
    return stars.join('');
  };

  const handleProductPress = (product: Product) => {
    // TODO: Navigate to product details screen
    Alert.alert(
      product.name,
      `${product.description}\n\nPrice: ${formatPrice(product.price)} per ${product.unit}`,
      [
        { text: 'Add to Cart', onPress: () => addToCart(product) },
        { text: 'View Details', onPress: () => {} },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const addToCart = (product: Product) => {
    Alert.alert('Added to Cart', `${product.name} has been added to your cart!`);
  };

  const renderCategoryFilter = () => (
    <View style={styles.categoryFilter}>
      <TouchableOpacity
        style={[
          styles.categoryButton,
          !selectedCategory && styles.categoryButtonActive,
        ]}
        onPress={() => setSelectedCategory(null)}
      >
        <Text
          style={[
            styles.categoryButtonText,
            !selectedCategory && styles.categoryButtonTextActive,
          ]}
        >
          All
        </Text>
      </TouchableOpacity>
      {categories.map(category => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryButton,
            selectedCategory === category.id && styles.categoryButtonActive,
          ]}
          onPress={() => setSelectedCategory(category.id)}
        >
          <Text style={styles.categoryIcon}>{category.icon}</Text>
          <Text
            style={[
              styles.categoryButtonText,
              selectedCategory === category.id && styles.categoryButtonTextActive,
            ]}
          >
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <Text style={styles.searchIcon}>🔍</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search products..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor={colors.textLight}
      />
    </View>
  );

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => handleProductPress(item)}
    >
      <View style={styles.productHeader}>
        <Text style={styles.productName}>{item.name}</Text>
        <View
          style={[
            styles.qualityBadge,
            { backgroundColor: getQualityColor(item.quality) },
          ]}
        >
          <Text style={styles.qualityText}>{item.quality}</Text>
        </View>
      </View>

      <Text style={styles.productDescription}>{item.description}</Text>

      <View style={styles.productDetails}>
        <Text style={styles.productPrice}>{formatPrice(item.price)}</Text>
        <Text style={styles.productUnit}>per {item.unit}</Text>
      </View>

      <View style={styles.productFooter}>
        <View style={styles.ratingContainer}>
          <Text style={styles.stars}>{renderStars(item.rating)}</Text>
          <Text style={styles.ratingText}>
            {item.rating} ({item.reviews} reviews)
          </Text>
        </View>
        
        <View style={styles.stockContainer}>
          <Text
            style={[
              styles.stockText,
              { color: item.inStock ? colors.success : colors.error },
            ]}
          >
            {item.inStock ? '✅ In Stock' : '❌ Out of Stock'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderSearchBar()}
      {renderCategoryFilter()}
      
      <FlatList
        data={filteredProducts}
        renderItem={renderProductItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.productList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No products found</Text>
            <Text style={styles.emptySubtext}>
              Try adjusting your search or category filter
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
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  loadingText: {
    ...typography.body1,
    color: colors.textSecondary,
  },
  
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    margin: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  
  searchIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  
  searchInput: {
    flex: 1,
    ...typography.body1,
    color: colors.text,
    paddingVertical: spacing.md,
  },
  
  categoryFilter: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    backgroundColor: colors.surface,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  
  categoryButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  
  categoryIcon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  
  categoryButtonText: {
    ...typography.body2,
    color: colors.text,
    fontWeight: '600',
  },
  
  categoryButtonTextActive: {
    color: colors.textOnPrimary,
  },
  
  productList: {
    padding: spacing.md,
  },
  
  productCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  
  productName: {
    ...typography.h4,
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  
  qualityBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  
  qualityText: {
    ...typography.caption,
    color: colors.textOnPrimary,
    fontWeight: '600',
  },
  
  productDescription: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  
  productDetails: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.md,
  },
  
  productPrice: {
    ...typography.h4,
    color: colors.primary,
    fontWeight: 'bold',
    marginRight: spacing.sm,
  },
  
  productUnit: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  stars: {
    fontSize: 12,
    marginRight: spacing.xs,
  },
  
  ratingText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  
  stockContainer: {
    alignItems: 'flex-end',
  },
  
  stockText: {
    ...typography.caption,
    fontWeight: '600',
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
