import axios from "./axiosClient";

const voteApi = {
  createVote: (vote) => {
    return axios.post("/api/votes", vote);
  },
};

export default voteApi;
