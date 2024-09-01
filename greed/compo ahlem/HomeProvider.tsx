import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView } from 'react-native';

const RewardScreen = () => {
  const [isCollectorCalled, setIsCollectorCalled] = useState(false);

  const handleCollectorButtonPress = () => {
    setIsCollectorCalled(prevState => !prevState);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
       
        <Text style={styles.greeting}>Bonjour Mr, Provider</Text>
        
        
        <Text style={styles.instructionText}>
          {isCollectorCalled 
            ? "Appuyez ici si le collecteur est passé"
            : "Si vous voulez qu'un collecteur passe, appuyez"}
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
        
        <Text style={styles.instructionText}>
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
   marginBottom: 10,
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 10,
    zIndex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    position: 'absolute',
    top: 90,
    left: 0,
    padding: 10,
    zIndex: 1,
  },
  instructionText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#34C759',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
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
  buttonTextPressed: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
});

export default RewardScreen;