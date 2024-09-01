import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, TextInput, Button } from 'react-native';
import { Badge } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { collection, addDoc, doc, updateDoc, onSnapshot, getDoc, getDocs, query, where } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import Modal from 'react-native-modal';
import { FlatList } from 'react-native';
import {db} from '../../firebaseConfig';
import { getAuth } from 'firebase/auth';
import { useSelector } from 'react-redux';


const { height } = Dimensions.get('window');

interface User {
  id: string;
  name: string;
  status: string;
  collectorId?: string;
  picker?: string | null;
}

const BottomSheet = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState<User[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const currentUserId = getAuth().currentUser?.uid;
  const userId = useSelector((state: any) => state.auth.userId);
  console.log('currentUserId!!!!!',currentUserId)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'users'),
      (querySnapshot) => {
        const usersList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as User[];
        setUsers(usersList);
      },
      (error) => {
        console.error('Error listening to users collection:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleChangeStatus = async (userId: string) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        await updateDoc(userRef, {
          status: 'loading',
          collectorId: currentUserId,
          picker: null,
        });
        console.log('User status updated:', userId);
      } else {
        console.error('User document does not exist:', userId);
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };
  console.log('users', users)
  const handleOpenModal = (userId: string) => {
    setSelectedUserId(userId);
    setIsModalVisible(true);
  };

  const handleSendMessage = async () => {
    if (!selectedUserId || !currentUserId || !message.trim()) return;

    try {
      const chatQuery = query(
        collection(db, 'chats'),
        where('users', 'array-contains', currentUserId)
      );
      const chatSnapshot = await getDocs(chatQuery);
      let chatId = null;
      let chatDoc = null;

      chatSnapshot.forEach((doc) => {
        if (doc.data().users.includes(selectedUserId)) {
          chatId = doc.id;
          chatDoc = doc;
        }
      });

      if (chatId && chatDoc) {
        await updateDoc(chatDoc.ref, {
          messages: chatDoc.data().messages.concat({
            senderId: currentUserId,
            receiverId: selectedUserId,
            text: message,
            timestamp: new Date(),
          }),
        });
      } else {
        chatId = `${currentUserId}_${selectedUserId}`;
        await addDoc(collection(db, 'chats'), {
          chatId,
          users: [currentUserId, selectedUserId],
          messages: [
            {
              senderId: currentUserId,
              receiverId: selectedUserId,
              text: message,
              timestamp: new Date(),
            },
          ],
        });
      }

      setMessage('');
      setIsModalVisible(false);
      console.log('Message sent');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleStatusReady = async (userId: string) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        await updateDoc(userRef, {
          status: 'ready',
          collectorId: null,
          picker: null,
        });
        console.log('User status updated:', userId);
      } else {
        console.error('User document does not exist:', userId);
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const filteredUsers = users.filter(
    (user) => user.status === 'ready' || user.collectorId === currentUserId
  );

  return (
    <View style={styles.bottomSheet}>
      <FlatList
        data={filteredUsers}
        keyExtractor={(user) => user.id}
        renderItem={({ item }) => (
          <View style={styles.providerRow}>
            <Badge
              status={item.collectorId === currentUserId ? 'warning' : 'success'}
              containerStyle={styles.badge}
            />
            <TouchableOpacity onPress={() => handleStatusReady(item.id)}>
              <Text style={styles.providerText}>{item.name}</Text>
            </TouchableOpacity>
            <View style={styles.statusContainer}>
              {item.collectorId !== currentUserId && (
                <TouchableOpacity
                  style={styles.changeStatusButton}
                  onPress={() => handleChangeStatus(item.id)}
                >
                  <Text style={styles.buttonText}>Prendre</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.chatIconContainer}>
              {item.collectorId === currentUserId && (
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={24}
                  color="black"
                  style={styles.messageIcon}
                  onPress={() => handleOpenModal(item.id)}
                />
              )}
            </View>
          </View>
        )}
      />

      {/* Modal for sending messages */}
      <Modal isVisible={isModalVisible} onBackdropPress={() => setIsModalVisible(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Send a message</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Quelque chose a dire?"
            value={message}
            onChangeText={setMessage}
          />
          <Button title="Send" onPress={handleSendMessage} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: height * 0.25,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  badge: {
    marginRight: 10,
  },
  providerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  chatIconContainer: {
    width: 40,
    alignItems: 'center',
  },
  changeStatusButton: {
    backgroundColor: '#FFA500',
    borderRadius: 10,
    padding: 5,
    marginLeft: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  messageIcon: {
    marginLeft: 10,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  textInput: {
    width: '100%',
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default BottomSheet;
