import axios from "./axiosClient";

const meApi = {
  getProfile: () => {
    const url = `api/me/profile`;
    return axios.get(url);
  },
  putProfile: (data) => {
    const url = `api/me/profile`;
    return axios.put(url, data);
  },
  updatePassword: (data) => {
    const url = `api/me/password`;
    return axios.put(url, data);
  },
  uploadAvatar: (data) => {
    const url = `api/me/avatar`;
    return axios.put(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  uploadCover: (data) => {
    const url = `api/me/cover`;
    return axios.put(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default meApi;
