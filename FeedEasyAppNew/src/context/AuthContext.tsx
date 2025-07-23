import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DatabaseService, { User } from '../services/DatabaseService';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<boolean>;
}

interface RegisterData {
  username: string;
  email: string;
  phone: string;
  userType: 'farmer' | 'seller';
  firstName: string;
  lastName: string;
  location: string;
  password: string;
  profileImage?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = '@FeedEasy:user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Simple password hashing (in production, use a proper library)
  const hashPassword = (password: string): string => {
    // This is a simple implementation. In production, use bcrypt or similar
    return `hashed_${password}_${Date.now()}`;
  };

  const verifyPassword = (password: string, hash: string): boolean => {
    // Simple verification for demo purposes
    // In production, use proper password verification
    return hash.includes(password);
  };

  // Load user from storage on app start
  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedUser) {
        const user = JSON.parse(storedUser);
        // Verify user still exists in database
        const dbUser = await DatabaseService.getUserById(user.id);
        if (dbUser) {
          setState({
            user: dbUser,
            isLoading: false,
            isAuthenticated: true,
          });
        } else {
          // User no longer exists, clear storage
          await AsyncStorage.removeItem(STORAGE_KEY);
          setState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      } else {
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const userWithPassword = await DatabaseService.getUserWithPassword(email);
      
      if (!userWithPassword) {
        return { success: false, error: 'User not found' };
      }

      if (!verifyPassword(password, userWithPassword.passwordHash)) {
        return { success: false, error: 'Invalid password' };
      }

      // Remove password hash before storing user
      const { passwordHash, ...user } = userWithPassword;
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      
      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
      });

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  }, []);

  const register = useCallback(async (userData: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      // Check if user already exists
      const existingUser = await DatabaseService.getUserByEmail(userData.email);
      if (existingUser) {
        return { success: false, error: 'User already exists with this email' };
      }

      // Hash password
      const passwordHash = hashPassword(userData.password);

      // Create user in database
      const userId = await DatabaseService.createUser({
        ...userData,
        passwordHash,
      });

      // Get the created user
      const newUser = await DatabaseService.getUserById(userId);
      if (!newUser) {
        return { success: false, error: 'Failed to create user' };
      }

      // Store user data
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      
      setState({
        user: newUser,
        isLoading: false,
        isAuthenticated: true,
      });

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  const updateUser = useCallback(async (updates: Partial<User>): Promise<boolean> => {
    if (!state.user) return false;

    try {
      const updatedUser = { ...state.user, ...updates };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
      
      setState(prev => ({
        ...prev,
        user: updatedUser,
      }));

      return true;
    } catch (error) {
      console.error('Update user error:', error);
      return false;
    }
  }, [state.user]);

  const value = useMemo(() => ({
    ...state,
    login,
    register,
    logout,
    updateUser,
  }), [state, login, register, logout, updateUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
