import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import ProductCatalogScreen from './src/screens/ProductCatalogScreen';
import OrderScreen from './src/screens/OrderScreen';
import QualityAssuranceScreen from './src/screens/QualityAssuranceScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import EducationScreen from './src/screens/EducationScreen';
import InventoryScreen from './src/screens/InventoryScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

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
        headerLeft: ({ navigation }: any) => (
          <Ionicons 
            name="menu" 
            size={24} 
            color="#fff" 
            style={{ marginLeft: 15 }}
            onPress={() => navigation?.openDrawer?.()} 
          />
        ),
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
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'ellipse-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
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
        headerShown: false,
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
          drawerLabel: 'Home',
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Education" 
        component={EducationScreen}
        options={{
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
          drawerLabel: 'Inventory Management',
          drawerIcon: ({ color }) => (
            <Ionicons name="archive-outline" size={24} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

// Main App Component
export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="#2e7d32" />
      <DrawerNavigator />
    </NavigationContainer>
  );
}
