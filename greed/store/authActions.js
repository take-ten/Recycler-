import { 
  signUpStart,
  signUpSuccess,
  signUpFailure,
  signInStart,
  signInSuccess,
  signInFailure,
  setRole,
  setGeoLocation,
} from './authSlice';
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Alert } from 'react-native';

// Handle user sign up
export const handleSignUp = (email, password, username) => async (dispatch) => {
  dispatch(signUpStart());
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    // Save user data to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      name: username,
      uid: user.uid,
      email: user.email,
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

    dispatch(signUpSuccess({
      uid: user.uid,
      email: user.email,
      displayName: username,
      photoURL: null,
    }));
  } catch (error) {
    dispatch(signUpFailure(error.message));
    Alert.alert('Erreur', error.message);
  }
};

// Handle user sign in
export const handleSignIn = (email, password) => async (dispatch) => {
  dispatch(signInStart());
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;
    const userDoc = await getDoc(doc(db, 'users', user.uid));

    if (userDoc.exists()) {
      const userData = userDoc.data();
      dispatch(signInSuccess({
        uid: user.uid,
        email: user.email,
        displayName: userData.name,
        photoURL: userData.photoURL,
      }));
      dispatch(setRole(userData.role));
    } else {
      throw new Error('Utilisateur non trouvé.');
    }
  } catch (error) {
    dispatch(signInFailure(error.message));
    Alert.alert('Erreur', error.message);
  }
};

// Handle Google sign in
export const handleGoogleLogin = (googleCredential) => async (dispatch) => {
  dispatch(signInStart());
  try {
    const result = await signInWithCredential(auth, googleCredential);
    const user = result.user;
    const userDoc = await getDoc(doc(db, 'users', user.uid));

    if (userDoc.exists()) {
      const userData = userDoc.data();
      dispatch(signInSuccess({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      }));
      dispatch(setRole(userData.role));
    } else {
      // Save new user data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: user.displayName,
        uid: user.uid,
        email: user.email,
        photoURL: user.photoURL,
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

      dispatch(signInSuccess({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      }));
    }
  } catch (error) {
    dispatch(signInFailure(error.message));
    Alert.alert('Erreur', error.message);
  }
};

// Handle setting geo-location
export const handleSetGeoLocation = (geoLocation) => async (dispatch) => {
  dispatch(setGeoLocation(geoLocation));
};