import axios from "./axiosClient";

const messageApi = {
  fetchConversations: () => {
    return axios.get("/api/messages/conversations");
  },

  fetchMessages: (conversationId, params = {}) => {
    return axios.get(`/api/messages/${conversationId}?skip=${params.skip}`);
  },
  fetchMessagesByChannelId: (channelId, params = {}) => {
    return axios.get(
      `/api/messages/channel/${channelId}?limit=${params.limit}&skip=${params.skip}`
    );
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

  async sendImageMessage(conversationId, images, channelId) {
    const formData = new FormData();
    formData.append("conversationId", conversationId);
    formData.append("channelId", channelId);
    images.forEach((image) => formData.append("image", image));
    const res = await axios.post(`/api/messages/images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  async sendFileMessage(conversationId, file, channelId) {
    const formData = new FormData();
    formData.append("conversationId", conversationId);
    formData.append("channelId", channelId);
    formData.append("file", file);
    const res = await axios.post(`/api/messages/file`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
  deleteMessageForMe: async (messageId, conversationId) => {
    const response = await axios.delete(`/api/messages/${messageId}/only`, {
      data: { conversationId },
    });
    return response.data;
  },
  //   markAsRead: (conversationId) => {
  //     return axios.put(`/api/messages/${conversationId}/mark-as-read`);
  //   },
  async sendVideoMessage(conversationId, video, channelId) {
    const formData = new FormData();
    formData.append("conversationId", conversationId);
    formData.append("video", video);
    formData.append("channelId", channelId);
    const res = await axios.post(`/api/messages/video`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("res", res.data);
    return res.data;
  },

  convertTextToSpeech: async (text, speaker_id = 1, speed = 1.0) => {
    const res = await axios.post(`/api/messages/tts`, {
      text,
      speaker_id,
      speed,
    });
    console.log(res);
    return res;
  },
  reactToMessage: async ({ conversationId, messageId, reactType }) => {
    return axios
      .post("/api/messages/react", {
        conversationId,
        messageId,
        reactType,
      })
      .then((res) => res.data);
  },
};

export default messageApi;
