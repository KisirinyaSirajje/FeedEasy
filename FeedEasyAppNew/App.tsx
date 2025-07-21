import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import { CartProvider, useCart } from './src/context/CartContext';

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

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
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
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#2e7d32',
        tabBarInactiveTintColor: '#757575',
        headerStyle: {
          backgroundColor: '#2e7d32',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerLeft: () => null,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e0e0e0',
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
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#2e7d32',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        drawerStyle: {
          backgroundColor: '#f5f5f5',
          width: 280,
        },
        drawerActiveTintColor: '#2e7d32',
        drawerInactiveTintColor: '#757575',
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '500',
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
    </Drawer.Navigator>
  );
};

// Main App Component
export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <DrawerNavigator />
      </NavigationContainer>
    </CartProvider>
  );
}
