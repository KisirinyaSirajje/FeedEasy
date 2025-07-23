import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import DatabaseService, { Product, User, Rating } from '../services/DatabaseService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

type ProductDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProductDetail'>;
type ProductDetailScreenRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;

const ProductDetailScreen = () => {
  const { theme } = useTheme();
  const route = useRoute<ProductDetailScreenRouteProp>();
  const navigation = useNavigation<ProductDetailScreenNavigationProp>();
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const { user } = useAuth();

  const { productId } = route.params;
  const [product, setProduct] = useState<Product | null>(null);
  const [seller, setSeller] = useState<User | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProductDetails();
  }, [productId]);

  const loadProductDetails = async () => {
    try {
      setLoading(true);
      const productDetails = await DatabaseService.getProductById(productId);
      if (productDetails) {
        setProduct(productDetails);
        const sellerDetails = await DatabaseService.getUserById(productDetails.sellerId);
        setSeller(sellerDetails);
        const productRatings = await DatabaseService.getRatingsForProduct(productId);
        setRatings(productRatings);
        if (productRatings.length > 0) {
          const total = productRatings.reduce((acc, curr) => acc + curr.rating, 0);
          setAverageRating(total / productRatings.length);
        }
      } else {
        Alert.alert('Error', 'Product not found.');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error loading product details:', error);
      Alert.alert('Error', 'Failed to load product details.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id.toString(),
        name: product.name,
        price: product.price,
        image: product.image || 'https://via.placeholder.com/300x200',
        category: product.category,
      });
      Alert.alert('Success', `${product.name} has been added to your cart.`);
    }
  };

  const handleRateProduct = () => {
    if (!user) {
      Alert.alert('Login Required', 'You must be logged in to rate a product.');
      return;
    }
    // For simplicity, we'll just use a prompt. A modal would be better for UX.
    Alert.prompt(
      'Rate Product',
      'Enter your rating (1-5) and an optional review.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: (text) => {
            if (text) {
              const [ratingStr, ...reviewParts] = text.split(' ');
              const rating = parseInt(ratingStr, 10);
              const review = reviewParts.join(' ');

              if (rating >= 1 && rating <= 5) {
                DatabaseService.createRating({
                  productId: productId,
                  farmerId: user.id,
                  rating: rating,
                  review: review,
                }).then(() => {
                  Alert.alert('Success', 'Your rating has been submitted.');
                  loadProductDetails();
                });
              } else {
                Alert.alert('Invalid Rating', 'Please enter a rating between 1 and 5.');
              }
            }
          },
        },
      ],
      'plain-text'
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: theme.text }}>Product not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Image source={{ uri: product.image }} style={styles.productImage} />
        <View style={styles.contentContainer}>
          <Text style={[styles.productName, { color: theme.text }]}>{product.name}</Text>
          <Text style={[styles.productPrice, { color: theme.primary }]}>
            UGX {product.price.toLocaleString()}
          </Text>
          <Text style={[styles.productDescription, { color: theme.textSecondary }]}>
            {product.description}
          </Text>

          {seller && user && user.userType === 'farmer' && (
            <View style={[styles.sellerInfo, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.sellerName, { color: theme.text }]}>Sold by: {seller.firstName} {seller.lastName}</Text>
              <TouchableOpacity
                style={styles.messageButton}
                onPress={() => navigation.navigate('Chat', { sellerId: seller.id, farmerId: user.id })}
              >
                <Ionicons name="chatbubble-ellipses-outline" size={20} color={theme.primary} />
                <Text style={[styles.messageButtonText, { color: theme.primary }]}>Message Seller</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Ratings Section */}
          <View style={styles.ratingSection}>
            <View style={styles.ratingHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Ratings & Reviews</Text>
              <TouchableOpacity onPress={handleRateProduct}>
                <Text style={{ color: theme.primary }}>Rate this product</Text>
              </TouchableOpacity>
            </View>
            {ratings.length > 0 ? (
              <>
                <View style={styles.averageRatingContainer}>
                  <Text style={[styles.averageRatingText, {color: theme.text}]}>{averageRating.toFixed(1)}</Text>
                  <Ionicons name="star" size={24} color="#FFC107" />
                  <Text style={{color: theme.textSecondary}}> ({ratings.length} ratings)</Text>
                </View>
                {ratings.map(r => (
                  <View key={r.id} style={[styles.review, {borderBottomColor: theme.border}]}>
                    <View style={styles.reviewHeader}>
                      <Text style={[styles.reviewUser, {color: theme.text}]}>User {r.farmerId}</Text>
                      <View style={styles.starRating}>
                        {[...Array(5)].map((_, i) => (
                          <Ionicons key={i} name={i < r.rating ? 'star' : 'star-outline'} size={16} color="#FFC107" />
                        ))}
                      </View>
                    </View>
                    <Text style={{color: theme.textSecondary}}>{r.review}</Text>
                  </View>
                ))}
              </>
            ) : (
              <Text style={{ color: theme.textSecondary }}>No reviews yet. Be the first to rate this product!</Text>
            )}
          </View>
        </View>
      </ScrollView>
      {user?.userType === 'farmer' && (
        <View style={[styles.footer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
          <TouchableOpacity 
            style={[styles.addToCartButton, { backgroundColor: theme.primary }]}
            onPress={handleAddToCart}
          >
            <Text style={styles.addToCartText}>
              {isInCart(product.id.toString()) 
                ? `In Cart (${getItemQuantity(product.id.toString())})` 
                : 'Add to Cart'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  productImage: {
    width: '100%',
    height: 300,
  },
  contentContainer: {
    padding: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  productDescription: {
    fontSize: 16,
    lineHeight: 24,
  },
  sellerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 20,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '500',
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  ratingSection: {
    marginTop: 20,
  },
  ratingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  averageRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  averageRatingText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 8,
  },
  review: {
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  reviewUser: {
    fontWeight: 'bold',
  },
  starRating: {
    flexDirection: 'row',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
  addToCartButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProductDetailScreen;