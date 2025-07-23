import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import DatabaseService, { Product } from '../services/DatabaseService';

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  stock: string;
  weight: string;
  brand: string;
  ingredients: string;
  nutritionalInfo: string;
  quality_certificates: string;
}

const ManageProductsScreen = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    category: 'poultry',
    stock: '',
    weight: '',
    brand: '',
    ingredients: '',
    nutritionalInfo: '',
    quality_certificates: '',
  });

  const categories = [
    { value: 'poultry', label: 'Poultry Feed' },
    { value: 'pig', label: 'Pig Feed' },
    { value: 'cattle', label: 'Cattle Feed' },
    { value: 'fish', label: 'Fish Feed' },
  ];

  useEffect(() => {
    if (user?.userType === 'seller') {
      loadProducts();
    }
  }, [user]);

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

  const handleInputChange = (field: keyof ProductFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'poultry',
      stock: '',
      weight: '',
      brand: '',
      ingredients: '',
      nutritionalInfo: '',
      quality_certificates: '',
    });
    setEditingProduct(null);
  };

  const validateForm = (): string | null => {
    if (!formData.name || !formData.price || !formData.stock || !formData.weight || !formData.brand) {
      return 'Please fill in all required fields';
    }

    const price = parseFloat(formData.price);
    const stock = parseInt(formData.stock);

    if (isNaN(price) || price <= 0) {
      return 'Price must be a valid positive number';
    }

    if (isNaN(stock) || stock < 0) {
      return 'Stock must be a valid non-negative number';
    }

    return null;
  };

  const handleSubmit = async () => {
    if (!user || user.userType !== 'seller') return;

    const validationError = validateForm();
    if (validationError) {
      Alert.alert('Validation Error', validationError);
      return;
    }

    setIsLoading(true);

    try {
      const productData = {
        sellerId: user.id,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock),
        image: 'https://via.placeholder.com/300x200', // Default image
        weight: formData.weight,
        brand: formData.brand,
        ingredients: formData.ingredients || undefined,
        nutritionalInfo: formData.nutritionalInfo || undefined,
        quality_certificates: formData.quality_certificates || undefined,
      };

      if (editingProduct) {
        // Update existing product
        const success = await DatabaseService.updateProduct(editingProduct.id, productData);
        if (success) {
          Alert.alert('Success', 'Product updated successfully');
          await loadProducts();
          setShowForm(false);
          resetForm();
        } else {
          Alert.alert('Error', 'Failed to update product');
        }
      } else {
        // Create new product
        await DatabaseService.createProduct(productData);
        Alert.alert('Success', 'Product created successfully');
        await loadProducts();
        setShowForm(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving product:', error);
      Alert.alert('Error', 'Failed to save product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      weight: product.weight,
      brand: product.brand,
      ingredients: product.ingredients || '',
      nutritionalInfo: product.nutritionalInfo || '',
      quality_certificates: product.quality_certificates || '',
    });
    setShowForm(true);
  };

  const handleDelete = (product: Product) => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${product.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await DatabaseService.deleteProduct(product.id, user!.id);
              if (success) {
                Alert.alert('Success', 'Product deleted successfully');
                await loadProducts();
              } else {
                Alert.alert('Error', 'Failed to delete product');
              }
            } catch (error) {
              console.error('Error deleting product:', error);
              Alert.alert('Error', 'Failed to delete product');
            }
          },
        },
      ]
    );
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
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Manage Products</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.primary }]}
          onPress={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Products List */}
      <ScrollView style={styles.productsList}>
        {products.length > 0 ? (
          products.map((product) => (
            <View key={product.id} style={[styles.productCard, { backgroundColor: theme.surface }]}>
              <View style={styles.productInfo}>
                <Text style={[styles.productName, { color: theme.text }]}>{product.name}</Text>
                <Text style={[styles.productCategory, { color: theme.textSecondary }]}>
                  {categories.find(c => c.value === product.category)?.label}
                </Text>
                <Text style={[styles.productPrice, { color: theme.primary }]}>
                  UGX {product.price.toLocaleString()}
                </Text>
                <Text style={[styles.productStock, { color: theme.textSecondary }]}>
                  Stock: {product.stock} • Weight: {product.weight}
                </Text>
              </View>
              <View style={styles.productActions}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: theme.primary }]}
                  onPress={() => handleEdit(product)}
                >
                  <Ionicons name="create" size={16} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#f44336' }]}
                  onPress={() => handleDelete(product)}
                >
                  <Ionicons name="trash" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={[styles.emptyState, { backgroundColor: theme.surface }]}>
            <Ionicons name="cube-outline" size={48} color={theme.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No products yet. Create your first product!
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Product Form Modal */}
      <Modal
        visible={showForm}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowForm(false)}>
              <Ionicons name="close" size={24} color={theme.text} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.form}>
            {/* Name */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Product Name *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholder="Enter product name"
                placeholderTextColor={theme.textSecondary}
              />
            </View>

            {/* Category */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Category *</Text>
              <View style={styles.categoryContainer}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.value}
                    style={[
                      styles.categoryButton,
                      { borderColor: theme.border },
                      formData.category === category.value && { backgroundColor: theme.primary }
                    ]}
                    onPress={() => handleInputChange('category', category.value)}
                  >
                    <Text style={[
                      styles.categoryText,
                      { color: formData.category === category.value ? '#fff' : theme.text }
                    ]}>
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Price and Stock */}
            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={[styles.label, { color: theme.text }]}>Price (UGX) *</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                  value={formData.price}
                  onChangeText={(value) => handleInputChange('price', value)}
                  placeholder="0"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="numeric"
                />
              </View>

              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={[styles.label, { color: theme.text }]}>Stock *</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                  value={formData.stock}
                  onChangeText={(value) => handleInputChange('stock', value)}
                  placeholder="0"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Weight and Brand */}
            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={[styles.label, { color: theme.text }]}>Weight *</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                  value={formData.weight}
                  onChangeText={(value) => handleInputChange('weight', value)}
                  placeholder="e.g., 50kg"
                  placeholderTextColor={theme.textSecondary}
                />
              </View>

              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={[styles.label, { color: theme.text }]}>Brand *</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                  value={formData.brand}
                  onChangeText={(value) => handleInputChange('brand', value)}
                  placeholder="Brand name"
                  placeholderTextColor={theme.textSecondary}
                />
              </View>
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Description</Text>
              <TextInput
                style={[styles.textArea, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                value={formData.description}
                onChangeText={(value) => handleInputChange('description', value)}
                placeholder="Product description"
                placeholderTextColor={theme.textSecondary}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Ingredients */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Ingredients</Text>
              <TextInput
                style={[styles.textArea, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                value={formData.ingredients}
                onChangeText={(value) => handleInputChange('ingredients', value)}
                placeholder="List main ingredients"
                placeholderTextColor={theme.textSecondary}
                multiline
                numberOfLines={2}
              />
            </View>

            {/* Nutritional Info */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Nutritional Information</Text>
              <TextInput
                style={[styles.textArea, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                value={formData.nutritionalInfo}
                onChangeText={(value) => handleInputChange('nutritionalInfo', value)}
                placeholder="Nutritional details"
                placeholderTextColor={theme.textSecondary}
                multiline
                numberOfLines={2}
              />
            </View>

            {/* Quality Certificates */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Quality Certificates</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                value={formData.quality_certificates}
                onChangeText={(value) => handleInputChange('quality_certificates', value)}
                placeholder="e.g., UNBS Certified"
                placeholderTextColor={theme.textSecondary}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: theme.primary }]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  productCard: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 12,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productStock: {
    fontSize: 12,
  },
  productActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
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
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  form: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryButton: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
});

export default ManageProductsScreen;
