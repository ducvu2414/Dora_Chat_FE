import axios from "./axiosClient";

const pinMessageApi = {
    getAllByConversationId: (conversationId) => {
        const url = `api/pin-messages/${conversationId}`;
        return axios.get(url);
    },

    addPinMessage: (messageId, conversationId, memberId) => {
        return axios.post("api/pin-messages", {
            messageId,
            conversationId,
            pinnedBy: memberId,
        });
    },

    deletePinMessage: (messageId, memberId) => {
        return axios.delete(`api/pin-messages/${messageId}`, {
            data: {
                pinnedBy: memberId,
            },
        });
    }

}

export default pinMessageApi;
