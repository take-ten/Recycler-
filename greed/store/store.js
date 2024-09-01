import { configureStore } from '@reduxjs/toolkit'; // Importing configureStore from Redux Toolkit
import authReducer from './authSlice'; // Importing the authReducer from the authSlice file
import chatReducer from './chatSlice'; // Importing the chatReducer from the chatSlice file
// Configuring the Redux store
const store = configureStore({
  reducer: {
    auth: authReducer, // Adding the authReducer to the store under the 'auth' key
    // chat: chatReducer, // Adding the chatReducer to the store under the 'chat' key
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export default store; // Exporting the configured store as the default export     

// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './authSlice';
// import chatReducer from './chatSlice';

// const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     chat: chatReducer,
//   },
// });

// export default store;
