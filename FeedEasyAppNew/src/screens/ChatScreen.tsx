import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useRoute, useNavigation } from '@react-navigation/native';
import DatabaseService, { Message } from '../services/DatabaseService';
import { RootStackParamList } from '../../App';
import { RouteProp } from '@react-navigation/native';

type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;

const ChatScreen = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const route = useRoute<ChatScreenRouteProp>();
  const navigation = useNavigation();
  const { sellerId, farmerId, chatName } = route.params;

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const loadMessages = useCallback(async () => {
    const loadedMessages = await DatabaseService.getMessagesBetweenUsers(farmerId, sellerId);
    setMessages(loadedMessages);
  }, [farmerId, sellerId]);

  useEffect(() => {
    navigation.setOptions({ title: chatName });
    loadMessages();
  }, [loadMessages, navigation, chatName]);

  const handleSend = async () => {
    if (newMessage.trim() === '' || !user) return;

    const messageData: Omit<Message, 'id' | 'createdAt'> = {
      senderId: user.id,
      receiverId: user.id === farmerId ? sellerId : farmerId,
      message: newMessage,
      messageType: 'text',
      isRead: false,
    };

    await DatabaseService.createMessage(messageData);
    setNewMessage('');
    loadMessages();
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMyMessage = item.senderId === user?.id;
    return (
      <View style={[
        styles.messageContainer,
        isMyMessage ? styles.myMessage : styles.theirMessage,
        { backgroundColor: isMyMessage ? theme.primary : theme.surface }
      ]}>
        <Text style={{ color: isMyMessage ? '#fff' : theme.text }}>{item.message}</Text>
        <Text style={[styles.timestamp, { color: isMyMessage ? '#c8e6c9' : theme.textSecondary }]}>
          {new Date(item.createdAt).toLocaleTimeString()}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.messagesList}
        inverted
      />
      <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
        <TextInput
          style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor={theme.textSecondary}
        />
        <TouchableOpacity style={[styles.sendButton, { backgroundColor: theme.primary }]} onPress={handleSend}>
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesList: {
    padding: 10,
  },
  messageContainer: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
  },
  theirMessage: {
    alignSelf: 'flex-start',
  },
  timestamp: {
    fontSize: 10,
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatScreen;