import axios from "./axiosClient";

const cloudinaryApi = {
  uploadImage: (data) => {
    return axios.post("/api/uploads/image", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default cloudinaryApi;
