import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
// import { login } from '../store/authSlice';
import { useNavigation } from '@react-navigation/native';


const OnboardingScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();



  return (
    <View style={styles.container} >
      <Image
        source={require('../../assets/onboarding.png')}
        style={styles.image}
      />
      <Text style={styles.text}>
        Mettons la main dans la main et construisons un bel avenir pour nos enfants.
        Aidez-nous à combattre la pollution et redonnez le vert à notre planète.
        Ensemble, faisons la différence!
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.buttonText}>Rejoindre le mouvement</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: 317,
    height: 291,
    borderRadius: 25,
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#34C759',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;