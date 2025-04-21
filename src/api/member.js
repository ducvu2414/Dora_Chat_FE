import axios from "./axiosClient";

const memberApi = {
    isMember: (conversationId, userId) => {
        return axios.get("api/members/is-member", {
            params: {
                conversationId,
                userId,
            },
        });
    },

    getMembers: (conversationId) => {
        return axios.get(`api/members/${conversationId}`);
    },
}

export default memberApi;
