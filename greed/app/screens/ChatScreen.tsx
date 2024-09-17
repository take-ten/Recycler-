import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, FlatList, Alert, ActivityIndicator } from 'react-native';
import { getDoc, doc, updateDoc, onSnapshot, getDocs, collection } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import MessageItem from '../../components/messages/MessageItem';

const ChatScreen = ({ chatId, onBack }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [userNames, setUserNames] = useState<{ [key: string]: { name: string, businessName: string | null, avatarUrl?: string } }>({});
  const [sending, setSending] = useState(false);
  const userId = auth.currentUser?.uid;
  const flatListRef = useRef<FlatList>(null);

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  useEffect(() => {
    requestCameraPermission();
    fetchChat();
    fetchUserNames();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [selectedChat]);

  const fetchUserNames = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = doc.data();
        return acc;
      }, {});
      setUserNames(usersData);
    } catch (error) {
      console.error('Error fetching user names:', error);
    }
  };

  const fetchChat = async () => {
    try {
      const chatDocRef = doc(db, 'chats', chatId);
      const chatDoc = await getDoc(chatDocRef);
      setSelectedChat({ id: chatDoc.id, ...chatDoc.data() });

      const unsubscribe = onSnapshot(chatDocRef, (doc) => {
        setSelectedChat({ id: doc.id, ...doc.data() });
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error fetching chat:', error);
    }
  };

  const handleSelectImage = async () => {
    if (hasPermission === null || hasPermission === false) {
      Alert.alert('Permission Denied', 'Camera permission not granted');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets) {
      const base64Image = result.assets[0].base64;
      handleSendMessage(`data:image/jpeg;base64,${base64Image}`);
    } else {
      Alert.alert('Error', 'Image capture cancelled or base64 is undefined');
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!selectedChat || !userId || !message.trim()) return;

    setSending(true);

    const chatDocRef = doc(db, 'chats', selectedChat.id);

    const newMessageObj = {
      senderName: userNames[userId]?.name || 'Unknown',
      senderId: userId,
      text: message,
      timestamp: new Date(),
    };

    try {
      const chatDoc = await getDoc(chatDocRef);
      const currentMessages = chatDoc.data()?.messages || [];
      const updatedMessages = [...currentMessages, newMessageObj];

      await updateDoc(chatDocRef, {
        messages: updatedMessages,
      });

      setNewMessage('');
      flatListRef.current?.scrollToEnd({ animated: true });
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.', error.message);
    } finally {
      setSending(false);
    }
  };

  const renderItem = ({ item }) => {
    const isCurrentUser = item.senderId === userId;
    const senderName = userNames[item.senderId]?.name || 'Unknown';
    const avatarUrl = userNames[item.senderId]?.avatarUrl || 'https://avatar.iran.liara.run/public/boy';

    return (
      <MessageItem
        provider={senderName}
        message={item.text}
        isCurrentUser={isCurrentUser}
        avatarUrl={avatarUrl}
        timestamp={item.timestamp}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
      <Ionicons name="arrow-back" size={24} color="black"  />
      </TouchableOpacity>
      {selectedChat ? (
        <View style={styles.chatContainer}>
          <FlatList
            ref={flatListRef}
            data={selectedChat.messages}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={handleSelectImage}>
              <Icon name="camera" size={24} color="grey" style={styles.cameraIcon} />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="votre message ..."
              placeholderTextColor="grey"
            />
            <TouchableOpacity onPress={() => handleSendMessage(newMessage)} style={styles.sendButton} disabled={sending}>
              {sending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="send" size={24} color="white" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View>
          <Text style={styles.header}>Loading Chat...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  backButton: {
    padding: 10,
    // backgroundColor: '#4CAF50',
    borderRadius: 5,
    margin: 10,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: 'white',
    backgroundColor: '#f2f1f0',
    borderRadius: 20,
  },
  cameraIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 4,
    padding: 10,
    marginRight: 10,
    borderRadius: 20,
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default ChatScreen;