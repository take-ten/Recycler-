import React, { useEffect, useState } from 'react';
import HomeScreen from '../app/screens/HomeScreen';
import HomeProvider from '../app/screens/HomeProvider';
import { ActivityIndicator, View, Text } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const HomePage = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        console.log('No user is signed in');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchRole = async () => {
      if (userId) {
        try {
          const userDoc = await getDoc(doc(db, 'users', userId));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData && userData.role) {
              console.log('User role:', userData.role); // Debug log
              setRole(userData.role);
            } else {
              console.log('Role not found in user data');
            }
          } else {
            console.log('User document does not exist');
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      }
      setLoading(false);
    };

    if (userId) {
      fetchRole();
    }
  }, [userId]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!role) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#4CAF50' }}>Loading role...</Text>
      </View>
    );
  }

  // Render different components based on the role
  if (role === "Collecteur") {
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