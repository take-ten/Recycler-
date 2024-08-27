import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import GoogleSignInButton from '../../components/GoogleSignInButton';

const SignUp = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Salut, Inscrivez-vous pour commencer !</Text>
      <TextInput style={styles.input} placeholder="Nom d'utilisateur" />
      <TextInput style={styles.input} placeholder="E-Mail ou Tel" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Mot de passe" secureTextEntry />
      <TextInput style={styles.input} placeholder="Veuillez confirmer votre mot de passe" secureTextEntry />
      <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('RoleScreen')}>
        <Text style={styles.registerButtonText}>Enregistrer</Text>
      </TouchableOpacity>
      <Text style={styles.orText}>ou inscrivez-vous avec</Text>
      <View style={styles.socialButtonsContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <Icon name="facebook" size={30} color="#3b5998" />
        </TouchableOpacity>
        <GoogleSignInButton />
        <TouchableOpacity style={styles.socialButton}>
          <Icon name="apple" size={30} color="#000" />
        </TouchableOpacity>
      </View>
      <Text style={styles.footerText}>
        Vous avez déjà un compte ? <Text style={styles.footerLink} onPress={() => navigation.navigate('SignIn')}>Connectez-vous !</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  registerButton: {
    backgroundColor: '#34C759',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    marginBottom: 20,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  footerText: {
    textAlign: 'center',
  },
  footerLink: {
    color: '#34C759',
    fontWeight: 'bold',
  },
});

export default SignUp;