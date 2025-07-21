import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

interface Certificate {
  id: string;
  name: string;
  issuer: string;
  validUntil: string;
  status: 'valid' | 'expiring' | 'expired';
}

interface QualityMetric {
  label: string;
  value: string;
  status: 'excellent' | 'good' | 'fair' | 'poor';
}

const QualityAssuranceScreen = () => {
  const [selectedTab, setSelectedTab] = useState<'certificates' | 'testing' | 'reviews'>('certificates');

  const certificates: Certificate[] = [
    {
      id: '1',
      name: 'KEBS Quality Certification',
      issuer: 'Kenya Bureau of Standards',
      validUntil: '2024-12-31',
      status: 'valid',
    },
    {
      id: '2',
      name: 'ISO 9001:2015',
      issuer: 'International Organization for Standardization',
      validUntil: '2024-06-30',
      status: 'expiring',
    },
    {
      id: '3',
      name: 'HACCP Certification',
      issuer: 'Food Safety Authority',
      validUntil: '2025-03-15',
      status: 'valid',
    },
  ];

  const qualityMetrics: QualityMetric[] = [
    { label: 'Protein Content', value: '18.5%', status: 'excellent' },
    { label: 'Moisture Level', value: '12.2%', status: 'good' },
    { label: 'Crude Fat', value: '4.8%', status: 'excellent' },
    { label: 'Fiber Content', value: '6.5%', status: 'good' },
    { label: 'Ash Content', value: '8.1%', status: 'fair' },
  ];

  const reviews = [
    {
      id: '1',
      farmer: 'Mary Wanjiku',
      location: 'Kiambu',
      rating: 4.5,
      comment: 'Excellent feed quality. My chickens are healthier and laying more eggs.',
      date: '2024-01-10',
    },
    {
      id: '2',
      farmer: 'Peter Mwangi',
      location: 'Nakuru',
      rating: 5.0,
      comment: 'Outstanding quality and fast delivery. Highly recommended!',
      date: '2024-01-08',
    },
    {
      id: '3',
      farmer: 'Grace Akinyi',
      location: 'Kisumu',
      rating: 4.0,
      comment: 'Good quality feed at reasonable prices. Will order again.',
      date: '2024-01-05',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return '#4caf50';
      case 'expiring': return '#ff9800';
      case 'expired': return '#f44336';
      case 'excellent': return '#4caf50';
      case 'good': return '#8bc34a';
      case 'fair': return '#ff9800';
      case 'poor': return '#f44336';
      default: return '#757575';
    }
  };

  const renderCertificates = () => (
    <View style={styles.tabContent}>
      {certificates.map((cert) => (
        <View key={cert.id} style={styles.certificateCard}>
          <View style={styles.certificateHeader}>
            <Text style={styles.certificateName}>{cert.name}</Text>
            <View style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(cert.status) }
            ]}>
              <Text style={styles.statusText}>
                {cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
              </Text>
            </View>
          </View>
          <Text style={styles.certificateIssuer}>Issued by: {cert.issuer}</Text>
          <Text style={styles.certificateValidity}>Valid until: {cert.validUntil}</Text>
        </View>
      ))}
    </View>
  );

  const renderTesting = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Latest Quality Test Results</Text>
      <Text style={styles.testDate}>Test Date: January 12, 2024</Text>
      
      {qualityMetrics.map((metric, index) => (
        <View key={index} style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricLabel}>{metric.label}</Text>
            <Text style={styles.metricValue}>{metric.value}</Text>
          </View>
          <View style={styles.metricStatusContainer}>
            <View style={[
              styles.metricStatusBar,
              { backgroundColor: getStatusColor(metric.status) }
            ]}>
              <Text style={styles.metricStatusText}>
                {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
              </Text>
            </View>
          </View>
        </View>
      ))}
      
      <View style={styles.overallRating}>
        <Text style={styles.overallTitle}>Overall Quality Rating</Text>
        <Text style={styles.overallScore}>4.3/5.0</Text>
        <Text style={styles.overallStatus}>Excellent Quality</Text>
      </View>
    </View>
  );

  const renderReviews = () => (
    <View style={styles.tabContent}>
      <View style={styles.reviewsHeader}>
        <Text style={styles.reviewsTitle}>Customer Reviews</Text>
        <Text style={styles.reviewsAverage}>4.5 ★ (24 reviews)</Text>
      </View>
      
      {reviews.map((review) => (
        <View key={review.id} style={styles.reviewCard}>
          <View style={styles.reviewHeader}>
            <View>
              <Text style={styles.reviewerName}>{review.farmer}</Text>
              <Text style={styles.reviewerLocation}>{review.location}</Text>
            </View>
            <View style={styles.reviewRating}>
              <Text style={styles.ratingText}>{review.rating} ★</Text>
            </View>
          </View>
          <Text style={styles.reviewComment}>{review.comment}</Text>
          <Text style={styles.reviewDate}>{review.date}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'certificates' && styles.activeTab]}
          onPress={() => setSelectedTab('certificates')}
        >
          <Text style={[
            styles.tabText,
            selectedTab === 'certificates' && styles.activeTabText
          ]}>
            Certificates
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'testing' && styles.activeTab]}
          onPress={() => setSelectedTab('testing')}
        >
          <Text style={[
            styles.tabText,
            selectedTab === 'testing' && styles.activeTabText
          ]}>
            Testing
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'reviews' && styles.activeTab]}
          onPress={() => setSelectedTab('reviews')}
        >
          <Text style={[
            styles.tabText,
            selectedTab === 'reviews' && styles.activeTabText
          ]}>
            Reviews
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {selectedTab === 'certificates' && renderCertificates()}
        {selectedTab === 'testing' && renderTesting()}
        {selectedTab === 'reviews' && renderReviews()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    fontSize: 16,
    color: '#757575',
  },
  activeTabText: {
    color: '#2e7d32',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  tabContent: {
    padding: 15,
  },
  certificateCard: {
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
  certificateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  certificateName: {
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
  certificateIssuer: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  certificateValidity: {
    fontSize: 14,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  testDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  metricCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 16,
    color: '#333',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  metricStatusContainer: {
    alignItems: 'flex-end',
  },
  metricStatusBar: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  metricStatusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  overallRating: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  overallTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  overallScore: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 5,
  },
  overallStatus: {
    fontSize: 16,
    color: '#4caf50',
    fontWeight: '500',
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  reviewsAverage: {
    fontSize: 16,
    color: '#ff9800',
    fontWeight: 'bold',
  },
  reviewCard: {
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
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  reviewerLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  reviewRating: {
    backgroundColor: '#ff9800',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  reviewComment: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 10,
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
  },
});

export default QualityAssuranceScreen;
