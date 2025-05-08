import axios from "./axiosClient";

const userApi = {
    getUserByPhoneNumber: (phoneNumber) => {
        const url = `api/users/search/phone-number/${phoneNumber}`;
        return axios.get(url);
    },

    getUserByEmail: (email) => {
        const url = `api/users/search/username/${email}`;
        return axios.get(url);
    },

    getByMemberId: (memberId) => {
        const url = `api/users/member/${memberId}`;
        return axios.get(url);
    },
}

export default userApi;
