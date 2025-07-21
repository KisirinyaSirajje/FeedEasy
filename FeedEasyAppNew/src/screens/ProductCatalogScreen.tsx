import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  image: string;
  nutritionInfo: {
    protein: string;
    fat: string;
    fiber: string;
  };
}

const ProductCatalogScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Sample product data for Ugandan farmers
  const products: Product[] = [
    {
      id: '1',
      name: 'Premium Poultry Layer Feed',
      description: 'Complete nutrition for laying hens - increases egg production for farmers in Kampala and surrounding areas',
      price: 285000,
      category: 'Poultry',
      inStock: true,
      image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=300&h=200&fit=crop',
      nutritionInfo: { protein: '16-18%', fat: '3-4%', fiber: '6-8%' }
    },
    {
      id: '2',
      name: 'Dairy Cattle Feed Pellets',
      description: 'High-energy feed for dairy cows in Mbarara and Western Uganda - boosts milk production',
      price: 360000,
      category: 'Cattle',
      inStock: true,
      image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=300&h=200&fit=crop',
      nutritionInfo: { protein: '14-16%', fat: '3-5%', fiber: '18-22%' }
    },
    {
      id: '3',
      name: 'Tilapia Feed Concentrate',
      description: 'Specialized floating feed for tilapia farming around Lake Victoria',
      price: 204000,
      category: 'Aquaculture',
      inStock: false,
      image: 'https://images.unsplash.com/photo-1544943156-4e2f4d38b032?w=300&h=200&fit=crop',
      nutritionInfo: { protein: '28-32%', fat: '6-8%', fiber: '4-6%' }
    },
    {
      id: '4',
      name: 'Pig Grower Feed',
      description: 'Balanced nutrition for growing pigs in Central and Eastern Uganda (20-50kg)',
      price: 315000,
      category: 'Swine',
      inStock: true,
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=200&fit=crop',
      nutritionInfo: { protein: '16-18%', fat: '4-6%', fiber: '6-8%' }
    },
    {
      id: '5',
      name: 'Broiler Starter Feed',
      description: 'High-protein feed for young broiler chickens popular in Gulu and Northern Uganda (0-3 weeks)',
      price: 294000,
      category: 'Poultry',
      inStock: true,
      image: 'https://images.unsplash.com/photo-1518777977976-7dc8a0eb7b2c?w=300&h=200&fit=crop',
      nutritionInfo: { protein: '20-23%', fat: '3-5%', fiber: '4-6%' }
    },
    {
      id: '6',
      name: 'Goat & Sheep Pellets',
      description: 'Complete feed for goats and sheep in Karamoja and pastoral areas - improves weight gain',
      price: 246000,
      category: 'Small Ruminants',
      inStock: true,
      image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=300&h=200&fit=crop',
      nutritionInfo: { protein: '14-16%', fat: '3-4%', fiber: '15-18%' }
    },
    {
      id: '7',
      name: 'Rabbit Pellets Premium',
      description: 'High-quality pellets for rabbit farming in Central Uganda - promotes healthy growth',
      price: 180000,
      category: 'Small Ruminants',
      inStock: true,
      image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=300&h=200&fit=crop',
      nutritionInfo: { protein: '16-18%', fat: '3-4%', fiber: '18-20%' }
    },
    {
      id: '8',
      name: 'Catfish Feed Floating',
      description: 'Premium floating feed for catfish farming - popular around Jinja and eastern regions',
      price: 225000,
      category: 'Aquaculture',
      inStock: true,
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=200&fit=crop',
      nutritionInfo: { protein: '30-35%', fat: '8-10%', fiber: '3-5%' }
    },
  ];

  const categories = ['All', 'Poultry', 'Cattle', 'Aquaculture', 'Swine', 'Small Ruminants'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity style={styles.productCard}>
      <Image 
        source={{ uri: item.image }} 
        style={styles.productImage}
        resizeMode="cover"
      />
      <View style={styles.productContent}>
        <View style={styles.productHeader}>
          <Text style={styles.productName}>{item.name}</Text>
          <View style={[
            styles.stockStatus,
            { backgroundColor: item.inStock ? '#4caf50' : '#f44336' }
          ]}>
            <Text style={styles.stockText}>
              {item.inStock ? 'In Stock' : 'Out of Stock'}
            </Text>
          </View>
        </View>
      
      <Text style={styles.productDescription}>{item.description}</Text>
      <Text style={styles.productCategory}>Category: {item.category}</Text>
      
      <View style={styles.nutritionInfo}>
        <Text style={styles.nutritionTitle}>Nutrition Facts:</Text>
        <Text style={styles.nutritionText}>
          Protein: {item.nutritionInfo.protein} | Fat: {item.nutritionInfo.fat} | Fiber: {item.nutritionInfo.fiber}
        </Text>
      </View>
      
      <View style={styles.productFooter}>
        <Text style={styles.productPrice}>UGX {item.price.toLocaleString()} / 70kg bag</Text>
        <TouchableOpacity 
          style={[styles.addToCartButton, !item.inStock && styles.disabledButton]}
          disabled={!item.inStock}
        >
          <Text style={styles.addToCartText}>
            {item.inStock ? 'Add to Cart' : 'Notify Me'}
          </Text>
        </TouchableOpacity>
      </View>
      </View>
    </TouchableOpacity>
  );

  const renderCategory = (category: string) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryButton,
        selectedCategory === category && styles.selectedCategory
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text style={[
        styles.categoryText,
        selectedCategory === category && styles.selectedCategoryText
      ]}>
        {category}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search feed products..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          renderItem={({ item }) => renderCategory(item)}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          {filteredProducts.length} products found
        </Text>
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.productsList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  selectedCategory: {
    backgroundColor: '#2e7d32',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  selectedCategoryText: {
    color: '#fff',
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
    marginBottom: 10,
    fontWeight: '500',
  },
  nutritionInfo: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
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
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
});

export default ProductCatalogScreen;
