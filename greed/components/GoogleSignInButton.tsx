import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, View, Button, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch } from 'react-redux';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { signInStart, signInSuccess, signInFailure } from '../store/authSlice';

// Initialize Google Sign-In configuration
GoogleSignin.configure({
  webClientId: "294221732007-6c0431eiaeaa71g5huf1j20tg4n24r6s.apps.googleusercontent.com",
  offlineAccess: true,
});

const GoogleSignUpButton = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Check if user is already signed in
    const checkIfSignedIn = async () => {
      const isSignedIn = await GoogleSignin.isSignedIn();
      if (isSignedIn) {
        const userInfo = await GoogleSignin.getCurrentUser();
        const googleCredential = GoogleAuthProvider.credential(userInfo.idToken);
        handleFirebaseAuth(googleCredential);
      }
    };
    checkIfSignedIn();
  }, []);

  const handleFirebaseAuth = async (googleCredential) => {
    console.log('Starting Firebase authentication with credential:', googleCredential);
    dispatch(signInStart());
    try {
      const result = await signInWithCredential(auth, googleCredential);
      console.log('Firebase authentication result:', result);
      const firebaseUser = result.user;

      // Check if user already exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (!userDoc.exists()) {
        console.log('User does not exist in Firestore, creating new user');
        // Add new user to Firestore
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          role: 'provider', // Assign a default role
          location: null, // You can update this later with actual location
          token: googleCredential.idToken // Store the token
        });
      } else {
        console.log('User already exists in Firestore');
        // Update the token if the user already exists
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          token: googleCredential.idToken
        }, { merge: true });
      }

      dispatch(signInSuccess(firebaseUser));
      setUserInfo(firebaseUser);
      console.log('Firebase authentication successful:', firebaseUser);
    } catch (error) {
      dispatch(signInFailure(error.message));
      setError(error.message);
      console.error('Error during Firebase authentication:', error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const googleCredential = GoogleAuthProvider.credential(userInfo.idToken);
      handleFirebaseAuth(googleCredential);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign in is in progress already');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services not available or outdated');
      } else {
        setError(error.message);
        console.error('Error during Google sign-in:', error);
      }
    }
  };

  const handleLogout = async () => {
    setUserInfo(null);
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
  };

  return (
    <View style={styles.container}>
      <Text>{error && JSON.stringify(error)}</Text>
      {userInfo && <Text>{JSON.stringify(userInfo)}</Text>}
      {userInfo ? (
        <Button title="Logout" onPress={handleLogout} />
      ) : (
        <TouchableOpacity style={styles.socialButton} onPress={handleGoogleSignIn}>
          <Icon name="google" size={30} color="#db4437" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
});

export default GoogleSignUpButton;


