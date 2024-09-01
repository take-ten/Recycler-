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
      AsyncStorage.setItem('user', JSON.stringify(state.user)); // Save user data to AsyncStorage
    },
    signUpFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    setUserId(state, action) {
      state.userId = action.payload;
      AsyncStorage.setItem('userId', action.payload); // Save userId to AsyncStorage
    },
    setRole(state, action) {
      state.role = action.payload;
      AsyncStorage.setItem('role', action.payload); // Save role to AsyncStorage
    },
    login(state, action) {
      state.user = action.payload;
      state.isLoggedIn = true;
      AsyncStorage.setItem('user', JSON.stringify(action.payload)); // Save user data to AsyncStorage
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
} = authSlice.actions;

export default authSlice.reducer;
