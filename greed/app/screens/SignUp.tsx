import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig';
import { setDoc, doc } from 'firebase/firestore';
import GoogleSignInButton from '../../components/GoogleSignInButton';
import CryptoJS from 'crypto-js';
import Loading from '../../components/Loading'; // Import Loading component
import { useLoading } from '../../components/LoadingContext'; // Import useLoading hook

const SignUp = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { loading, setLoading } = useLoading(); // Use loading context

  // Function to handle user sign up
  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true); // Set loading to true when sign up starts

    try {
      const hashedPassword = CryptoJS.SHA256(password).toString(); // Hash the password
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;

      // Save user data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        displayName: username,
        uid: user.uid,
        email: user.email,
        password: hashedPassword, 
        photoURL: null,
        role: null, 
        location: null,
        status: null,
        geolocation: null,
        phone: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        points: 0,
      });

      // Navigate to the role selection screen
      navigation.navigate('RoleScreen', { userId: user.uid });
    } catch (error) {
      Alert.alert('Erreur', error.message);
    } finally {
      setLoading(false); // Set loading to false after sign up attempt
    }
  };

  if (loading) {
    return <Loading />; // Show loading spinner while sign up is in progress
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Salut, Inscrivez-vous pour commencer !</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom d'utilisateur"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="E-Mail ou Tel"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmez le mot de passe"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity style={styles.registerButton} onPress={handleSignUp}>
        <Text style={styles.registerButtonText}>S'inscrire</Text>
      </TouchableOpacity>
      <Text style={styles.orText}>ou inscrivez-vous avec</Text>
      <View style={styles.socialButtonsContainer}>
        <GoogleSignInButton onPress={() => { /* Handle Google Sign-In */ }} />
      </View>
      <Text style={styles.footerText}>
        Vous avez déjà un compte ?{' '}
        <Text style={styles.footerLink} onPress={() => navigation.navigate('SignIn')}>
          Connectez-vous !
        </Text>
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
  footerText: {
    textAlign: 'center',
  },
  footerLink: {
    color: '#34C759',
    fontWeight: 'bold',
  },
});

export default SignUp;