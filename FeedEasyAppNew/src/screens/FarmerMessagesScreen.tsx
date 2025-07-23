import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import DatabaseService, { User, Message } from '../services/DatabaseService';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

interface Conversation {
  user: User;
  lastMessage: Message;
  unreadCount: number;
}

type FarmerMessagesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Chat'>;

const FarmerMessagesScreen = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation<FarmerMessagesScreenNavigationProp>();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.userType === 'farmer') {
      loadConversations();
    }
  }, [user]);

  const loadConversations = async () => {
    setLoading(true);
    try {
      const messages = await DatabaseService.getAllMessagesForUser(user!.id);
      const grouped: { [key: number]: Message[] } = {};
      messages.forEach((msg: Message) => {
        const otherUserId = msg.senderId === user!.id ? msg.receiverId : msg.senderId;
        if (!grouped[otherUserId]) grouped[otherUserId] = [];
        grouped[otherUserId].push(msg);
      });

      const convos: Conversation[] = [];
      for (const otherUserIdStr of Object.keys(grouped)) {
        const otherUserId = Number(otherUserIdStr);
        const msgs = grouped[otherUserId];
        msgs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        const lastMessage = msgs[0];
        const unreadCount = msgs.filter(m => !m.isRead && m.receiverId === user!.id).length;
        const otherUser = await DatabaseService.getUserById(otherUserId);
        if (otherUser) {
          convos.push({ user: otherUser, lastMessage, unreadCount });
        }
      }

      convos.sort((a, b) => new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime());

      setConversations(convos);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const openChat = (otherUser: User) => {
    if (!user) return;
    navigation.navigate('Chat', {
      sellerId: otherUser.id,
      farmerId: user.id,
      chatName: `${otherUser.firstName} ${otherUser.lastName}`,
    });
  };

  if (!user || user.userType !== 'farmer') {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.text }]}>
          Access denied. Farmer account required.
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Ionicons name="chatbubbles-outline" size={48} color={theme.textSecondary} />
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>Loading conversations...</Text>
      </View>
    );
  }

  if (conversations.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Ionicons name="chatbubbles-outline" size={48} color={theme.textSecondary} />
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No conversations yet.</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity style={[styles.conversationItem, { backgroundColor: theme.surface }]} onPress={() => openChat(item.user)}>
      <View style={styles.conversationHeader}>
        <Text style={[styles.conversationName, { color: theme.text }]}>{item.user.firstName} {item.user.lastName}</Text>
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unreadCount}</Text>
          </View>
        )}
      </View>
      <Text style={[styles.lastMessage, { color: theme.textSecondary }]} numberOfLines={1}>
        {item.lastMessage.message}
      </Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      style={[styles.container, { backgroundColor: theme.background }]}
      data={conversations}
      keyExtractor={(item) => item.user.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 10 }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  conversationItem: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  conversationName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: 14,
  },
  unreadBadge: {
    backgroundColor: '#f44336',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
});

export default FarmerMessagesScreen;
