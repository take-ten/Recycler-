import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import Loading from '../../components/Loading'; // Import Loading component
import { useLoading } from '../../components/LoadingContext'; // Import useLoading hook

const HistoryScreen = ({ onSelectChat }) => {
  const [chats, setChats] = useState<any[]>([]);
  const [userNames, setUserNames] = useState<{ [key: string]: { name: string, businessName: string | null, avatarUrl?: string } }>({});
  const userId = auth.currentUser?.uid;
  const { loading, setLoading } = useLoading(); // Use loading context

  useEffect(() => {
    console.log('HistoryScreen mounted');
    const fetchData = async () => {
      setLoading(true); // Set loading to true when fetching starts
      await fetchChats();
      await fetchUserNames();
      setLoading(false); // Set loading to false after fetching completes
    };

    fetchData();

    return () => {
      console.log('HistoryScreen unmounted');
    };
  }, []);

  const fetchUserNames = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = doc.data();
        return acc;
      }, {});
      setUserNames(usersData);
      // console.log('User names fetched:', usersData);
    } catch (error) {
      console.error('Error fetching user names:', error);
    }
  };

  const fetchChats = async () => {
    try {
      const q = query(collection(db, 'chats'), where('users', 'array-contains', userId));
      const querySnapshot = await getDocs(q);
      const chatsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChats(chatsData);
      // console.log('Chats fetched:', chatsData);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  if (loading) {
    return <Loading />; // Show loading spinner while data is being fetched
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chats</Text>
      <FlatList
        data={chats}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onSelectChat(item.id)}>
            <View style={styles.chatItem}>
              <Text style={styles.chatTitle}>
                {item.users
                  .filter((uid: string) => uid !== userId)
                  .map((uid: string) => userNames[uid]?.businessName || userNames[uid]?.displayName || uid)
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
    color: '#d3d3d3',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HistoryScreen;