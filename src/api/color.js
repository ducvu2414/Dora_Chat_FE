import axios from "./axiosClient";

const colorApi = {
    getAll: () => axios.get("/api/colors"),
};

export default colorApi;
