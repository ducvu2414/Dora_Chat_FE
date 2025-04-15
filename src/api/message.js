import axios from "./axiosClient";

const messageApi = {
  fetchConversations: () => {
    return axios.get("/api/messages/conversations");
  },

  fetchMessages: (conversationId) => {
    return axios.get(`/api/messages/${conversationId}`);
  },
  sendTextMessage: (body) => {
    return axios.post(`/api/messages/text`, body);
  },
  recallMessage: async (messageId, conversationId) => {
    const response = await axios.delete(
      `/api/messages/${messageId}/conversation/${conversationId}`
    );
    return response.data;
  },

  async sendImageMessage(conversationId, images) {
    const formData = new FormData();
    formData.append("conversationId", conversationId);
    images.forEach((image) => formData.append("image", image));
    const res = await axios.post(`/api/messages/images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  async sendFileMessage(conversationId, file) {
    const formData = new FormData();
    formData.append("conversationId", conversationId);
    formData.append("file", file);
    const res = await axios.post(`/api/messages/file`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
  //   markAsRead: (conversationId) => {
  //     return axios.put(`/api/messages/${conversationId}/mark-as-read`);
  //   },
  async sendVideoMessage(conversationId, video) {
    const formData = new FormData();
    formData.append("conversationId", conversationId);
    formData.append("video", video);
    const res = await axios.post(`/api/messages/video`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("res", res.data);
    return res.data;
  }
};

export default messageApi;
