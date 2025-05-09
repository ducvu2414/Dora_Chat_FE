import axios from "./axiosClient";

const channelApi = {
  getAllChannelByConversationId: (conversationId) => {
    return axios.get(`api/channels/${conversationId}`);
  },

  deleteChannel: (channelId, memberId, conversationId) => {
    return axios.delete(`api/channels/${channelId}`, {
      data: {
        memberId,
        conversationId,
      },
    });
  },
};

export default channelApi;
