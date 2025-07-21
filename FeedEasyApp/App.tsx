import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import ProductCatalogScreen from './src/screens/ProductCatalogScreen';
import OrderScreen from './src/screens/OrderScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import QualityAssuranceScreen from './src/screens/QualityAssuranceScreen';

// Create navigation instances
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Placeholder screens (to be created)
const LoginScreen = () => {
  return null; // Will be implemented
};

const RegisterScreen = () => {
  return null; // Will be implemented
};

const EducationScreen = () => {
  return null; // Will be implemented
};

const InventoryScreen = () => {
  return null; // Will be implemented
};

// Main Tab Navigator for authenticated users
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#2e7d32',
        tabBarInactiveTintColor: '#757575',
        headerStyle: {
          backgroundColor: '#2e7d32',
        },
        headerTintColor: '#fff',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e0e0e0',
        },
      }}>
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

// Main App Component
const App = () => {
  // For now, we'll assume user is authenticated
  // TODO: Implement authentication logic
  const isAuthenticated = true;

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#2e7d32" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isAuthenticated ? (
            // User is authenticated - show main app
            <Stack.Screen name="MainApp" component={MainTabNavigator} />
          ) : (
            // User is not authenticated - show auth screens
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          )}
          
          {/* Additional screens that can be navigated to from tabs */}
          <Stack.Screen 
            name="Education" 
            component={EducationScreen}
            options={{
              headerShown: true,
              title: 'Educational Resources',
              headerStyle: { backgroundColor: '#2e7d32' },
              headerTintColor: '#fff',
            }}
          />
          <Stack.Screen 
            name="Inventory" 
            component={InventoryScreen}
            options={{
              headerShown: true,
              title: 'Inventory Management',
              headerStyle: { backgroundColor: '#2e7d32' },
              headerTintColor: '#fff',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
