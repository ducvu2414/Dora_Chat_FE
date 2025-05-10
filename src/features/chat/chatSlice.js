import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: {}, // { conversationId: [message] }
    unread: {}, // { conversationId: number }
    conversations: [], // Danh sách conversation
    activeConversationId: null, // Cuộc trò chuyện đang mở
    pinMessages: [], // Danh sách tin nhắn đã ghim
    classifies: [], // Mảng phân loại
    channels: [], // Danh sách kênh
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
    updateNameConversation: (state, action) => {
      const { conversationId, name } = action.payload;
      const index = state.conversations.findIndex(
        (conv) => conv._id === conversationId
      );
      if (index !== -1) {
        state.conversations[index].name = name;
      }
    },
    updateMemberName: (state, action) => {
      const { conversationId, memberId, name } = action.payload;
      const conversation = state.conversations.find(
        (conv) => conv._id === conversationId
      );
      if (conversation) {
        const memberIndex = conversation.members.findIndex(
          (member) => member._id === memberId
        );
        if (memberIndex !== -1) {
          conversation.members[memberIndex].name = name;
        }
      }
    },
    setMessages: (state, action) => {
      const { conversationId, messages } = action.payload;
      state.messages[conversationId] = messages;
      state.unread[conversationId] = 0;
    },

    updateVote: (state, action) => {
      const { conversationId, message } = action.payload;

      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      const index = state.messages[conversationId].findIndex(
        (m) => m._id === message._id
      );
      
      if (index !== -1) {
        state.messages[conversationId][index].options = message.options;
      } else {
        state.messages[conversationId].push(message);
      }
    },

    lockVote: (state, action) => {
      const { conversationId, message } = action.payload;

      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      const index = state.messages[conversationId].findIndex(
        (m) => m._id === message._id
      );
      
      if (index !== -1) {
        state.messages[conversationId][index].lockedVote = message.lockedVote;
      } else {
        state.messages[conversationId].push(message);
      }
    },

    setClassifies: (state, action) => {
      state.classifies = action.payload;
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
    deleteMessageForMe: (state, action) => {
      const { messageId, conversationId, deletedMemberIds, newLastMessage } =
        action.payload;
      const messages = state.messages[conversationId];
      if (messages) {
        const index = messages.findIndex((m) => m._id === messageId);
        if (index !== -1) {
          messages[index].deletedMemberIds = deletedMemberIds;
          messages.splice(index, 1);
        }
      }
      // Cập nhật lastMessage trong conversations
      const convIndex = state.conversations.findIndex(
        (conv) => conv._id === conversationId
      );
      if (convIndex !== -1 && newLastMessage) {
        state.conversations[convIndex].lastMessageId = newLastMessage || null;
      }
    },

    deleteAllMessages: (state, action) => {
      const { conversationId } = action.payload;
      if (state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
    },
    updateLeader: (state, action) => {
      const { conversationId, newAdmin } = action.payload;
      const conversation = state.conversations.find(
        (conv) => conv._id === conversationId
      );
      if (conversation) {
        conversation.leaderId = newAdmin._id;
      }
    },
    leaveConverSation: (state, action) => {
      const { conversationId, member, disbanded } = action.payload;
      const conversation = state.conversations.find(
        (conv) => conv._id === conversationId
      );
      if (conversation) {
        conversation.members = conversation.members.filter((m) => m !== member);
        // Nếu không còn thành viên nào, xóa cuộc trò chuyện
        if (disbanded) {
          state.conversations = state.conversations.filter(
            (conv) => conv._id !== conversationId
          );
          delete state.messages[conversationId];
          delete state.unread[conversationId];
        }
      }
    },
    disbandConversation: (state, action) => {
      const { conversationId } = action.payload;
      const index = state.conversations.findIndex(
        (conv) => conv._id === conversationId
      );
      if (index !== -1) {
        state.conversations.splice(index, 1);
        delete state.messages[conversationId];
        delete state.unread[conversationId];
      }
    },

    setPinMessages: (state, action) => {
      state.pinMessages = action.payload;
    },

    addPinMessage: (state, action) => {
      const pinMessage = action.payload;
      if (!state.pinMessages.some((msg) => msg._id === pinMessage._id)) {
        state.pinMessages.push(pinMessage); 
      }
    },

    deletePinMessage: (state, action) => {
      const { _id } = action.payload;
      state.pinMessages = state.pinMessages.filter((msg) => msg._id !== _id);
    },

    setChannels: (state, action) => {
      state.channels = action.payload;
    },

    addChannel: (state, action) => {
      const channel = action.payload;
      if (!state.channels.some((ch) => ch._id === channel._id)) {
        state.channels.push(channel);
      }
    },

    deleteChannel: (state, action) => {
      const { _id } = action.payload;
      state.channels = state.channels.filter((ch) => ch._id !== _id);
    },

    updateChannel: (state, action) => {
      const { _id, name } = action.payload;
      const index = state.channels.findIndex((ch) => ch._id === _id);
      if (index !== -1) {
        state.channels[index].name = name;
      }
    },

    updateAvatarGroupConversation: (state, action) => {
      const { conversationId, avatar } = action.payload;
      const index = state.conversations.findIndex(
        (conv) => conv._id === conversationId
      );
      if (index !== -1) {
        state.conversations[index].avatar = avatar;
      }
    },
  },
});

export const {
  setConversations,
  addConversation,
  updateConversation,
  setActiveConversation,
  disbandConversation,
  setMessages,
  updateVote,
  lockVote,
  addMessage,
  recallMessage,
  deleteMessageForMe,
  deleteAllMessages,
  markRead,
  updateLeader,
  setPinMessages,
  addPinMessage,
  deletePinMessage,
  leaveConverSation,
  setClassifies,
  updateNameConversation,
  updateMemberName,
  setChannels,
  addChannel,
  deleteChannel,
  updateChannel,
  updateAvatarGroupConversation,
} = chatSlice.actions;
export default chatSlice.reducer;
