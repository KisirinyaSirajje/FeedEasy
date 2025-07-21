import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';

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
}

const InventoryScreen = () => {
  const [selectedTab, setSelectedTab] = useState<'current' | 'alerts' | 'add'>('current');

  const inventoryItems: InventoryItem[] = [
    {
      id: '1',
      name: 'Premium Poultry Layer Feed',
      category: 'Poultry',
      currentStock: 15,
      unit: '70kg bags',
      minLevel: 5,
      lastPurchase: '2024-01-10',
      cost: 2500,
      supplier: 'FeedEasy',
    },
    {
      id: '2',
      name: 'Dairy Cattle Feed Pellets',
      category: 'Cattle',
      currentStock: 3,
      unit: '70kg bags',
      minLevel: 8,
      lastPurchase: '2024-01-05',
      cost: 3200,
      supplier: 'FeedEasy',
    },
    {
      id: '3',
      name: 'Broiler Starter Feed',
      category: 'Poultry',
      currentStock: 12,
      unit: '50kg bags',
      minLevel: 6,
      lastPurchase: '2024-01-12',
      cost: 2700,
      supplier: 'FeedEasy',
    },
    {
      id: '4',
      name: 'Pig Grower Feed',
      category: 'Swine',
      currentStock: 2,
      unit: '70kg bags',
      minLevel: 4,
      lastPurchase: '2024-01-08',
      cost: 2800,
      supplier: 'FeedEasy',
    },
  ];

  const lowStockItems = inventoryItems.filter(item => item.currentStock <= item.minLevel);

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock <= item.minLevel) return 'low';
    if (item.currentStock <= item.minLevel * 1.5) return 'medium';
    return 'good';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'low': return '#f44336';
      case 'medium': return '#ff9800';
      case 'good': return '#4caf50';
      default: return '#757575';
    }
  };

  const renderCurrentInventory = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.summaryCards}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{inventoryItems.length}</Text>
          <Text style={styles.summaryLabel}>Total Items</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={[styles.summaryValue, { color: '#f44336' }]}>{lowStockItems.length}</Text>
          <Text style={styles.summaryLabel}>Low Stock</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>
            KSh {inventoryItems.reduce((total, item) => total + (item.currentStock * item.cost), 0).toLocaleString()}
          </Text>
          <Text style={styles.summaryLabel}>Total Value</Text>
        </View>
      </View>

      {inventoryItems.map((item) => {
        const status = getStockStatus(item);
        return (
          <View key={item.id} style={styles.inventoryCard}>
            <View style={styles.inventoryHeader}>
              <Text style={styles.itemName}>{item.name}</Text>
              <View style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(status) }
              ]}>
                <Text style={styles.statusText}>
                  {status === 'low' ? 'Low Stock' : status === 'medium' ? 'Medium' : 'Good'}
                </Text>
              </View>
            </View>
            
            <Text style={styles.itemCategory}>Category: {item.category}</Text>
            
            <View style={styles.stockInfo}>
              <View style={styles.stockRow}>
                <Text style={styles.stockLabel}>Current Stock:</Text>
                <Text style={styles.stockValue}>{item.currentStock} {item.unit}</Text>
              </View>
              <View style={styles.stockRow}>
                <Text style={styles.stockLabel}>Minimum Level:</Text>
                <Text style={styles.stockValue}>{item.minLevel} {item.unit}</Text>
              </View>
              <View style={styles.stockRow}>
                <Text style={styles.stockLabel}>Last Purchase:</Text>
                <Text style={styles.stockValue}>{item.lastPurchase}</Text>
              </View>
              <View style={styles.stockRow}>
                <Text style={styles.stockLabel}>Unit Cost:</Text>
                <Text style={styles.stockValue}>KSh {item.cost.toLocaleString()}</Text>
              </View>
            </View>

            <View style={styles.inventoryActions}>
              <TouchableOpacity style={styles.updateButton}>
                <Text style={styles.updateButtonText}>Update Stock</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.reorderButton}>
                <Text style={styles.reorderButtonText}>Reorder</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );

  const renderAlerts = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.alertsTitle}>Low Stock Alerts</Text>
      <Text style={styles.alertsSubtitle}>
        Items that need immediate attention
      </Text>

      {lowStockItems.length === 0 ? (
        <View style={styles.noAlertsContainer}>
          <Text style={styles.noAlertsText}>🎉 All items are well stocked!</Text>
          <Text style={styles.noAlertsSubtext}>No immediate restocking needed</Text>
        </View>
      ) : (
        lowStockItems.map((item) => (
          <View key={item.id} style={styles.alertCard}>
            <View style={styles.alertHeader}>
              <Text style={styles.alertItemName}>{item.name}</Text>
              <Text style={styles.alertUrgency}>URGENT</Text>
            </View>
            <Text style={styles.alertMessage}>
              Only {item.currentStock} {item.unit} remaining (Min: {item.minLevel})
            </Text>
            <View style={styles.alertActions}>
              <TouchableOpacity style={styles.quickOrderButton}>
                <Text style={styles.quickOrderText}>Quick Order</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.viewProductButton}>
                <Text style={styles.viewProductText}>View Product</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}

      <View style={styles.alertSettings}>
        <Text style={styles.settingsTitle}>Alert Settings</Text>
        <TouchableOpacity style={styles.settingsItem}>
          <Text style={styles.settingsItemText}>Notification Preferences</Text>
          <Text style={styles.settingsItemArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsItem}>
          <Text style={styles.settingsItemText}>Minimum Stock Levels</Text>
          <Text style={styles.settingsItemArrow}>›</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderAddItem = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.formTitle}>Add New Inventory Item</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Product Name</Text>
        <TextInput style={styles.formInput} placeholder="Enter product name" />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Category</Text>
        <TouchableOpacity style={styles.formInput}>
          <Text style={styles.formInputText}>Select category</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Current Stock</Text>
        <TextInput 
          style={styles.formInput} 
          placeholder="Enter quantity" 
          keyboardType="numeric"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Unit</Text>
        <TextInput style={styles.formInput} placeholder="e.g., 70kg bags" />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Minimum Level</Text>
        <TextInput 
          style={styles.formInput} 
          placeholder="Enter minimum stock level" 
          keyboardType="numeric"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Unit Cost (KSh)</Text>
        <TextInput 
          style={styles.formInput} 
          placeholder="Enter cost per unit" 
          keyboardType="numeric"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Supplier</Text>
        <TextInput style={styles.formInput} placeholder="Enter supplier name" />
      </View>

      <TouchableOpacity style={styles.addItemButton}>
        <Text style={styles.addItemButtonText}>Add to Inventory</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inventory Management</Text>
        <Text style={styles.headerSubtitle}>Track your feed stock levels</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'current' && styles.activeTab]}
          onPress={() => setSelectedTab('current')}
        >
          <Text style={[
            styles.tabText,
            selectedTab === 'current' && styles.activeTabText
          ]}>
            Current Stock
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'alerts' && styles.activeTab]}
          onPress={() => setSelectedTab('alerts')}
        >
          <Text style={[
            styles.tabText,
            selectedTab === 'alerts' && styles.activeTabText
          ]}>
            Alerts ({lowStockItems.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === 'add' && styles.activeTab]}
          onPress={() => setSelectedTab('add')}
        >
          <Text style={[
            styles.tabText,
            selectedTab === 'add' && styles.activeTabText
          ]}>
            Add Item
          </Text>
        </TouchableOpacity>
      </View>

      {selectedTab === 'current' && renderCurrentInventory()}
      {selectedTab === 'alerts' && renderAlerts()}
      {selectedTab === 'add' && renderAddItem()}
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#c8e6c9',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#2e7d32',
  },
  tabText: {
    fontSize: 14,
    color: '#757575',
  },
  activeTabText: {
    color: '#2e7d32',
    fontWeight: 'bold',
  },
  tabContent: {
    flex: 1,
    padding: 15,
  },
  summaryCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    flex: 0.32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  inventoryCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  inventoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  itemCategory: {
    fontSize: 14,
    color: '#2e7d32',
    marginBottom: 12,
    fontWeight: '500',
  },
  stockInfo: {
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  stockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  stockLabel: {
    fontSize: 14,
    color: '#666',
  },
  stockValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  inventoryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  updateButton: {
    backgroundColor: '#2196f3',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 0.48,
  },
  updateButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  reorderButton: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 0.48,
  },
  reorderButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  alertsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  alertsSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  noAlertsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noAlertsText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 5,
  },
  noAlertsSubtext: {
    fontSize: 14,
    color: '#666',
  },
  alertCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  alertUrgency: {
    fontSize: 12,
    color: '#f44336',
    fontWeight: 'bold',
  },
  alertMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  alertActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickOrderButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 0.48,
  },
  quickOrderText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  viewProductButton: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 0.48,
  },
  viewProductText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  alertSettings: {
    marginTop: 20,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  settingsItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingsItemText: {
    fontSize: 16,
    color: '#333',
  },
  settingsItemArrow: {
    fontSize: 20,
    color: '#ccc',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  formInputText: {
    fontSize: 16,
    color: '#999',
  },
  addItemButton: {
    backgroundColor: '#2e7d32',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  addItemButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default InventoryScreen;
