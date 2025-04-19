import { configureStore } from "@reduxjs/toolkit";
import friendReducer from "../features/friend/friendSlice";
import authReducer from "@/features/auth/authSlice";
import chatReducer from "@/features/chat/chatSlice";
import callReducer from "@/features/chat/callSlice";
export const store = configureStore({
  reducer: {
    friend: friendReducer,
    auth: authReducer,
    chat: chatReducer,
    call: callReducer,
  },
});
