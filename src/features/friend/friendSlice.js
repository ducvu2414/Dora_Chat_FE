import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  friends: [],
  requestFriends: [],
  myRequestFriends: [],
  suggestFriends: [],
  amountNotify: 0,
  friendChats: [],
};

export const friendSlice = createSlice({
  name: 'friend',
  initialState,
  reducers: {
    setFriends: (state, action) => {
      state.friends = action.payload;
    },
    setNewFriend: (state, action) => {
      state.friends = [...state.friends, action.payload];
    },
    updateFriend: (state, action) => {
      state.friends = state.friends.filter(friend => friend._id !== action.payload);
    },
    setRequestFriends: (state, action) => {
      state.requestFriends = action.payload;
    },
    setNewRequestFriend: (state, action) => {
      state.requestFriends = [...state.requestFriends, action.payload];
    },
    updateRequestFriends: (state, action) => {
      state.requestFriends = state.requestFriends.filter(
        friend => friend._id !== action.payload
      );
    },
    setMyRequestFriend: (state, action) => {
      state.myRequestFriends = state.myRequestFriends.filter(
        friend => friend._id !== action.payload
      );
    },
    setMyRequestFriends: (state, action) => {
      state.myRequestFriends = action.payload;
    },
    updateMyRequestFriend: (state, action) => {
      state.myRequestFriends = state.myRequestFriends.filter(
        friend => friend._id !== action.payload
      );
    },
    setSuggestFriends: (state, action) => {
      state.suggestFriends = action.payload;
    },
    setAmountNotify: (state, action) => {
      state.amountNotify = action.payload;
    },
    setFriendChats: (state, action) => {
      state.friendChats = action.payload;
    },
    updateFriendChat: (state, action) => {
      state.friendChats = state.friendChats.filter(
        friend => friend._id !== action.payload
      );
    },
  },
});

export const {
  setFriends,
  setNewFriend,
  updateFriend,
  setRequestFriends,
  setNewRequestFriend,
  updateRequestFriends,
  setMyRequestFriend,
  setMyRequestFriends,
  updateMyRequestFriend,
  setSuggestFriends,
  setAmountNotify,
  setFriendChats,
  updateFriendChat,
} = friendSlice.actions;

export default friendSlice.reducer;