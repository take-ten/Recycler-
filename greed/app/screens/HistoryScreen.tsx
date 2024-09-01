import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, TextInput, TouchableHighlight, BackHandler, Image, Button } from 'react-native';
import { getDocs, collection, query, where, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { auth, db , storage } from '../../firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons
import { launchCamera } from 'react-native-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { PermissionsAndroid, Platform } from 'react-native';

const MessageItem = ({ provider, message, avatarUrl, isCurrentUser, timestamp }: { provider: string, message: string, avatarUrl: string, isCurrentUser: boolean, timestamp: Date }) => {
  const formatDate = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <View style={[styles.messageContainer, isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer]}>
      {!isCurrentUser && <Image source={{ uri: avatarUrl }} style={styles.avatar} />}
      <View style={[styles.messageBubble, isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble]}>
        <Text style={styles.providerText}>{provider}</Text>
        {message.startsWith('https://') ? (
          <Image source={{ uri: message }} style={styles.messageImage} />
        ) : (
          <Text style={styles.messageText}>{message}</Text>
        )}
        <Text style={styles.timestamp}>{formatDate(timestamp)}</Text>
      </View>
      {isCurrentUser && <Image source={{ uri: avatarUrl }} style={styles.avatar} />}
    </View>
  );
};

const HistoryScreen = () => {
  
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const [userNames, setUserNames] = useState<{ [key: string]: { name: string, businessName: string | null, avatarUrl?: string } }>({});
  const userId = auth.currentUser?.uid;

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Camera permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  useEffect(() => {
    const fetchChats = async () => {
      const chatsCollection = collection(db, 'chats');
      const q = query(chatsCollection, where('users', 'array-contains', userId));
      const querySnapshot = await getDocs(q);
      const chatsList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setChats(chatsList);
      await fetchUserNames(chatsList);
    };
    fetchChats();
  }, [userId]);

  const fetchUserNames = async (chatList: any[]) => {
    const userIds = new Set<string>();

    chatList.forEach(chat => {
      chat.users.forEach(userId => userIds.add(userId));
    });

    const userCollection = collection(db, 'users');
    const userSnapshot = await getDocs(userCollection);
    const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const userMap: { [key: string]: { name: string, businessName: string | null, avatarUrl?: string } } = {};
    userList.forEach(user => {
      userMap[user.id] = { name: user.name, businessName: user.businessName || null, avatarUrl: user.avatarUrl || '' };
    });

    setUserNames(userMap);
  };

  useEffect(() => {
    const chatsCollection = collection(db, 'chats');
    const q = query(chatsCollection, where('users', 'array-contains', userId));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const chatsList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setChats(chatsList);
    });

    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    if (!selectedChat?.id) return;

    const chatDocRef = doc(db, 'chats', selectedChat.id);

    const unsubscribe = onSnapshot(chatDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const updatedChat = docSnapshot.data();
        setSelectedChat((prevChat: any) => ({
          ...prevChat,
          messages: updatedChat.messages || [],
        }));
      }
    });

    return () => unsubscribe();
  }, [selectedChat?.id]);

  const handleChatPress = (item: any) => {
    setSelectedChat(item);
  };

  const handleSendMessage = async (message: string) => {
    if (!selectedChat || !userId || !message.trim()) return;

    const chatDocRef = doc(db, 'chats', selectedChat.id);

    const newMessageObj = {
      senderName: userNames[userId]?.name || 'Unknown',
      senderId: userId,
      text: message,
      timestamp: new Date(),
    };

    await updateDoc(chatDocRef, {
      messages: [...selectedChat.messages, newMessageObj],
    });

    setNewMessage('');
  };

  const handleBackToList = () => {
    setSelectedChat(null);
  };

  const handleSelectImage = async () => {
    launchCamera({ mediaType: 'photo' }, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const uri = response.assets[0].uri;
        const responseBlob = await fetch(uri);
        const blob = await responseBlob.blob();
        const storageRef = ref(storage, `images/${new Date().getTime()}_${uri.split('/').pop()}`);
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);
        handleSendMessage(downloadURL);
      }
    });
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (selectedChat) {
          handleBackToList();
          return true;
        }
        return false;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [selectedChat])
  );

  const getChatTitle = () => {
    if (!selectedChat) return '';
    const otherUserIds = selectedChat.users.filter((id: string) => id !== userId);
    const otherUserNames = otherUserIds.map((id: string) => userNames[id]?.businessName || userNames[id]?.name || 'Unknown').join(', ');
    return otherUserNames;
  };

  return (
    <SafeAreaView style={styles.container}>
      {selectedChat ? (
        <View style={styles.chatContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.chatTitle}>{getChatTitle()}</Text>
          </View>
          <FlatList
            data={selectedChat.messages}
            renderItem={({ item }) => {
              const isCurrentUser = item.senderId === userId;
              const senderName = userNames[item.senderId]?.name || 'Unknown';
              const avatarUrl = userNames[item.senderId]?.avatarUrl || 'https://avatar.iran.liara.run/public/boy'; // Add avatar URL if available

              return (
                <MessageItem
                  provider={senderName}
                  message={item.text}
                  avatarUrl={avatarUrl}
                  isCurrentUser={isCurrentUser}
                  timestamp={item.timestamp.toDate()}
                />
              );
            }}
            keyExtractor={(item, index) => index.toString()}
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
            <TouchableHighlight style={styles.sendButton} onPress={() => handleSendMessage(newMessage)} underlayColor="#45a049">
              <Icon name="send" size={24} color="white" />
            </TouchableHighlight>
          </View>
        </View>
      ) : (
        <View>
          <Text style={styles.header}>Chats</Text>
          <FlatList
            data={chats}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleChatPress(item)}>
                <View style={styles.chatItem}>
                  <Text style={styles.chatTitle}>
                    {item.users
                      .filter((uid: string) => uid !== userId)
                      .map((uid: string) => userNames[uid]?.businessName || userNames[uid]?.name || uid)
                      .join(', ')}
                  </Text>
                  <Text style={styles.chatTitleGrey}>{item.messages[0]?.text || 'No messages yet'}</Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
          />
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
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  list: {
    paddingBottom: 20,
  },
  chatItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatTitleGrey: {
    color: '#d3d3d3', // Changed to a lighter grey
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
    justifyContent: 'space-between',
    // backgroundImage: require('../assets/images/background.png'),
  },
  titleContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  chatTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'black',
    fontFamily:'Inter Bold',
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
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 5,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 10,
    backgroundColor: '#f1f1f1',
  },
  currentUserContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  otherUserContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  currentUserBubble: {
    backgroundColor: '#d0f0c0',
  },
  otherUserBubble: {
    backgroundColor: '#f1f1f1',
  },
  providerText: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  messageText: {
    fontSize: 16,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  timestamp: {
    fontSize: 12,
    color: 'grey',
    marginTop: 5,
  },
});

export default HistoryScreen;
