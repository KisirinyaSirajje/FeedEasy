import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import GradientBackground from '../components/GradientBackground';
import AnimatedCard from '../components/AnimatedCard';
import Loader from '../components/Loader';

const { width, height } = Dimensions.get('window');

const AuthScreen = () => {
  const { theme } = useTheme();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    phone: '',
    userType: 'farmer' as 'farmer' | 'seller',
    firstName: '',
    lastName: '',
    location: '',
  });

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): string | null => {
    if (!formData.email || !formData.password) {
      return 'Email and password are required';
    }

    if (!isLogin) {
      if (!formData.username || !formData.firstName || !formData.lastName || !formData.phone || !formData.location) {
        return 'All fields are required for registration';
      }
      if (formData.password.length < 6) {
        return 'Password must be at least 6 characters';
      }
      if (formData.password !== formData.confirmPassword) {
        return 'Passwords do not match';
      }
    }

    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      Alert.alert('Validation Error', validationError);
      return;
    }

    setIsLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        result = await register(formData);
      }

      if (!result.success) {
        Alert.alert('Error', result.error || 'Operation failed');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      username: '',
      phone: '',
      userType: 'farmer',
      firstName: '',
      lastName: '',
      location: '',
    });
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const renderInput = (
    icon: string,
    placeholder: string,
    field: string,
    value: string,
    secureTextEntry = false,
    keyboardType: 'default' | 'email-address' | 'phone-pad' = 'default'
  ) => (
    <View style={[styles.inputContainer, { backgroundColor: theme.surface }]}>
      <Ionicons name={icon as any} size={20} color={theme.textSecondary} style={styles.inputIcon} />
      <TextInput
        style={[styles.input, { color: theme.text }]}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        value={value}
        onChangeText={(text) => handleInputChange(field, text)}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={field === 'email' ? 'none' : 'words'}
      />
    </View>
  );

  const renderPasswordInput = (
    placeholder: string,
    field: string,
    value: string,
    showPassword: boolean,
    setShowPassword: (show: boolean) => void
  ) => (
    <View style={[styles.inputContainer, { backgroundColor: theme.surface }]}>
      <Ionicons name="lock-closed" size={20} color={theme.textSecondary} style={styles.inputIcon} />
      <TextInput
        style={[styles.input, { color: theme.text }]}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        value={value}
        onChangeText={(text) => handleInputChange(field, text)}
        secureTextEntry={!showPassword}
      />
      <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
        <Ionicons 
          name={showPassword ? 'eye' : 'eye-off'} 
          size={20} 
          color={theme.textSecondary} 
        />
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return <Loader text="Please wait..." type="pulse" />;
  }

  return (
    <GradientBackground type="primary">
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { scale: logoScale }],
              },
            ]}
          >
            <View style={[styles.logoContainer, { backgroundColor: theme.secondary }]}>
              <Ionicons name="leaf" size={48} color="#fff" />
            </View>
            <Text style={styles.appTitle}>FeedEasy</Text>
            <Text style={styles.appSubtitle}>
              Empowering Farmers with Quality Feed Solutions
            </Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <AnimatedCard shadow="heavy" style={styles.formCard}>
              <View style={styles.formHeader}>
                <Text style={[styles.formTitle, { color: theme.text }]}>
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </Text>
                <Text style={[styles.formSubtitle, { color: theme.textSecondary }]}>
                  {isLogin ? 'Sign in to your account' : 'Join our farming community'}
                </Text>
              </View>

              <View style={styles.formContent}>
                {!isLogin && (
                  <>
                    {renderInput('person', 'Username', 'username', formData.username)}
                    {renderInput('person', 'First Name', 'firstName', formData.firstName)}
                    {renderInput('person', 'Last Name', 'lastName', formData.lastName)}
                    {renderInput('call', 'Phone Number', 'phone', formData.phone, false, 'phone-pad')}
                    {renderInput('location', 'Location', 'location', formData.location)}
                    
                    <View style={styles.userTypeContainer}>
                      <Text style={[styles.userTypeLabel, { color: theme.text }]}>I am a:</Text>
                      <View style={styles.userTypeButtons}>
                        <TouchableOpacity
                          style={[
                            styles.userTypeButton,
                            { backgroundColor: formData.userType === 'farmer' ? theme.primary : theme.background },
                          ]}
                          onPress={() => handleInputChange('userType', 'farmer')}
                        >
                          <Ionicons 
                            name="leaf" 
                            size={16} 
                            color={formData.userType === 'farmer' ? '#fff' : theme.textSecondary} 
                          />
                          <Text style={[
                            styles.userTypeText,
                            { color: formData.userType === 'farmer' ? '#fff' : theme.textSecondary }
                          ]}>
                            Farmer
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.userTypeButton,
                            { backgroundColor: formData.userType === 'seller' ? theme.secondary : theme.background },
                          ]}
                          onPress={() => handleInputChange('userType', 'seller')}
                        >
                          <Ionicons 
                            name="storefront" 
                            size={16} 
                            color={formData.userType === 'seller' ? '#fff' : theme.textSecondary} 
                          />
                          <Text style={[
                            styles.userTypeText,
                            { color: formData.userType === 'seller' ? '#fff' : theme.textSecondary }
                          ]}>
                            Seller
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </>
                )}

                {renderInput('mail', 'Email Address', 'email', formData.email, false, 'email-address')}
                {renderPasswordInput('Password', 'password', formData.password, showPassword, setShowPassword)}
                
                {!isLogin && (
                  renderPasswordInput(
                    'Confirm Password', 
                    'confirmPassword', 
                    formData.confirmPassword, 
                    showConfirmPassword, 
                    setShowConfirmPassword
                  )
                )}

                <TouchableOpacity
                  style={[styles.submitButton, { backgroundColor: theme.secondary }]}
                  onPress={handleSubmit}
                  activeOpacity={0.8}
                >
                  <Text style={styles.submitButtonText}>
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.toggleModeButton} onPress={toggleMode}>
                  <Text style={[styles.toggleModeText, { color: theme.textSecondary }]}>
                    {isLogin ? "Don't have an account? " : 'Already have an account? '}
                  </Text>
                  <Text style={[styles.toggleModeLink, { color: theme.secondary }]}>
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </Text>
                </TouchableOpacity>
              </View>
            </AnimatedCard>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
    marginBottom: 20,
  },
  formCard: {
    borderRadius: 20,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 4,
  },
  userTypeContainer: {
    marginBottom: 16,
  },
  userTypeLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  userTypeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  userTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  userTypeText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 8,
  },
  toggleModeButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleModeText: {
    fontSize: 16,
  },
  toggleModeLink: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AuthScreen;
