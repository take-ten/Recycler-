import { 
  signUpStart,
  signUpSuccess,
  signUpFailure,
  signInStart,
  signInSuccess,
  signInFailure,
  setLocation,
  setRole,
  setGeoLocation,
  setUserId
} from './authSlice';
import { getAuth, signInWithEmailAndPassword, signInWithCredential, createUserWithEmailAndPassword } from 'firebase/auth';
import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, AppleAuthProvider } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export const handleGoogleLogin = () => async (dispatch) => {
  dispatch(signInStart());

  try {
    const [request, response, promptAsync] = Google.useAuthRequest({
      expoClientId: "294221732007-6c0431eiaeaa71g5huf1j20tg4n24r6s.apps.googleusercontent.com",
      iosClientId: "294221732007-u2v5cib99qgkcdmuh42roqll40t7a2gf.apps.googleusercontent.com",
      androidClientId: "294221732007-sovs9d1fdop78toulo6iavn8ducnbeiq.apps.googleusercontent.com",
      webClientId: "294221732007-6c0431eiaeaa71g5huf1j20tg4n24r6s.apps.googleusercontent.com",
    });

    if (response?.type === 'success') {
      const { id_token } = response.params;
      const googleCredential = GoogleAuthProvider.credential(id_token);
      const result = await signInWithCredential(auth, googleCredential);
      const firebaseUser = result.user;

      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          role: 'provider',
          location: null,
        });
        dispatch(setRole('provider'));
      } else {
        dispatch(setRole(userDoc.data().role));
      }

      dispatch(signInSuccess(firebaseUser));
      dispatch(setUserId(firebaseUser.uid));
    } else {
      dispatch(signInFailure('Google sign-in was cancelled'));
    }
  } catch (error) {
    dispatch(signInFailure(error.message));
  }
};

export const handleEmailSignUp = (email, password) => async (dispatch) => {
  dispatch(signUpStart());

  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      role: null, // Role will be set in the next screen
      location: null,
    });

    dispatch(signUpSuccess(user));
    dispatch(setUserId(user.uid));
    dispatch(setRole(null)); // Role will be set in the next screen
  } catch (error) {
    dispatch(signUpFailure(error.message));
  }
};

// Handle setting location
export const handleSetLocation = (location) => async (dispatch) => {
  dispatch(setLocation(location));
};

// Handle setting role
export const handleSetRole = (role) => async (dispatch) => {
  dispatch(setRole(role));
};

// Handle setting geo-location
export const handleSetGeoLocation = (geoLocation) => async (dispatch) => {
  dispatch(setGeoLocation(geoLocation));
};