import axios from "./axiosClient";
const colorsApi = {
    getAll: () => axios.get("/api/colors"),
};
export default colorsApi;
