import axios from "./axiosClient";

const messageApi = {
  fetchConversations: () => {
    return axios.get("/api/messages/conversations");
  },

  fetchMessages: (conversationId) => {
    return axios.get(`/api/messages/${conversationId}`);
  },
  sendMessage: (body) => {
    return axios.post(`/api/messages/text`, body);
  },
  recallMessage: async (messageId, conversationId) => {
    const response = await axios.delete(
      `/api/messages/${messageId}/conversation/${conversationId}`
    );
    return response.data;
  },

  //   markAsRead: (conversationId) => {
  //     return axios.put(`/api/messages/${conversationId}/mark-as-read`);
  //   },
};

export default messageApi;
