import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RewardScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      const x = await AsyncStorage.getItem('role');
      setRole(x);
    };
    fetchRole();
  }, []);

  useEffect(() => {
    if (role !== 'Provider') {
      // dispatch(isLoggedIn(false));
      navigation.navigate('Onboarding');
    }
  }, [role]);

  const [isCollectorCalled, setIsCollectorCalled] = useState(false);

  const handleCollectorButtonPress = () => {
    setIsCollectorCalled(prevState => !prevState);
  };
  const points = 36;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.pointsText}>Vos points : {points}</Text>
        <Text style={styles.greeting}>Bonjour Mr, Provider</Text>
        
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
          {({ pressed }) => (
            <Text style={[styles.buttonText, pressed && styles.buttonTextPressed]}>ICI</Text>
          )}
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
          {({ pressed }) => (
            <Text style={[styles.buttonText, pressed && styles.buttonTextPressed]}>ICI</Text>
          )}
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
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  pointsText: {
    fontSize: 16,
    bottom: 100,
    fontWeight: 'bold',
    left: 180,
  },
  greeting: {
    bottom: 80,
    left: 2,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20, 
  },
  instructionText: {
    top: 30,
    fontSize: 21,
    marginBottom: 10,
    textAlign: 'center',
    height: 50, // Fixed height
  },
  instructionText2: {
    top: 50,
    fontSize: 21,
    marginBottom: 10,
    textAlign: 'center',
    height: 50, // Fixed height
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
    marginTop: 20,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  greenButton: {
    backgroundColor: '#4CAF50',
    top:30
  },
  redButton: {
    backgroundColor: 'red',
    top:32
  },
  yellowButton: {
    backgroundColor: '#FFC107',
    top: 40,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  buttonTextPressed: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
});

export default RewardScreen;