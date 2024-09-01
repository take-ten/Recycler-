import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '@/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { getAuth } from 'firebase/auth';
import { logout } from '@/store/authSlice';


const HomeProvider = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [role, setRole] = useState(null);
  const [isCollectorCalled, setIsCollectorCalled] = useState(false);
  const [points, setPoints] = useState(0); // Assuming you'll fetch this value from Firestore
  const [gg, setGG] = useState ('');

  useEffect(() => {
    const fetchPoints = async () => {
      const userId = auth.currentUser?.uid;
      console.log('userId',userId);
      const userRef = doc(db, 'users', userId as string);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setPoints(userData.points);
        setRole(userData.role);
        
      }
    };
    fetchPoints();
  }, []);

  const roleFromState = useSelector((state: any) => state.auth.role);

  useEffect(() => {
    setRole(roleFromState);
  }, [roleFromState]);

  useEffect(() => {
    if (role !== 'Provider') {
      // dispatch(logout());
      // navigation.navigate('Onboarding' as never);

      console.log('role from logout console log',role);
    }
  }, [role, navigation]);

  const handleCollectorButtonPress = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (userId) {
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const newStatus = userData.status === 'ready' ? null : 'ready';
          await updateDoc(userRef, {
            status: newStatus,
          });
          setIsCollectorCalled(newStatus === 'ready'); // Update the button's state to change its color
        }
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };
  const name = getAuth().currentUser?.displayName;
  console.log(name);
  console.log(gg);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.pointsContainer}>
        <Text style={styles.pointsText}>Vos points : {points}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.greeting}>Bonjour Mr, {name}</Text>
        
        <Text style={styles.instructionText}>
          {isCollectorCalled 
            ? "Appuyez ici si le collecteur est passé"
            : "Appuyez ici pour qu'un collecteur passe, appuyez"}
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            isCollectorCalled ? styles.redButton : styles.greenButton,
            pressed && styles.buttonPressed
          ]}
          onPress={handleCollectorButtonPress}
        >
          <Text style={[styles.buttonText]}>
            ICI
          </Text>
        </Pressable>
        
        <Text style={styles.instructionText2}>
          Si vous avez besoin d'assistance, appuyez
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.yellowButton,
            pressed && styles.buttonPressed
          ]}
        >
          <Text style={[styles.buttonText]}>
            ICI
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  pointsContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  pointsText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 21,
    marginBottom: 10,
    textAlign: 'center',
  },
  instructionText2: {
    fontSize: 21,
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    width: 260,
    height: 70,
    alignSelf: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  greenButton: {
    backgroundColor: '#4CAF50',
  },
  redButton: {
    backgroundColor: 'red',
  },
  yellowButton: {
    backgroundColor: '#FFC107',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default HomeProvider;
