import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: {}, // { conversationId: [message] }
    unread: {}, // { conversationId: number }
    conversations: [], // Danh sách conversation
    activeConversationId: null, // Cuộc trò chuyện đang mở
  },
  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    addConversation: (state, action) => {
      const conversation = action.payload;
      // Kiểm tra xem conversation đã tồn tại chưa
      if (!state.conversations.some((conv) => conv._id === conversation._id)) {
        state.conversations.unshift(conversation); // Thêm vào đầu danh sách
        state.unread[conversation._id] = conversation.unreadCount || 0;
      }
    },
    updateConversation: (state, action) => {
      const { conversationId, lastMessage } = action.payload;
      const index = state.conversations.findIndex(
        (conv) => conv._id === conversationId
      );
      if (index !== -1) {
        state.conversations[index].lastMessageId = lastMessage;
        state.conversations = [
          state.conversations[index],
          ...state.conversations.slice(0, index),
          ...state.conversations.slice(index + 1),
        ];
      }
    },
    setMessages: (state, action) => {
      const { conversationId, messages } = action.payload;
      state.messages[conversationId] = messages;
      state.unread[conversationId] = 0;
    },
    addMessage: (state, action) => {
      const { conversationId, message } = action.payload;
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      const exists = state.messages[conversationId].some(
        (m) => m._id === message._id
      );
      if (!exists) {
        state.messages[conversationId].push(message);
        // Chỉ tăng badge nếu không phải cuộc trò chuyện đang mở
        if (state.activeConversationId !== conversationId) {
          state.unread[conversationId] =
            (state.unread[conversationId] || 0) + 1;
        }
      }
    },
    markRead: (state, action) => {
      const { conversationId } = action.payload;
      state.unread[conversationId] = 0;
    },
    setActiveConversation: (state, action) => {
      state.activeConversationId = action.payload;
      if (action.payload && state.unread[action.payload]) {
        state.unread[action.payload] = 0; // Reset badge khi mở cuộc trò chuyện
      }
    },
    recallMessage: (state, action) => {
      const { messageId, conversationId, isRecalled, content } = action.payload;
      const messages = state.messages[conversationId];
      if (messages) {
        const index = messages.findIndex((m) => m._id === messageId);
        if (index !== -1) {
          messages[index].isDeleted = isRecalled;
          messages[index].content = content;
        }
      }
    },
  },
});

export const {
  setConversations,
  addConversation,
  updateConversation,
  setMessages,
  addMessage,
  markRead,
  setActiveConversation,
  recallMessage,
} = chatSlice.actions;
export default chatSlice.reducer;
