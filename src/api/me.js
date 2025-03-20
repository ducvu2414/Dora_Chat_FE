import axios from "./axiosClinet";

const meApi = {
    getProfile: (id) => {
        const url = `api/me/profile/${id}`;
        return axios.get(url);
    },
}

export default meApi;
