import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  chats: [],
  selectedChat: null,
  userNames: {},
  error: null,
  loading: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    fetchChatsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchChatsSuccess(state, action) {
      state.loading = false;
      state.chats = action.payload;
    },
    fetchChatsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    setSelectedChat(state, action) {
      state.selectedChat = action.payload;
    },
    updateSelectedChat(state, action) {
      state.selectedChat = { ...state.selectedChat, ...action.payload };
    },
    setUserNames(state, action) {
      state.userNames = action.payload;
    },
    addMessage(state, action) {
      if (state.selectedChat) {
        state.selectedChat.messages.push(action.payload);
      }
    },
    clearSelectedChat(state) {
      state.selectedChat = null;
    },
  },
});

export const {
  fetchChatsStart,
  fetchChatsSuccess,
  fetchChatsFailure,
  setSelectedChat,
  updateSelectedChat,
  setUserNames,
  addMessage,
  clearSelectedChat,
} = chatSlice.actions;

export default chatSlice.reducer;
