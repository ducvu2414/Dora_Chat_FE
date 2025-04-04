import axios from "./axiosClinet";

const userApi = {
    getUserByPhoneNumber: (phoneNumber) => {
        const url = `api/users/search/phoneNumber/${phoneNumber}`;
        return axios.get(url);
    },
}

export default userApi;
