import React, { useEffect, useState } from 'react';
import HomeScreen from '../app/screens/HomeScreen';
import ChatScreen from '../app/screens/ChatScreen';
import ProviderDef from '../app/screens/ProviderDef';
import CollectorDef from '../app/screens/CollectorDef';
import HomeProvider from '../app/screens/HomeProvider';
import { ActivityIndicator, View, Text } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { getAuth } from 'firebase/auth';

const HomePage = () => {
  const user = getAuth().currentUser;
  const userId = user ? user.uid : null;
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (userId) {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData && userData.role) {
            console.log('User role:', userData.role); // Debug log
            setRole(userData.role);
          }
        }
      }
      setLoading(false);
    };
    fetchRole();
  }, [userId]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Render different components based on the role
  if (role === "Collector") {
    return <HomeScreen />;
  } else if (role === "Provider") {
    return <HomeProvider />;
  } else {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#4CAF50' }}>404 - Page introuvable</Text>
      </View>
    );
  }
};

export default HomePage;
