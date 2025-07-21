import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

const App = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2e7d32" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>FeedEasy</Text>
        <Text style={styles.headerSubtitle}>Empowering Farmers with Quality Feed Solutions</Text>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Welcome to FeedEasy</Text>
          <Text style={styles.sectionText}>
            Your one-stop solution for high-quality animal feed products.
          </Text>
        </View>

        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionTitle}>Browse Products</Text>
            <Text style={styles.actionDescription}>Explore our feed catalog</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionTitle}>My Orders</Text>
            <Text style={styles.actionDescription}>Track your orders</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionTitle}>Quality Check</Text>
            <Text style={styles.actionDescription}>View certifications</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionTitle}>Learn</Text>
            <Text style={styles.actionDescription}>Educational resources</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featureList}>
            <Text style={styles.featureItem}>• High-quality feed products</Text>
            <Text style={styles.featureItem}>• Quality assurance certificates</Text>
            <Text style={styles.featureItem}>• Educational resources</Text>
            <Text style={styles.featureItem}>• Inventory management</Text>
            <Text style={styles.featureItem}>• Offline functionality</Text>
            <Text style={styles.featureItem}>• Local language support</Text>
          </View>
        </View>
      </ScrollView>
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
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#c8e6c9',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    width: '48%',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 5,
  },
  actionDescription: {
    fontSize: 14,
    color: '#757575',
  },
  featureList: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  featureItem: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    lineHeight: 22,
  },
});

export default App;
