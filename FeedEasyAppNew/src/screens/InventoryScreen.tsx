import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Modal,
  Animated,
  Dimensions,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import GradientBackground from '../components/GradientBackground';
import AnimatedCard from '../components/AnimatedCard';
import Loader from '../components/Loader';

const { width } = Dimensions.get('window');

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  unit: string;
  minLevel: number;
  lastPurchase: string;
  cost: number;
  supplier: string;
  image?: string;
  description?: string;
  location?: string;
  expiryDate?: string;
}

const InventoryScreen = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'current' | 'alerts' | 'add'>('current');
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Form state for add/edit
  const [formData, setFormData] = useState({
    name: '',
    category: 'Poultry',
    currentStock: '',
    unit: 'bags',
    minLevel: '',
    cost: '',
    supplier: '',
    description: '',
    location: '',
    expiryDate: '',
  });

  const categories = ['Poultry', 'Cattle', 'Swine', 'Aquaculture', 'Other'];

  useEffect(() => {
    loadInventoryData();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadInventoryData = () => {
    // Simulate loading data
    const mockData: InventoryItem[] = [
      {
        id: '1',
        name: 'Premium Poultry Layer Feed',
        category: 'Poultry',
        currentStock: 15,
        unit: '70kg bags',
        minLevel: 5,
        lastPurchase: '2024-01-10',
        cost: 45000,
        supplier: 'FeedEasy',
        image: 'https://via.placeholder.com/300x200',
        description: 'High-quality layer feed for optimal egg production',
        location: 'Warehouse A',
        expiryDate: '2024-06-15',
      },
      {
        id: '2',
        name: 'Dairy Cattle Feed Pellets',
        category: 'Cattle',
        currentStock: 3,
        unit: '70kg bags',
        minLevel: 8,
        lastPurchase: '2024-01-05',
        cost: 42000,
        supplier: 'FeedEasy',
        image: 'https://via.placeholder.com/300x200',
        description: 'Nutritious feed for dairy cattle',
        location: 'Warehouse B',
        expiryDate: '2024-05-20',
      },
      {
        id: '3',
        name: 'Broiler Starter Feed',
        category: 'Poultry',
        currentStock: 12,
        unit: '50kg bags',
        minLevel: 6,
        lastPurchase: '2024-01-12',
        cost: 38000,
        supplier: 'FeedEasy',
        image: 'https://via.placeholder.com/300x200',
        description: 'Starter feed for broiler chicks',
        location: 'Warehouse A',
        expiryDate: '2024-07-10',
      },
      {
        id: '4',
        name: 'Pig Grower Feed',
        category: 'Swine',
        currentStock: 2,
        unit: '70kg bags',
        minLevel: 4,
        lastPurchase: '2024-01-08',
        cost: 38000,
        supplier: 'FeedEasy',
        image: 'https://via.placeholder.com/300x200',
        description: 'Growth feed for pigs',
        location: 'Warehouse C',
        expiryDate: '2024-06-30',
      },
    ];
    setInventoryItems(mockData);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Poultry',
      currentStock: '',
      unit: 'bags',
      minLevel: '',
      cost: '',
      supplier: '',
      description: '',
      location: '',
      expiryDate: '',
    });
    setSelectedImage(null);
  };

  const handleAddItem = () => {
    if (!formData.name || !formData.currentStock || !formData.minLevel || !formData.cost) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    const newItem: InventoryItem = {
      id: Date.now().toString(),
      name: formData.name,
      category: formData.category,
      currentStock: parseInt(formData.currentStock),
      unit: formData.unit,
      minLevel: parseInt(formData.minLevel),
      lastPurchase: new Date().toISOString().split('T')[0],
      cost: parseInt(formData.cost),
      supplier: formData.supplier || 'FeedEasy',
      image: selectedImage || 'https://via.placeholder.com/300x200',
      description: formData.description,
      location: formData.location,
      expiryDate: formData.expiryDate,
    };

    setInventoryItems(prev => [newItem, ...prev]);
    setShowAddModal(false);
    resetForm();
    Alert.alert('Success', 'Item added to inventory successfully!');
  };

  const handleEditItem = () => {
    if (!selectedItem || !formData.name || !formData.currentStock || !formData.minLevel || !formData.cost) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    const updatedItem: InventoryItem = {
      ...selectedItem,
      name: formData.name,
      category: formData.category,
      currentStock: parseInt(formData.currentStock),
      unit: formData.unit,
      minLevel: parseInt(formData.minLevel),
      cost: parseInt(formData.cost),
      supplier: formData.supplier,
      image: selectedImage || selectedItem.image,
      description: formData.description,
      location: formData.location,
      expiryDate: formData.expiryDate,
    };

    setInventoryItems(prev => prev.map(item => item.id === selectedItem.id ? updatedItem : item));
    setShowEditModal(false);
    resetForm();
    setSelectedItem(null);
    Alert.alert('Success', 'Item updated successfully!');
  };

  const handleDeleteItem = (item: InventoryItem) => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete "${item.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setInventoryItems(prev => prev.filter(i => i.id !== item.id));
            Alert.alert('Success', 'Item deleted successfully!');
          }
        },
      ]
    );
  };

  const openEditModal = (item: InventoryItem) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      currentStock: item.currentStock.toString(),
      unit: item.unit,
      minLevel: item.minLevel.toString(),
      cost: item.cost.toString(),
      supplier: item.supplier,
      description: item.description || '',
      location: item.location || '',
      expiryDate: item.expiryDate || '',
    });
    setSelectedImage(item.image);
    setShowEditModal(true);
  };

  const openImageModal = (image: string) => {
    setSelectedImage(image);
    setShowImageModal(true);
  };

  const lowStockItems = inventoryItems.filter(item => item.currentStock <= item.minLevel);

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock <= item.minLevel) return 'low';
    if (item.currentStock <= item.minLevel * 1.5) return 'medium';
    return 'good';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'low': return theme.error;
      case 'medium': return theme.warning;
      case 'good': return theme.success;
      default: return theme.textSecondary;
    }
  };

  const renderInventoryItem = ({ item, index }: { item: InventoryItem; index: number }) => {
    const status = getStockStatus(item);
    const statusColor = getStatusColor(status);

    return (
      <AnimatedCard
        delay={index * 100}
        shadow="medium"
        style={styles.inventoryCard}
      >
        <View style={styles.itemContent}>
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={() => openImageModal(item.image || '')}
          >
            <Image
              source={{ uri: item.image || 'https://via.placeholder.com/300x200' }}
              style={styles.itemImage}
              resizeMode="cover"
            />
            <View style={[styles.stockBadge, { backgroundColor: statusColor }]}>
              <Text style={styles.stockBadgeText}>
                {status.toUpperCase()}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.itemDetails}>
            <View style={styles.itemHeader}>
              <Text style={[styles.itemName, { color: theme.text }]} numberOfLines={2}>
                {item.name}
              </Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: theme.primary + '20' }]}
                  onPress={() => openEditModal(item)}
                >
                  <Ionicons name="create" size={16} color={theme.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: theme.error + '20' }]}
                  onPress={() => handleDeleteItem(item)}
                >
                  <Ionicons name="trash" size={16} color={theme.error} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.categoryTag, { backgroundColor: theme.secondary + '20' }]}>
              <Text style={[styles.categoryText, { color: theme.secondary }]}>
                {item.category}
              </Text>
            </View>

            <View style={styles.stockInfo}>
              <View style={styles.stockRow}>
                <Text style={[styles.stockLabel, { color: theme.textSecondary }]}>
                  Current Stock:
                </Text>
                <Text style={[styles.stockValue, { color: theme.text }]}>
                  {item.currentStock} {item.unit}
                </Text>
              </View>
              <View style={styles.stockRow}>
                <Text style={[styles.stockLabel, { color: theme.textSecondary }]}>
                  Min Level:
                </Text>
                <Text style={[styles.stockValue, { color: theme.text }]}>
                  {item.minLevel} {item.unit}
                </Text>
              </View>
            </View>

            <View style={styles.priceInfo}>
              <Text style={[styles.priceLabel, { color: theme.textSecondary }]}>
                Cost per {item.unit}:
              </Text>
              <Text style={[styles.priceValue, { color: theme.primary }]}>
                UGX {item.cost.toLocaleString()}
              </Text>
            </View>

            {item.description && (
              <Text style={[styles.description, { color: theme.textSecondary }]} numberOfLines={2}>
                {item.description}
              </Text>
            )}

            <View style={styles.itemFooter}>
              <Text style={[styles.supplier, { color: theme.textSecondary }]}>
                {item.supplier}
              </Text>
              <Text style={[styles.date, { color: theme.textSecondary }]}>
                {new Date(item.lastPurchase).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
      </AnimatedCard>
    );
  };

  const renderCurrentInventory = () => (
    <Animated.View style={[styles.tabContent, { opacity: fadeAnim }]}>
      <View style={styles.summaryCards}>
        <AnimatedCard shadow="light" style={styles.summaryCard}>
          <View style={[styles.summaryIcon, { backgroundColor: theme.primary + '20' }]}>
            <Ionicons name="cube" size={24} color={theme.primary} />
          </View>
          <Text style={[styles.summaryValue, { color: theme.text }]}>
            {inventoryItems.length}
          </Text>
          <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
            Total Items
          </Text>
        </AnimatedCard>

        <AnimatedCard shadow="light" style={styles.summaryCard}>
          <View style={[styles.summaryIcon, { backgroundColor: theme.error + '20' }]}>
            <Ionicons name="warning" size={24} color={theme.error} />
          </View>
          <Text style={[styles.summaryValue, { color: theme.error }]}>
            {lowStockItems.length}
          </Text>
          <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
            Low Stock
          </Text>
        </AnimatedCard>

        <AnimatedCard shadow="light" style={styles.summaryCard}>
          <View style={[styles.summaryIcon, { backgroundColor: theme.secondary + '20' }]}>
            <Ionicons name="cash" size={24} color={theme.secondary} />
          </View>
          <Text style={[styles.summaryValue, { color: theme.text }]}>
            UGX {inventoryItems.reduce((sum, item) => sum + (item.cost * item.currentStock), 0).toLocaleString()}
          </Text>
          <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
            Total Value
          </Text>
        </AnimatedCard>
      </View>

      <View style={styles.inventoryHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Inventory Items
        </Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.secondary }]}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Add Item</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={inventoryItems}
        renderItem={renderInventoryItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.inventoryList}
      />
    </Animated.View>
  );

  const renderAlerts = () => (
    <Animated.View style={[styles.tabContent, { opacity: fadeAnim }]}>
      <View style={styles.alertsHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Low Stock Alerts
        </Text>
        <Text style={[styles.alertCount, { color: theme.error }]}>
          {lowStockItems.length} items need attention
        </Text>
      </View>

      {lowStockItems.length === 0 ? (
        <AnimatedCard shadow="light" style={styles.emptyAlert}>
          <View style={[styles.emptyIcon, { backgroundColor: theme.success + '20' }]}>
            <Ionicons name="checkmark-circle" size={48} color={theme.success} />
          </View>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            All Good!
          </Text>
          <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
            No low stock alerts at the moment
          </Text>
        </AnimatedCard>
      ) : (
        lowStockItems.map((item, index) => (
          <AnimatedCard
            key={item.id}
            delay={index * 100}
            shadow="light"
            style={styles.alertCard}
          >
            <View style={styles.alertContent}>
              <View style={[styles.alertIcon, { backgroundColor: theme.error + '20' }]}>
                <Ionicons name="warning" size={24} color={theme.error} />
              </View>
              <View style={styles.alertDetails}>
                <Text style={[styles.alertTitle, { color: theme.text }]}>
                  {item.name}
                </Text>
                <Text style={[styles.alertMessage, { color: theme.textSecondary }]}>
                  Current stock: {item.currentStock} {item.unit} (Min: {item.minLevel})
                </Text>
                <Text style={[styles.alertPrice, { color: theme.primary }]}>
                  UGX {item.cost.toLocaleString()} per {item.unit}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.restockButton, { backgroundColor: theme.primary }]}
                onPress={() => openEditModal(item)}
              >
                <Text style={styles.restockButtonText}>Restock</Text>
              </TouchableOpacity>
            </View>
          </AnimatedCard>
        ))
      )}
    </Animated.View>
  );

  const renderAddItemForm = () => (
    <Animated.View style={[styles.tabContent, { opacity: fadeAnim }]}>
      <AnimatedCard shadow="heavy" style={styles.addFormCard}>
        <View style={styles.formHeader}>
          <Text style={[styles.formTitle, { color: theme.text }]}>
            Add New Inventory Item
          </Text>
          <Text style={[styles.formSubtitle, { color: theme.textSecondary }]}>
            Fill in the details below to add a new item
          </Text>
        </View>

        <ScrollView style={styles.formContent} showsVerticalScrollIndicator={false}>
          <View style={styles.imageSection}>
            <Text style={[styles.sectionLabel, { color: theme.text }]}>Item Image</Text>
            <TouchableOpacity
              style={[styles.imageUpload, { backgroundColor: theme.background }]}
              onPress={() => {
                Alert.alert(
                  'Add Image',
                  'Choose an option',
                  [
                    { text: 'Camera', onPress: takePhoto },
                    { text: 'Gallery', onPress: pickImage },
                    { text: 'Cancel', style: 'cancel' },
                  ]
                );
              }}
            >
              {selectedImage ? (
                <Image source={{ uri: selectedImage }} style={styles.uploadedImage} />
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <Ionicons name="camera" size={32} color={theme.textSecondary} />
                  <Text style={[styles.uploadText, { color: theme.textSecondary }]}>
                    Tap to add image
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>Item Name *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
              placeholder="Enter item name"
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>Category</Text>
            <View style={styles.categoryButtons}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    { backgroundColor: formData.category === category ? theme.secondary : theme.background },
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, category }))}
                >
                  <Text style={[
                    styles.categoryButtonText,
                    { color: formData.category === category ? '#fff' : theme.textSecondary }
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>Current Stock *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                value={formData.currentStock}
                onChangeText={(text) => setFormData(prev => ({ ...prev, currentStock: text }))}
                placeholder="0"
                placeholderTextColor={theme.textSecondary}
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>Unit</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                value={formData.unit}
                onChangeText={(text) => setFormData(prev => ({ ...prev, unit: text }))}
                placeholder="bags"
                placeholderTextColor={theme.textSecondary}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>Min Level *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                value={formData.minLevel}
                onChangeText={(text) => setFormData(prev => ({ ...prev, minLevel: text }))}
                placeholder="0"
                placeholderTextColor={theme.textSecondary}
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>Cost (UGX) *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                value={formData.cost}
                onChangeText={(text) => setFormData(prev => ({ ...prev, cost: text }))}
                placeholder="0"
                placeholderTextColor={theme.textSecondary}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>Supplier</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
              value={formData.supplier}
              onChangeText={(text) => setFormData(prev => ({ ...prev, supplier: text }))}
              placeholder="Enter supplier name"
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>Description</Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              placeholder="Enter item description"
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>Location</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                value={formData.location}
                onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
                placeholder="Warehouse location"
                placeholderTextColor={theme.textSecondary}
              />
            </View>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>Expiry Date</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                value={formData.expiryDate}
                onChangeText={(text) => setFormData(prev => ({ ...prev, expiryDate: text }))}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={theme.textSecondary}
              />
            </View>
          </View>

          <View style={styles.formButtons}>
            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: theme.background }]}
              onPress={() => {
                setShowAddModal(false);
                resetForm();
              }}
            >
              <Text style={[styles.cancelButtonText, { color: theme.textSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: theme.secondary }]}
              onPress={handleAddItem}
            >
              <Text style={styles.saveButtonText}>
                Add Item
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </AnimatedCard>
    </Animated.View>
  );

  if (isLoading) {
    return <Loader text="Loading inventory..." type="wave" />;
  }

  return (
    <GradientBackground type="background">
      <View style={styles.container}>
        <View style={[styles.header, { backgroundColor: theme.surface }]}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Inventory Management
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            Track your feed inventory
          </Text>
        </View>

        <View style={[styles.tabBar, { backgroundColor: theme.surface }]}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedTab === 'current' && { backgroundColor: theme.secondary }
            ]}
            onPress={() => setSelectedTab('current')}
          >
            <Ionicons 
              name="cube" 
              size={20} 
              color={selectedTab === 'current' ? '#fff' : theme.textSecondary} 
            />
            <Text style={[
              styles.tabText,
              { color: selectedTab === 'current' ? '#fff' : theme.textSecondary }
            ]}>
              Current
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedTab === 'alerts' && { backgroundColor: theme.error }
            ]}
            onPress={() => setSelectedTab('alerts')}
          >
            <Ionicons 
              name="warning" 
              size={20} 
              color={selectedTab === 'alerts' ? '#fff' : theme.textSecondary} 
            />
            <Text style={[
              styles.tabText,
              { color: selectedTab === 'alerts' ? '#fff' : theme.textSecondary }
            ]}>
              Alerts ({lowStockItems.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedTab === 'add' && { backgroundColor: theme.primary }
            ]}
            onPress={() => setSelectedTab('add')}
          >
            <Ionicons 
              name="add" 
              size={20} 
              color={selectedTab === 'add' ? '#fff' : theme.textSecondary} 
            />
            <Text style={[
              styles.tabText,
              { color: selectedTab === 'add' ? '#fff' : theme.textSecondary }
            ]}>
              Add Item
            </Text>
          </TouchableOpacity>
        </View>

        {selectedTab === 'current' && renderCurrentInventory()}
        {selectedTab === 'alerts' && renderAlerts()}
        {selectedTab === 'add' && renderAddItemForm()}

        {/* Image Modal */}
        <Modal
          visible={showImageModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowImageModal(false)}
        >
          <View style={styles.imageModalOverlay}>
            <TouchableOpacity
              style={styles.imageModalClose}
              onPress={() => setShowImageModal(false)}
            >
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <Image
              source={{ uri: selectedImage || '' }}
              style={styles.imageModalImage}
              resizeMode="contain"
            />
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  summaryCards: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  inventoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 4,
  },
  inventoryList: {
    paddingBottom: 20,
  },
  inventoryCard: {
    marginBottom: 16,
  },
  itemContent: {
    flexDirection: 'row',
    padding: 16,
  },
  imageContainer: {
    position: 'relative',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  stockBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  stockBadgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
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
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  stockInfo: {
    marginBottom: 8,
  },
  stockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  stockLabel: {
    fontSize: 12,
  },
  stockValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  priceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 12,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  supplier: {
    fontSize: 12,
    fontWeight: '500',
  },
  date: {
    fontSize: 12,
  },
  alertsHeader: {
    marginBottom: 16,
  },
  alertCount: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  emptyAlert: {
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  alertCard: {
    marginBottom: 12,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  alertIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  alertDetails: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: 14,
    marginBottom: 4,
  },
  alertPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  restockButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  restockButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  addFormCard: {
    marginBottom: 20,
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  formContent: {
    padding: 8,
  },
  imageSection: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  imageUpload: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  uploadPlaceholder: {
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 14,
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  imageModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageModalClose: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    padding: 8,
  },
  imageModalImage: {
    width: width - 40,
    height: width - 40,
  },
});

export default InventoryScreen;
