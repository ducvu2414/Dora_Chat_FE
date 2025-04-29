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

    getByConversationIdAndUserId: (conversationId, userId) => {
        return axios.get(`api/members/${conversationId}/${userId}`);
    },

    getByMemberId: (memberId) => {
        return axios.get(`api/members/member/${memberId}`);
    },
}

export default memberApi;
