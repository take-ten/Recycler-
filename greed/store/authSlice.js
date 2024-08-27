import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isLoggedIn: false,
  error: null,
  location: null,
  role: null,
  geoLocation: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signUpStart(state) {
      state.error = null;
    },
    login(state, action) {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    signUpSuccess(state, action) {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    signUpFailure(state, action) {
      state.error = action.payload;
    },
    signInStart(state) {
      state.error = null;
    },
    signInSuccess(state, action) {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    signInFailure(state, action) {
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.isLoggedIn = false;
    },
    setLocation(state, action) {
      state.location = action.payload;
    },
    setRole(state, action) {
      state.role = action.payload;
    },
    setGeoLocation(state, action) {
      state.geoLocation = action.payload;
    },

  },
});

export const {
  signUpStart,
  signUpSuccess,
  signUpFailure,
  signInStart,
  signInSuccess,
  signInFailure,
  logout,
  login,
  setLocation,
  setRole,
  setGeoLocation,
} = authSlice.actions;

export default authSlice.reducer;
