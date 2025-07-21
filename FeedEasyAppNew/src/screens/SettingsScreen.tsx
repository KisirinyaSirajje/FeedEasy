import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const SettingsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [locationEnabled, setLocationEnabled] = React.useState(false);
  const { isDarkMode, toggleDarkMode, theme } = useTheme();

  const settingsOptions = [
    {
      title: 'Account Information',
      icon: 'person-outline',
      onPress: () => console.log('Account Info'),
    },
    {
      title: 'Payment Methods',
      icon: 'card-outline',
      onPress: () => console.log('Payment Methods'),
    },
    {
      title: 'Delivery Addresses',
      icon: 'location-outline',
      onPress: () => console.log('Addresses'),
    },
    {
      title: 'Language',
      subtitle: 'English',
      icon: 'language-outline',
      onPress: () => console.log('Language'),
    },
    {
      title: 'Currency',
      subtitle: 'UGX (Ugandan Shilling)',
      icon: 'cash-outline',
      onPress: () => console.log('Currency'),
    },
  ];

  const renderSettingItem = (item: any, index: number) => (
    <TouchableOpacity key={index} style={[styles.settingItem, { borderBottomColor: theme.border }]} onPress={item.onPress}>
      <View style={styles.settingLeft}>
        <Ionicons name={item.icon} size={24} color={theme.primary} />
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: theme.text }]}>{item.title}</Text>
          {item.subtitle && (
            <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>{item.subtitle}</Text>
          )}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Manage your account preferences</Text>
      </View>

      <View style={[styles.section, { backgroundColor: theme.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.text, backgroundColor: theme.background }]}>Account</Text>
        {settingsOptions.slice(0, 3).map(renderSettingItem)}
      </View>

      <View style={[styles.section, { backgroundColor: theme.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.text, backgroundColor: theme.background }]}>Preferences</Text>
        
        <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="moon-outline" size={24} color={theme.primary} />
            <View style={styles.settingText}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>Dark Mode</Text>
              <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>Switch to dark theme</Text>
            </View>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor={isDarkMode ? '#fff' : '#fff'}
          />
        </View>
        
        <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="notifications-outline" size={24} color={theme.primary} />
            <View style={styles.settingText}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>Push Notifications</Text>
              <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>Get notified about orders</Text>
            </View>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor={notificationsEnabled ? '#fff' : '#fff'}
          />
        </View>

        <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="location-outline" size={24} color={theme.primary} />
            <View style={styles.settingText}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>Location Services</Text>
              <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>For delivery tracking</Text>
            </View>
          </View>
          <Switch
            value={locationEnabled}
            onValueChange={setLocationEnabled}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor={locationEnabled ? '#fff' : '#fff'}
          />
        </View>

        {settingsOptions.slice(3).map(renderSettingItem)}
      </View>

      <View style={[styles.section, { backgroundColor: theme.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.text, backgroundColor: theme.background }]}>Support</Text>
        <TouchableOpacity style={[styles.settingItem, { borderBottomColor: theme.border }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="help-circle-outline" size={24} color={theme.primary} />
            <View style={styles.settingText}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>Help & FAQ</Text>
              <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>Get answers to common questions</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.settingItem, { borderBottomColor: theme.border }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="mail-outline" size={24} color={theme.primary} />
            <View style={styles.settingText}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>Contact Support</Text>
              <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>support@feedeasy.ug</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={[styles.section, { backgroundColor: theme.surface }]}>
        <TouchableOpacity style={[styles.settingItem, styles.logoutItem, { borderBottomColor: theme.border }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="log-out-outline" size={24} color={theme.error} />
            <Text style={[styles.settingTitle, { color: theme.error }]}>Sign Out</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.versionText, { color: theme.textSecondary }]}>FeedEasy v1.0.0</Text>
        <Text style={[styles.footerText, { color: theme.textSecondary }]}>Made with ❤️ for Ugandan farmers</Text>
      </View>
    </ScrollView>
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
  section: {
    backgroundColor: '#fff',
    marginTop: 20,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f8f9fa',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 15,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  versionText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 5,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});

export default SettingsScreen;
