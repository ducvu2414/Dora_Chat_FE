import axios from "./axiosClient";

const conversationApi = {
  fetchConversations: () => {
    return axios.get("/api/conversations");
  },
  createConversation: (userIds) => {
    return axios.post(`/api/conversations/individuals/${userIds}`);
  },
  addMembersToConversation: (conversationId, members) => {
    return axios.post(`/api/conversations/${conversationId}/members`, {
      userIds: members,
    });
  },
  getConversationById: (conversationId) => {
    return axios.get(`/api/conversations/${conversationId}`);
  },
  createGroupConversation: (name, members) => {
    return axios.post("/api/conversations/groups", {
      name,
      members,
    });
  },
  updateGroupName: (conversationId, name) => {
    return axios.patch(`/api/conversations/${conversationId}/name`, { name });
  },
  //   markAsRead: (conversationId) => {
  //     return axios.put(`/api/messages/${conversationId}/mark-as-read`);
  //   },
};

export default conversationApi;
