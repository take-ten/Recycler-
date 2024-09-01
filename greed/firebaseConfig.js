import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  API_KEY,
  AUTH_DOMAIN,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  APP_ID,
} from '@env';

const firebaseConfig = {
  apiKey: "AIzaSyBEYSTeKqpsRbneQbc4nSfhkQPEpo5wr9E",
  authDomain: "greed-d302a.firebaseapp.com",
  projectId: "greed-d302a",
  storageBucket: "greed-d302a.appspot.com",
  messagingSenderId: "294221732007",
  appId: "1:294221732007:android:12764a5504abe2627ea382",
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage for persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const storage = getStorage(app);

const db = getFirestore(app);

export { auth, db };