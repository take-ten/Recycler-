import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { addMessage } from '../../store/chatSlice';
import { getDocs, collection, query, where, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { getAuth } from 'firebase/auth';
import { useRoute } from '@react-navigation/native';

const ChatScreen = ({key}:{key:any}) => {
  const dispatch = useDispatch();
  const route = useRoute();
  const getter = route.params;
  const chatId= JSON.parse(JSON.stringify(getter));

  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const userId = getAuth().currentUser?.uid;
//lets fetch the messages from the chat using the chatId

useEffect(() => {
  const fetchMessages = async () => {
    try {
      const q = query(collection(db, 'chats'), where('id', '==', chatId));
      const querySnapshot = await getDocs(q);
      const chatData = querySnapshot.docs[0]?.data();
      setMessages(chatData?.messages || []);

    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };


  if (chatId) {
    fetchMessages();
  }
}, []);

  useEffect(() => {
    if (!chatId) {
      console.error('Chat or chat.id is undefined');
      return;
    }

    const fetchMessages = async () => {
      try {
        const q = query(collection(db, 'chats'), where('id', '==', chatId));
        const querySnapshot = await getDocs(q);
        const chatData = querySnapshot.docs[0]?.data();
        setMessages(chatData?.messages || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [chatId]);

  const handleSend = async () => {
    if (inputText.trim()) {
      const newMessage = {
        text: inputText,
        sender: userId,
        timestamp: new Date().toISOString(),
      };

      try {
        const chatRef = doc(db, 'chats', chatId);
        await updateDoc(chatRef, {
          messages: [...messages, newMessage],
        });

        dispatch(addMessage({ chatId: chatId, message: newMessage }));
        setMessages(prevMessages => [...prevMessages, { id: Date.now().toString(), ...newMessage }]);
        setInputText('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={[styles.messageBubble, item.sender === userId ? styles.myMessage : styles.otherMessage]}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Chat with {chatId.name?.receiverId || 'Unknown'}</Text>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.timestamp}
        contentContainerStyle={styles.messagesContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Votre message ici ..."
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
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
  messagesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  messageBubble: {
    borderRadius: 20,
    padding: 15,
    marginVertical: 5,
    maxWidth: '80%',
  },
  myMessage: {
    backgroundColor: '#a0e75a',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#a0e75a',
    borderRadius: 20,
    padding: 10,
    marginLeft: 10,
  },
});

export default ChatScreen;
