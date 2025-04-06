import axios from "./axiosClient";

const friendApi = {
    fetchFriends: (id, name) => {
        console.log(id, name);
        return axios.get(`/api/friends`, {
            params: {
                _id: id,
                name,
            },
        });
    },
    acceptRequestFriend: (userId) => {
        return axios.post(`/api/friends/${userId}`);
    },

    deleteFriend: (userId) => {
        return axios.delete(`/api/friends/${userId}`);
    },

    fetchListRequestFriend: () => {
        return axios.get(`/api/friends/invites`);
    },

    deleteRequestFriend: (userId) => {
        return axios.delete(`/api/friends/invites/${userId}`);
    },

    sendRequestFriend: (userId) => {
        return axios.post(`/api/friends/invites/me/${userId}`);
    },

    deleteSentRequestFriend: (userId) => {
        return axios.delete(`/api/friends/invites/me/${userId}`);
    },

    fetchMyRequestFriend: () => {
        return axios.get(`/api/friends/invites/me`);
    },
    fetchSuggestFriend: (page = 0, size = 12) => {
        return axios.get(`/api/friends/suggest`, {
            params: {
                page,
                size,
            },
        });
    },
};

export default friendApi;