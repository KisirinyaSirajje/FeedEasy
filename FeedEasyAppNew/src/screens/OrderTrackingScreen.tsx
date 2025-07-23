/**
 * OrderTrackingScreen
 * 
 * Provides real-time order tracking with delivery progress visualization.
 * Features:
 * - Visual progress timeline with order stages
 * - Live delivery tracking with map integration
 * - Estimated delivery time display
 * - Delivery location and address information
 * - Status-based UI updates and animations
 * 
 * @author FeedEasy Team
 * @version 1.0.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import DatabaseService from '../services/DatabaseService';
import GradientBackground from '../components/GradientBackground';
import AnimatedCard from '../components/AnimatedCard';
import Loader from '../components/Loader';

const { width, height } = Dimensions.get('window');

interface OrderTrackingProps {
  route: {
    params: {
      orderId: string;
      orderNumber: string;
      status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
      deliveryAddress: string;
      estimatedDelivery: string;
    };
  };
}

interface TrackingStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
  current: boolean;
  time?: string;
}

const OrderTrackingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<OrderTrackingProps['route']>();
  const { theme } = useTheme();
  
  const [isLoading, setIsLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 0.3476, // Kampala coordinates
    longitude: 32.5825,
  });
  const [deliveryLocation, setDeliveryLocation] = useState({
    latitude: 0.3476,
    longitude: 32.5825,
  });
  const [estimatedTime, setEstimatedTime] = useState('2 hours');
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const mapAnim = useRef(new Animated.Value(0)).current;

  const { orderId, orderNumber, status, deliveryAddress, estimatedDelivery } = route.params;

  useEffect(() => {
    loadTrackingData();
    startAnimations();
  }, []);

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(mapAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const loadTrackingData = async () => {
    try {
      // Load order details from database
      const orderIdNum = parseInt(orderId);
      const orderWithItems = await DatabaseService.getOrderWithItems(orderIdNum);
      
      if (orderWithItems) {
        // Update delivery location based on address
        // In a real app, you would geocode the address
        setDeliveryLocation({
          latitude: 0.3476 + (Math.random() - 0.5) * 0.01,
          longitude: 32.5825 + (Math.random() - 0.5) * 0.01,
        });
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading tracking data:', error);
      Alert.alert('Error', 'Failed to load tracking information.');
    }
  };

  const getTrackingSteps = (): TrackingStep[] => {
    const steps: TrackingStep[] = [
      {
        id: 'ordered',
        title: 'Order Placed',
        description: 'Your order has been confirmed',
        icon: 'checkmark-circle',
        completed: true,
        current: false,
        time: '2 hours ago',
      },
      {
        id: 'processing',
        title: 'Processing',
        description: 'Your order is being prepared',
        icon: 'cog',
        completed: true,
        current: false,
        time: '1 hour ago',
      },
      {
        id: 'shipped',
        title: 'Shipped',
        description: 'Your order is on the way',
        icon: 'car',
        completed: status === 'shipped' || status === 'delivered',
        current: status === 'shipped',
        time: status === 'shipped' ? '30 minutes ago' : undefined,
      },
      {
        id: 'delivered',
        title: 'Delivered',
        description: 'Your order has been delivered',
        icon: 'home',
        completed: status === 'delivered',
        current: status === 'delivered',
        time: status === 'delivered' ? 'Just now' : undefined,
      },
    ];

    return steps;
  };

  const renderTrackingStep = (step: TrackingStep, index: number) => (
    <AnimatedCard
      key={step.id}
      delay={index * 200}
      shadow="light"
      style={styles.stepCard}
    >
      <View style={styles.stepContent}>
        <View style={styles.stepLeft}>
          <View style={[
            styles.stepIcon,
            {
              backgroundColor: step.completed ? theme.success + '20' : theme.background,
              borderColor: step.completed ? theme.success : theme.border,
            }
          ]}>
            <Ionicons 
              name={step.icon as any} 
              size={20} 
              color={step.completed ? theme.success : theme.textSecondary} 
            />
          </View>
          
          {index < getTrackingSteps().length - 1 && (
            <View style={[
              styles.stepLine,
              { backgroundColor: step.completed ? theme.success : theme.border }
            ]} />
          )}
        </View>
        
        <View style={styles.stepInfo}>
          <View style={styles.stepHeader}>
            <Text style={[
              styles.stepTitle,
              { color: step.completed ? theme.text : theme.textSecondary }
            ]}>
              {step.title}
            </Text>
            {step.current && (
              <View style={[styles.currentBadge, { backgroundColor: theme.primary + '20' }]}>
                <Text style={[styles.currentText, { color: theme.primary }]}>
                  Current
                </Text>
              </View>
            )}
          </View>
          <Text style={[styles.stepDescription, { color: theme.textSecondary }]}>
            {step.description}
          </Text>
          {step.time && (
            <Text style={[styles.stepTime, { color: theme.textSecondary }]}>
              {step.time}
            </Text>
          )}
        </View>
      </View>
    </AnimatedCard>
  );

  const renderMap = () => (
    <AnimatedCard
      shadow="medium"
      style={styles.mapCard}
    >
      <Animated.View
        style={[
          styles.mapContainer,
          {
            opacity: mapAnim,
            transform: [{ scale: mapAnim }],
          },
        ]}
      >
        <View style={styles.mapHeader}>
          <Text style={[styles.mapTitle, { color: theme.text }]}>
            Delivery Location
          </Text>
          <Text style={[styles.mapSubtitle, { color: theme.textSecondary }]}>
            Estimated arrival: {estimatedTime}
          </Text>
        </View>
        
        <View style={[styles.mapContent, { backgroundColor: theme.background }]}>
          {/* Mock Map - In a real app, you would use react-native-maps */}
          <View style={styles.mockMap}>
            <View style={styles.mapPin}>
              <Ionicons name="location" size={24} color={theme.primary} />
            </View>
            <View style={styles.deliveryPin}>
              <Ionicons name="home" size={24} color={theme.secondary} />
            </View>
            <View style={styles.deliveryRoute} />
          </View>
          
          <View style={styles.locationInfo}>
            <Text style={[styles.locationTitle, { color: theme.text }]}>
              Delivery Address
            </Text>
            <Text style={[styles.locationAddress, { color: theme.textSecondary }]}>
              {deliveryAddress}
            </Text>
          </View>
        </View>
      </Animated.View>
    </AnimatedCard>
  );

  const renderOrderInfo = () => (
    <AnimatedCard shadow="light" style={styles.orderInfoCard}>
      <View style={styles.orderInfoHeader}>
        <Text style={[styles.orderInfoTitle, { color: theme.text }]}>
          Order Information
        </Text>
        <Text style={[styles.orderNumber, { color: theme.primary }]}>
          #{orderNumber}
        </Text>
      </View>
      
      <View style={styles.orderDetails}>
        <View style={styles.orderDetail}>
          <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
            Status:
          </Text>
          <Text style={[styles.detailValue, { color: getStatusColor(status) }]}>
            {status.toUpperCase()}
          </Text>
        </View>
        
        <View style={styles.orderDetail}>
          <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
            Estimated Delivery:
          </Text>
          <Text style={[styles.detailValue, { color: theme.text }]}>
            {new Date(estimatedDelivery).toLocaleDateString()}
          </Text>
        </View>
        
        <View style={styles.orderDetail}>
          <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
            Delivery Address:
          </Text>
          <Text style={[styles.detailValue, { color: theme.text }]}>
            {deliveryAddress}
          </Text>
        </View>
      </View>
    </AnimatedCard>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return theme.warning;
      case 'confirmed': return theme.primary;
      case 'shipped': return theme.secondary;
      case 'delivered': return theme.success;
      case 'cancelled': return theme.error;
      default: return theme.textSecondary;
    }
  };

  if (isLoading) {
    return <Loader text="Loading tracking information..." type="wave" />;
  }

  return (
    <GradientBackground type="background">
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <GradientBackground type="primary" style={styles.headerGradient}>
            <View style={styles.headerContent}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Track Order</Text>
              <View style={styles.placeholder} />
            </View>
          </GradientBackground>
        </Animated.View>

        <Animated.ScrollView
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {renderOrderInfo()}
          
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Delivery Progress
            </Text>
          </View>
          
          <View style={styles.trackingSteps}>
            {getTrackingSteps().map((step, index) => renderTrackingStep(step, index))}
          </View>

          {status === 'shipped' && (
            <>
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  Live Tracking
                </Text>
              </View>
              {renderMap()}
            </>
          )}
        </Animated.ScrollView>
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 20,
  },
  headerGradient: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  orderInfoCard: {
    marginBottom: 24,
  },
  orderInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  orderInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderDetails: {
    gap: 12,
  },
  orderDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: 14,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    flex: 2,
    textAlign: 'right',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  trackingSteps: {
    marginBottom: 24,
  },
  stepCard: {
    marginBottom: 16,
  },
  stepContent: {
    flexDirection: 'row',
    padding: 16,
  },
  stepLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  stepLine: {
    width: 2,
    height: 40,
    marginTop: 8,
  },
  stepInfo: {
    flex: 1,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  currentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  currentText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  stepTime: {
    fontSize: 12,
  },
  mapCard: {
    marginBottom: 24,
  },
  mapContainer: {
    padding: 16,
  },
  mapHeader: {
    marginBottom: 16,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  mapSubtitle: {
    fontSize: 14,
  },
  mapContent: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  mockMap: {
    height: 200,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mapPin: {
    position: 'absolute',
    top: 50,
    left: 50,
  },
  deliveryPin: {
    position: 'absolute',
    bottom: 50,
    right: 50,
  },
  deliveryRoute: {
    position: 'absolute',
    width: 2,
    height: 100,
    backgroundColor: '#4CAF50',
    transform: [{ rotate: '45deg' }],
  },
  locationInfo: {
    padding: 16,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  locationAddress: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default OrderTrackingScreen; 