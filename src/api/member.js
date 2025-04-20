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
}

export default memberApi;
