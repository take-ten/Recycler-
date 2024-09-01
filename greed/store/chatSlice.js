import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
  error: null,
  loading: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    fetchMessagesStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchMessagesSuccess(state, action) {
      state.loading = false;
      state.messages = action.payload;
    },
    fetchMessagesFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    addMessage(state, action) {
      state.messages.push(action.payload);
    },
    clearMessages(state) {
      state.messages = [];
    },
  },
});

export const {
  fetchMessagesStart,
  fetchMessagesSuccess,
  fetchMessagesFailure,
  addMessage,
  clearMessages,
} = chatSlice.actions;

export default chatSlice.reducer;
