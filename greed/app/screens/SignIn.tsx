import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/authSlice';
import { handleGoogleLogin } from '../../store/authActions';
import GoogleSignInButton from '../../components/GoogleSignInButton';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import CryptoJS from 'crypto-js'; // Import crypto-js

const SignIn = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const role = useSelector((state: any) => state.auth.role);

  const handleLogin = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const hashedPassword = CryptoJS.SHA256(password).toString(); // Hash the password

        if (hashedPassword === userData.password) { // Compare hashed password
          dispatch(login({ email, password }));
          navigation.navigate(role === 'Provider' ? 'ProviderDef' : 'CollectorDef');
        } else {
          Alert.alert('Erreur', 'Mot de passe incorrect.');
        }
      } else {
        Alert.alert('Erreur', 'Utilisateur non trouvé.');
      }
    } catch (error) {
      Alert.alert('Erreur', error.message);
    }
  };

  const loginWithGoogle = () => {
    dispatch<any>(handleGoogleLogin());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Toujours heureux de vous revoir</Text>
      <TextInput
        style={styles.input}
        placeholder="Mail ou Tel"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Votre mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.forgotPassword}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
        <Text style={styles.signInButtonText}>Entrer</Text>
      </TouchableOpacity>
      <Text style={styles.orText}>ou se connecter avec</Text>
      <View style={styles.socialButtons}>
        <GoogleSignInButton onPress={loginWithGoogle} />
      </View>
      <Text style={styles.noAccountText}>Vous n'avez pas de compte ?</Text>
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.signUpText}>Inscrivez-vous maintenant !</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#888',
  },
  signInButton: {
    backgroundColor: '#34C759',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  orText: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#888',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center', // Center the Google button
    marginBottom: 20,
  },
  noAccountText: {
    textAlign: 'center',
    color: '#888',
  },
  signUpText: {
    textAlign: 'center',
    color: '#34C759',
    fontWeight: 'bold',
  },
});

export default SignIn;