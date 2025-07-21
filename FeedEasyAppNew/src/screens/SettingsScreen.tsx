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

const SettingsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [locationEnabled, setLocationEnabled] = React.useState(false);

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
    <TouchableOpacity key={index} style={styles.settingItem} onPress={item.onPress}>
      <View style={styles.settingLeft}>
        <Ionicons name={item.icon} size={24} color="#2e7d32" />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{item.title}</Text>
          {item.subtitle && (
            <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
          )}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Manage your account preferences</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        {settingsOptions.slice(0, 3).map(renderSettingItem)}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="notifications-outline" size={24} color="#2e7d32" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Push Notifications</Text>
              <Text style={styles.settingSubtitle}>Get notified about orders</Text>
            </View>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#ddd', true: '#2e7d32' }}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="location-outline" size={24} color="#2e7d32" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Location Services</Text>
              <Text style={styles.settingSubtitle}>For delivery tracking</Text>
            </View>
          </View>
          <Switch
            value={locationEnabled}
            onValueChange={setLocationEnabled}
            trackColor={{ false: '#ddd', true: '#2e7d32' }}
          />
        </View>

        {settingsOptions.slice(3).map(renderSettingItem)}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="help-circle-outline" size={24} color="#2e7d32" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Help & FAQ</Text>
              <Text style={styles.settingSubtitle}>Get answers to common questions</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="mail-outline" size={24} color="#2e7d32" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Contact Support</Text>
              <Text style={styles.settingSubtitle}>support@feedeasy.ug</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={[styles.settingItem, styles.logoutItem]}>
          <View style={styles.settingLeft}>
            <Ionicons name="log-out-outline" size={24} color="#f44336" />
            <Text style={[styles.settingTitle, { color: '#f44336' }]}>Sign Out</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.versionText}>FeedEasy v1.0.0</Text>
        <Text style={styles.footerText}>Made with ❤️ for Ugandan farmers</Text>
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
