import axios from "./axiosClient";

const channelApi = {
  getAllChannelByConversationId: (conversationId) => {
    const url = `api/channels/${conversationId}`;
    return axios.get(url);
  },
};

export default channelApi;
