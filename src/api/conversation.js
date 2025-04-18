import axios from "./axiosClient";

const conversationApi = {
  fetchConversations: () => {
    return axios.get("/api/conversations");
  },
  createConversation: (userIds) => {
    return axios.post(`/api/conversations/individuals/${userIds}`);
  },
  getConversationById: (conversationId) => {
    return axios.get(`/api/conversations/${conversationId}`);
  },
  createGroupConversation: (name, members) => {
    return axios.post("/api/conversations/groups", {
      name,
      members,
    });
  }
  //   markAsRead: (conversationId) => {
  //     return axios.put(`/api/messages/${conversationId}/mark-as-read`);
  //   },
};

export default conversationApi;
