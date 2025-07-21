import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

interface MenuItem {
  label: string;
  icon: string;
  onPress: () => void;
}

const HeaderMenu = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { theme } = useTheme();
  const navigation = useNavigation();

  const menuItems: MenuItem[] = [
    {
      label: 'Home',
      icon: 'home-outline',
      onPress: () => {
        setIsVisible(false);
        navigation.navigate('MainTabs' as never);
      },
    },
    {
      label: 'Educational Resources',
      icon: 'book-outline',
      onPress: () => {
        setIsVisible(false);
        navigation.navigate('Education' as never);
      },
    },
    {
      label: 'Inventory Management',
      icon: 'archive-outline',
      onPress: () => {
        setIsVisible(false);
        navigation.navigate('Inventory' as never);
      },
    },
    {
      label: 'Notifications',
      icon: 'notifications-outline',
      onPress: () => {
        setIsVisible(false);
        navigation.navigate('Notifications' as never);
      },
    },
    {
      label: 'Settings',
      icon: 'settings-outline',
      onPress: () => {
        setIsVisible(false);
        navigation.navigate('Settings' as never);
      },
    },
  ];

  const renderMenuItem = (item: MenuItem, index: number) => (
    <TouchableOpacity
      key={index}
      style={[styles.menuItem, { borderBottomColor: theme.border }]}
      onPress={item.onPress}
    >
      <Ionicons name={item.icon as any} size={24} color={theme.primary} />
      <Text style={[styles.menuText, { color: theme.text }]}>{item.label}</Text>
      <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity
        style={styles.headerButton}
        onPress={() => setIsVisible(true)}
      >
        <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View style={styles.dropdownContainer}>
            {/* Arrow pointer */}
            <View style={[styles.arrow, { borderBottomColor: theme.surface }]} />
            <View style={[styles.menuContainer, { backgroundColor: theme.surface }]}>
              <View style={[styles.menuHeader, { borderBottomColor: theme.border }]}>
                <Text style={[styles.menuTitle, { color: theme.text }]}>Quick Menu</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setIsVisible(false)}
                >
                  <Ionicons name="close" size={24} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>
              {menuItems.map(renderMenuItem)}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  headerButton: {
    padding: 8,
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  dropdownContainer: {
    position: 'absolute',
    top: 60, // Position below header
    right: 15,
    width: 280,
    maxWidth: width * 0.8,
  },
  arrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    alignSelf: 'flex-end',
    marginRight: 20,
    marginBottom: -1,
  },
  menuContainer: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 16,
    flex: 1,
  },
});

export default HeaderMenu;
