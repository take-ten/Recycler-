import { 
  signUpStart,
  signUpSuccess,
  signUpFailure,
  signInStart,
  signInSuccess,
  signInFailure,
  setLocation,
  setRole,
  setGeoLocation 
} from './authSlice';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  AppleAuthProvider 
} from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

// Handle Google Sign-In
export const handleGoogleLogin = () => async (dispatch) => {
  console.log("Google login button clicked"); // Add logging
  dispatch(signInStart());

  try {
    console.log("Attempting to sign in with Google"); // Add logging
    const [request, response, promptAsync] = Google.useAuthRequest({
      expoClientId: process.env.EXPO_CLIENT_ID,
      iosClientId: process.env.IOS_CLIENT_ID,
      androidClientId: process.env.ANDROID_CLIENT_ID,
      webClientId: process.env.WEB_CLIENT_ID,
    });

    if (response?.type === 'success') {
      const { id_token } = response.params;
      const googleCredential = GoogleAuthProvider.credential(id_token);
      const result = await signInWithCredential(auth, googleCredential);
      console.log("Google sign-in result: ", result); // Add logging
      const firebaseUser = result.user;

      // Check if user already exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (!userDoc.exists()) {
        // Add new user to Firestore
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          role: 'provider', // Assign a default role
          location: null // You can update this later with actual location
        });
        console.log("User added to Firestore"); // Add logging
      } else {
        console.log("User already exists in Firestore"); // Add logging
      }

      dispatch(signInSuccess(firebaseUser));
      console.log("Google sign-in successful"); // Add logging
    } else {
      dispatch(signInFailure("Google sign-in was cancelled"));
    }
  } catch (error) {
    dispatch(signInFailure(error.message));
    console.error("Error during Google sign-in: ", error); // Add logging
  }
};

// Handle Facebook Sign-In
export const handleFacebookLogin = () => async (dispatch) => {
  dispatch(signInStart());
  const provider = new FacebookAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if user already exists in Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      // Add new user to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        role: 'provider', // Assign a default role
        location: null // You can update this later with actual location
      });
    }

    dispatch(signInSuccess(user));
  } catch (error) {
    dispatch(signInFailure(error.message));
  }
};

// Handle Apple Sign-In
export const handleAppleLogin = () => async (dispatch) => {
  dispatch(signInStart());
  const provider = new AppleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if user already exists in Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      // Add new user to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        role: 'provider', // Assign a default role
        location: null // You can update this later with actual location
      });
    }

    dispatch(signInSuccess(user));
  } catch (error) {
    dispatch(signInFailure(error.message));
  }
};

// Handle Sign-Up with Email and Password
export const handleEmailSignUp = (email, password) => async (dispatch) => {
  dispatch(signUpStart());

  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    // Add new user to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      role: 'provider', // Assign a default role
      location: null // You can update this later with actual location
    });

    dispatch(signUpSuccess(user));
  } catch (error) {
    dispatch(signUpFailure(error.message));
  }
};

// Handle setting user location
export const handleSetLocation = (location) => async (dispatch) => {
  dispatch(setLocation(location));
};

// Handle setting user role
export const handleSetRole = (role) => async (dispatch) => {
  dispatch(setRole(role));
};

// Handle setting user geolocation
export const handleSetGeoLocation = (geoLocation) => async (dispatch) => {
  dispatch(setGeoLocation(geoLocation));
};