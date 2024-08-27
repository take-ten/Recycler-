import { configureStore } from '@reduxjs/toolkit'; // Importing configureStore from Redux Toolkit
import authReducer from './authSlice'; // Importing the authReducer from the authSlice file

// Configuring the Redux store
const store = configureStore({
  reducer: {
    auth: authReducer, // Adding the authReducer to the store under the 'auth' key
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export default store; // Exporting the configured store as the default export     