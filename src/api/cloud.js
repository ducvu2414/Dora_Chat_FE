import axios from "./axiosClient";

const cloudApi = {
  uploadImages: async (userId, files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("image", file));
    formData.append("id", userId);
    const response = await axios.post("/api/uploads/images", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    // return response.data.images;
    return response;
  },
  uploadFile: async (userId, file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("id", userId);
    const response = await axios.post("/api/uploads/files", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    // return response.data.file;
    return response;
  },
};
export default cloudApi;
