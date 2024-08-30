import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { GoogleSignin, statusCodes, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { signInStart, signInSuccess, signInFailure, setUserId, setRole } from '../store/authSlice';

GoogleSignin.configure({
  webClientId: process.env.WEB_CLIENT_ID,
  offlineAccess: true,
});

const GoogleSignInButtonComponent = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const userId = useSelector((state: any) => state.auth.userId);
  const role = useSelector((state: any) => state.auth.role);

  useEffect(() => {
    const checkIfSignedIn = async () => {
      const userInfo = await GoogleSignin.getCurrentUser();
      if (userInfo) {
        const googleCredential: any = GoogleAuthProvider.credential(userInfo.idToken);
        handleFirebaseAuth(googleCredential);
      }
    };
    checkIfSignedIn();
  }, []);

  const handleFirebaseAuth = async (googleCredential: any) => {
    dispatch(signInStart());
    try {
      const result = await signInWithCredential(auth, googleCredential);
      const firebaseUser = result.user;

      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          role: null,
          location: null,
          phone: null,
          status: null,
          points: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          token: googleCredential.idToken
        });
      } else {
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          token: googleCredential.idToken
        }, { merge: true });
      }

      // Dispatch only serializable data
      dispatch(signInSuccess({
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName,
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL
      }));
      dispatch(setUserId(firebaseUser.uid));
      setUserInfo(firebaseUser);
    } catch (error: any) {
      dispatch(signInFailure(error.message));
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const googleCredential = GoogleAuthProvider.credential(userInfo.idToken);
      handleFirebaseAuth(googleCredential);
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign in is in progress already');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services not available or outdated');
      } else {
        setError(error.message);
      }
    }
  };

  return (
    <View>
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={handleGoogleSignIn}
      />
    </View>
  );
};

export default GoogleSignInButtonComponent;


