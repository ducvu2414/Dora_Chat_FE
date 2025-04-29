import axios from "./axiosClient";

const pinMessageApi = {
    getAllByConversationId: (conversationId) => {
        const url = `api/pin-messages/${conversationId}`;
        return axios.get(url);
    },
}

export default pinMessageApi;
