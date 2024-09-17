import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  user: null,
  userId: null,
  role: null,
  loading: false,
  error: null,
  location: null,
  geoLocation: null,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signInStart(state) {
      state.loading = true;
      state.error = null;
    },
    signInSuccess(state, action) {
      state.loading = false;
      state.user = {
        uid: action.payload.uid,
        email: action.payload.email,
        displayName: action.payload.displayName,
        photoURL: action.payload.photoURL,
      };
      state.userId = action.payload.uid;
      state.isLoggedIn = true;
      console.log('signInSuccess: user logged in', state.user); // Debug log
      AsyncStorage.setItem('user', JSON.stringify(state.user)); // Save user data to AsyncStorage
    },
    signInFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    signUpStart(state) {
      state.loading = true;
      state.error = null;
    },
    signUpSuccess(state, action) {
      state.loading = false;
      state.user = {
        uid: action.payload.uid,
        email: action.payload.email,
        displayName: action.payload.displayName,
        photoURL: action.payload.photoURL,
      };
      state.userId = action.payload.uid;
      state.isLoggedIn = true;
      console.log('signUpSuccess: user signed up', state.user); // Debug log
      AsyncStorage.setItem('user', JSON.stringify(state.user)); // Save user data to AsyncStorage
    },
    signUpFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    setUserId(state, action) {
      state.userId = action.payload;
      console.log('setUserId:', action.payload); // Debug log
      AsyncStorage.setItem('userId', action.payload); // Save userId to AsyncStorage
    },
    setRole(state, action) {
      state.role = action.payload;
      console.log('setRole:', action.payload); // Debug log
      AsyncStorage.setItem('role', action.payload); // Save role to AsyncStorage
    },
    login(state, action) {
      state.user = action.payload;
      state.isLoggedIn = true;
      console.log('login: user logged in', state.user); // Debug log
      AsyncStorage.setItem('user', JSON.stringify(action.payload)); // Save user data to AsyncStorage
    },
    logout(state) {
      state.user = null;
      state.userId = null;
      state.role = null;
      state.isLoggedIn = false;
      console.log('logout: user logged out'); // Debug log
      AsyncStorage.removeItem('user');
      AsyncStorage.removeItem('userId');
      AsyncStorage.removeItem('role');
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  signUpStart,
  signUpSuccess,
  signUpFailure,
  setUserId,
  setRole,
  login,
  logout,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
