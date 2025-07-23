/**
 * FeedEasy App
 * 
 * B2B marketplace connecting farmers and feed suppliers in Uganda.
 * Features:
 * - User authentication and role-based access
 * - Product catalog with search and filtering
 * - Shopping cart and checkout system
 * - Order tracking and management
 * - Payment processing (MTN, Airtel, Card)
 * - Real-time messaging between users
 * - Professional UI with dark/light themes
 * 
 * @author FeedEasy Team
 * @version 1.0.0
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import { CartProvider, useCart } from './src/context/CartContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import HeaderMenu from './src/components/HeaderMenu';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import ProductCatalogScreen from './src/screens/ProductCatalogScreen';
import OrderScreen from './src/screens/OrderScreen';
import QualityAssuranceScreen from './src/screens/QualityAssuranceScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import EducationScreen from './src/screens/EducationScreen';
import InventoryScreen from './src/screens/InventoryScreen';
import CartScreen from './src/screens/CartScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import AuthScreen from './src/screens/AuthScreen';
import SellerDashboardScreen from './src/screens/SellerDashboardScreen';
import ManageProductsScreen from './src/screens/ManageProductsScreen';
import FarmerDashboardScreen from './src/screens/FarmerDashboardScreen';
import SellerOrdersScreen from './src/screens/SellerOrdersScreen';
import SellerMessagesScreen from './src/screens/SellerMessagesScreen';
import SellerProductsScreen from './src/screens/SellerProductsScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import ChatScreen from './src/screens/ChatScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import OrderTrackingScreen from './src/screens/OrderTrackingScreen';
import OrderDetailsScreen from './src/screens/OrderDetailsScreen';

const Tab = createBottomTabNavigator();
export type RootStackParamList = {
  Auth: undefined;
  Drawer: undefined;
  ProductDetail: { productId: number };
  Chat: { sellerId: number; farmerId: number; chatName: string };
  Payment: { 
    totalAmount: number; 
    items: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
      image: string;
      category: string;
    }>;
  };
  OrderTracking: { 
    orderId: string; 
    orderNumber: string; 
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'; 
    deliveryAddress: string; 
    estimatedDelivery: string;
  };
  OrderDetails: { 
    order: {
      id: string;
      orderNumber: string;
      date: string;
      status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
      total: number;
      items: Array<{
        name: string;
        quantity: number;
        price: number;
      }>;
      deliveryAddress: string;
      estimatedDelivery?: string;
      paymentMethod?: string;
    };
  };
};

const Stack = createStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator();

// Cart Badge Component
const CartBadge = ({ children }: { children: React.ReactNode }) => {
  const { state } = useCart();
  
  return (
    <View>
      {children}
      {state.totalItems > 0 && (
        <View style={{
          position: 'absolute',
          right: -6,
          top: -3,
          backgroundColor: '#f44336',
          borderRadius: 8,
          width: 16,
          height: 16,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Text style={{
            color: 'white',
            fontSize: 10,
            fontWeight: 'bold'
          }}>
            {state.totalItems > 9 ? '9+' : state.totalItems}
          </Text>
        </View>
      )}
    </View>
  );
};

// Main Tab Navigator
const MainTabs = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        headerStyle: {
          backgroundColor: theme.primary,
          shadowColor: theme.border,
          elevation: 4,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#fff',
        },
        headerLeft: () => null,
        headerRight: () => <HeaderMenu />,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Products') {
            iconName = focused ? 'leaf' : 'leaf-outline';
          } else if (route.name === 'Orders') {
            iconName = focused ? 'receipt' : 'receipt-outline';
          } else if (route.name === 'Quality') {
            iconName = focused ? 'shield-checkmark' : 'shield-checkmark-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'ellipse-outline';
          }

          const icon = <Ionicons name={iconName} size={size} color={color} />;
          
          if (route.name === 'Cart') {
            return <CartBadge>{icon}</CartBadge>;
          }
          
          return icon;
        },
      })}>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          title: 'FeedEasy',
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="Products" 
        component={ProductCatalogScreen} 
        options={{
          title: 'Product Catalog',
          tabBarLabel: 'Products',
        }}
      />
      <Tab.Screen 
        name="Orders" 
        component={OrderScreen} 
        options={{
          title: 'My Orders',
          tabBarLabel: 'Orders',
        }}
      />
      <Tab.Screen 
        name="Quality" 
        component={QualityAssuranceScreen} 
        options={{
          title: 'Quality Assurance',
          tabBarLabel: 'Quality',
        }}
      />
      <Tab.Screen 
        name="Cart" 
        component={CartScreen} 
        options={{
          title: 'Shopping Cart',
          tabBarLabel: 'Cart',
        }}
      />
      {user?.userType === 'farmer' && (
        <Tab.Screen
          name="Dashboard"
          component={FarmerDashboardScreen}
          options={{
            title: 'My Dashboard',
            tabBarLabel: 'Dashboard',
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name={focused ? 'speedometer' : 'speedometer-outline'} size={size} color={color} />
            ),
          }}
        />
      )}
      {user?.userType === 'seller' && (
        <Tab.Screen
          name="Dashboard"
          component={SellerDashboardScreen}
          options={{
            title: 'Seller Dashboard',
            tabBarLabel: 'Dashboard',
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name={focused ? 'analytics' : 'analytics-outline'} size={size} color={color} />
            ),
          }}
        />
      )}
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

// Drawer Navigator
const DrawerNavigator = () => {
  const { theme } = useTheme();
  
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.primary,
          shadowColor: theme.border,
          elevation: 4,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#fff',
        },
        headerRight: () => <HeaderMenu />,
        drawerStyle: {
          backgroundColor: theme.background,
          width: 280,
        },
        drawerActiveTintColor: theme.primary,
        drawerInactiveTintColor: theme.textSecondary,
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '500',
        },
        drawerContentStyle: {
          backgroundColor: theme.background,
        },
      }}>
      <Drawer.Screen 
        name="MainTabs" 
        component={MainTabs}
        options={{
          title: 'FeedEasy',
          drawerLabel: 'Home',
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Drawer.Screen 
        name="Education" 
        component={EducationScreen}
        options={{
          title: 'Educational Resources',
          drawerLabel: 'Educational Resources',
          drawerIcon: ({ color }) => (
            <Ionicons name="book-outline" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Inventory" 
        component={InventoryScreen}
        options={{
          title: 'Inventory Management',
          drawerLabel: 'Inventory Management',
          drawerIcon: ({ color }) => (
            <Ionicons name="archive-outline" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={{
          title: 'Notifications',
          drawerLabel: 'Notifications',
          drawerIcon: ({ color }) => (
            <Ionicons name="notifications-outline" size={24} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          title: 'Settings',
          drawerLabel: 'Settings',
          drawerIcon: ({ color }) => (
            <Ionicons name="settings-outline" size={24} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Drawer.Screen 
        name="ManageProducts" 
        component={ManageProductsScreen}
        options={{
          title: 'Manage Products',
          drawerLabel: 'Manage Products',
          drawerIcon: ({ color }) => (
            <Ionicons name="cube-outline" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="SellerOrders"
        component={SellerOrdersScreen}
        options={{
          title: 'Manage Orders',
          drawerLabel: 'Manage Orders',
          drawerIcon: ({ color }) => (
            <Ionicons name="receipt-outline" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="SellerMessages"
        component={SellerMessagesScreen}
        options={{
          title: 'Messages',
          drawerLabel: 'Messages',
          drawerIcon: ({ color }) => (
            <Ionicons name="chatbubbles-outline" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="FarmerMessages"
        component={require('./src/screens/FarmerMessagesScreen').default}
        options={{
          title: 'Messages',
          drawerLabel: 'Messages',
          drawerIcon: ({ color }) => (
            <Ionicons name="chatbubbles-outline" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="SellerProducts"
        component={SellerProductsScreen}
        options={{
          title: 'My Products',
          drawerLabel: 'My Products',
          drawerIcon: ({ color }) => (
            <Ionicons name="grid-outline" size={24} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

// Main App Component
// App with theme-aware StatusBar
const AppContent = () => {
  const { isDarkMode } = useTheme();
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }
  
  return (
    <NavigationContainer>
      <StatusBar style={isDarkMode ? "light" : "light"} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Drawer" component={DrawerNavigator} />
            <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} options={{ headerShown: true }} />
            <Stack.Screen name="Payment" component={PaymentScreen} />
            <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
            <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
